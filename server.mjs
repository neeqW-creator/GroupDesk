import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { page, loginPage, salesPage, receptionPage } from './src/pages.mjs';

const SESSION_TTL = 8 * 60 * 60 * 1000;
const IDLE_TTL = 30 * 60 * 1000;
const MAX_SESSIONS = 1000;

export function configuration(env = process.env) {
  const origin = new URL(env.APP_ORIGIN || env.RENDER_EXTERNAL_URL || 'http://localhost:3000');
  const url = new URL(env.SUPABASE_URL || '');
  const key = env.SUPABASE_PUBLISHABLE_KEY || '';
  if (origin.href !== `${origin.origin}/` || origin.username || origin.password ||
      !['http:', 'https:'].includes(origin.protocol) ||
      (origin.protocol !== 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) ||
      url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
      !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    throw new Error('Nieprawidłowa konfiguracja aplikacji.');
  }
  return { origin: origin.origin, supabaseUrl: url.origin, key, secure: origin.protocol === 'https:' };
}

// Only administrator-controlled, fresh app_metadata can grant access.
export function accessFor(user) {
  const access = user?.app_metadata?.groupdesk;
  if (!user?.id || user.is_anonymous === true || access?.active !== true) return null;
  if (access.role === 'sales') return { userId: user.id, role: 'sales', hotelId: null };
  if (access.role === 'reception' && typeof access.hotel_id === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(access.hotel_id)) {
    return { userId: user.id, role: 'reception', hotelId: access.hotel_id };
  }
  return null;
}

class AuthError extends Error {
  constructor(status) { super('AUTH_UNAVAILABLE'); this.status = status; }
}

export function createApp({ config, fetchImpl = fetch, now = Date.now,
  indexPath = new URL('./index.html', import.meta.url) }) {
  const sessions = new Map();
  const attempts = new Map();
  const cookieName = config.secure ? '__Host-groupdesk_session' : 'groupdesk_session';

  function cookie(value, maxAge) {
    return `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${config.secure ? '; Secure' : ''}`;
  }
  function sessionId(req) {
    const value = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(`${cookieName}=`));
    const id = value?.slice(cookieName.length + 1);
    return /^[a-f0-9]{64}$/.test(id || '') ? id : null;
  }
  function forget(req, res) {
    sessions.delete(sessionId(req));
    res.setHeader('Set-Cookie', cookie('', 0));
  }
  function prune() {
    for (const [id, session] of sessions) {
      if (session.expires <= now() || session.lastSeen + IDLE_TTL <= now()) sessions.delete(id);
    }
    for (const [id, entry] of attempts) if (entry.until <= now()) attempts.delete(id);
  }
  async function auth(path, { token, body, method = 'GET' } = {}) {
    let response;
    try {
      response = await fetchImpl(`${config.supabaseUrl}/auth/v1/${path}`, {
        method, redirect: 'error', signal: AbortSignal.timeout(10000),
        headers: { apikey: config.key, ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(body ? { 'Content-Type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch { throw new AuthError(503); }
    if (!response.ok) throw new AuthError(response.status);
    if (response.status === 204) return null;
    try { return await response.json(); } catch { throw new AuthError(503); }
  }
  function assignTokens(session, data) {
    if (!data?.access_token || !data?.refresh_token || !Number.isFinite(data.expires_in) || data.expires_in <= 0) {
      throw new AuthError(503);
    }
    session.accessToken = data.access_token;
    session.refreshToken = data.refresh_token;
    session.tokenExpires = now() + data.expires_in * 1000;
  }
  async function refresh(session) {
    // Serialize token rotation across concurrent requests from tabs in one session.
    if (!session.refreshing) {
      session.refreshing = auth('token?grant_type=refresh_token', {
        method: 'POST', body: { refresh_token: session.refreshToken },
      }).then(data => assignTokens(session, data)).finally(() => { session.refreshing = null; });
    }
    await session.refreshing;
  }
  async function identify(req, res) {
    const id = sessionId(req);
    const session = sessions.get(id);
    if (!session) { if (id) forget(req, res); return null; }
    try {
      if (session.tokenExpires <= now() + 30000) await refresh(session);
      const user = await auth('user', { token: session.accessToken });
      const access = accessFor(user);
      if (!access || access.userId !== session.userId) { forget(req, res); return null; }
      session.lastSeen = now();
      return { ...access, session };
    } catch (error) {
      if ([400, 401, 403, 404, 422].includes(error.status)) { forget(req, res); return null; }
      throw error;
    }
  }
  function send(res, status, body, type = 'text/html; charset=utf-8') {
    res.writeHead(status, { 'Content-Type': type }); res.end(body);
  }
  function redirect(res, location) { res.writeHead(303, { Location: location }); res.end(); }
  const home = access => access.role === 'sales' ? '/app' : '/reception';
  async function formBody(req) {
    if (req.headers['content-type']?.split(';')[0] !== 'application/x-www-form-urlencoded') throw new AuthError(415);
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 8192) throw new AuthError(413);
      chunks.push(chunk);
    }
    return new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
  }

  const server = createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Vary', 'Cookie');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    // no-referrer makes browser form POSTs send Origin: null, breaking the CSRF check.
    // same-origin preserves form origins while withholding referrers from other sites.
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self'; img-src 'self' data: blob:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
    if (config.secure) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    try {
      prune();
      const url = new URL(req.url, config.origin);
      if (req.headers.host !== new URL(config.origin).host) return send(res, 400, page('Nieprawidłowy adres', '<p>Otwórz aplikację pod skonfigurowanym adresem.</p>'));
      if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return send(res, 405, 'METHOD_NOT_ALLOWED', 'text/plain'); }
      if (req.method === 'POST' && (req.headers.origin !== config.origin || req.headers['sec-fetch-site'] === 'cross-site')) {
        return send(res, 403, page('Brak dostępu', '<p>Otwórz ponownie formularz i spróbuj jeszcze raz.</p><a href="/login">Wróć do logowania</a>'));
      }
      if (url.pathname === '/auth-guard.js' && req.method === 'GET') {
        return send(res, 200, await readFile(new URL('./src/auth-guard.js', import.meta.url), 'utf8'), 'application/javascript; charset=utf-8');
      }
      if (url.pathname === '/logout') {
        if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, 'METHOD_NOT_ALLOWED', 'text/plain'); }
        const session = sessions.get(sessionId(req));
        forget(req, res);
        if (session) {
          try { await auth('logout?scope=local', { method: 'POST', token: session.accessToken }); } catch { /* Local session is always destroyed. */ }
        }
        return redirect(res, '/login');
      }
      if (url.pathname === '/login' && req.method === 'POST') {
        const ip = req.socket.remoteAddress;
        const entry = attempts.get(ip) || { count: 0, until: now() + 600000 };
        attempts.set(ip, entry);
        if (++entry.count > 10) { res.setHeader('Retry-After', String(Math.ceil((entry.until - now()) / 1000))); return send(res, 429, loginPage('', 'Zbyt wiele prób. Spróbuj ponownie za kilka minut.')); }
        const form = await formBody(req);
        const email = (form.get('email') || '').trim();
        const password = form.get('password') || '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !password || password.length > 1024) {
          return send(res, 400, loginPage(email, 'Sprawdź dane logowania i spróbuj ponownie.'));
        }
        let tokens, access;
        try {
          tokens = await auth('token?grant_type=password', { method: 'POST', body: { email, password } });
          access = accessFor(await auth('user', { token: tokens.access_token }));
        } catch (error) {
          if ([400, 401, 403, 422].includes(error.status)) return send(res, 401, loginPage(email, 'Nie udało się zalogować. Sprawdź dane lub skontaktuj się z właścicielem.'));
          if (error.status === 429) return send(res, 429, loginPage(email, 'Zbyt wiele prób. Spróbuj ponownie za kilka minut.'));
          return send(res, 503, loginPage(email, 'Logowanie jest chwilowo niedostępne. Spróbuj ponownie.'));
        }
        if (!access) {
          try { await auth('logout?scope=local', { method: 'POST', token: tokens.access_token }); } catch { /* No GroupDesk session was created. */ }
          return send(res, 403, loginPage(email, 'Nie udało się zalogować. Sprawdź dane lub skontaktuj się z właścicielem.'));
        }
        if (sessions.size >= MAX_SESSIONS) return send(res, 503, loginPage(email, 'Logowanie jest chwilowo niedostępne. Spróbuj ponownie.'));
        const session = { userId: access.userId, expires: now() + SESSION_TTL, lastSeen: now() };
        assignTokens(session, tokens);
        sessions.delete(sessionId(req));
        const id = randomBytes(32).toString('hex');
        sessions.set(id, session);
        res.setHeader('Set-Cookie', cookie(id, SESSION_TTL / 1000));
        return redirect(res, home(access));
      }
      if (req.method !== 'GET') return send(res, 404, 'NOT_FOUND', 'text/plain');
      // Explicit routes only: no static server can expose index.html, .env, or source files.
      if (!['/', '/login', '/app', '/reception', '/api/session'].includes(url.pathname)) return send(res, 404, page('Nie znaleziono strony', '<p><a href="/">Wróć do aplikacji</a></p>'));
      const access = await identify(req, res);
      if (url.pathname === '/login') return access ? redirect(res, home(access)) : send(res, 200, loginPage('', url.searchParams.get('reason') === 'session' ? 'Sesja zakończona. Zaloguj się ponownie.' : ''));
      if (!access) return url.pathname === '/api/session' ? send(res, 401, '{"error":"UNAUTHENTICATED"}', 'application/json') : redirect(res, '/login');
      if (url.pathname === '/') return redirect(res, home(access));
      if (url.pathname === '/api/session') return send(res, 200, JSON.stringify({ userId: access.userId, role: access.role, hotelId: access.hotelId }), 'application/json');
      if (url.pathname === '/app') {
        if (access.role !== 'sales') return send(res, 403, page('Brak dostępu', '<p>Ta strona jest dostępna dla sprzedaży.</p><a href="/">Wróć do swojej strony</a>'));
        return send(res, 200, salesPage(await readFile(indexPath, 'utf8'), access));
      }
      if (access.role !== 'reception') return send(res, 403, page('Brak dostępu', '<p>Ta strona jest dostępna dla recepcji.</p><a href="/">Wróć do swojej strony</a>'));
      return send(res, 200, receptionPage(access));
    } catch (error) {
      const status = [413, 415].includes(error.status) ? error.status : 503;
      if (req.url?.startsWith('/api/')) return send(res, status, '{"error":"SERVICE_UNAVAILABLE"}', 'application/json');
      return send(res, status, page('Usługa chwilowo niedostępna', '<p>Spróbuj ponownie. Jeżeli problem się powtarza, przekaż właścicielowi kod AUTH-01.</p><a href="/login">Wróć do logowania</a>'));
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const config = configuration();
    const port = Number(process.env.PORT || new URL(config.origin).port || 3000);
    const host = process.env.BIND_HOST || '127.0.0.1';
    if (!Number.isInteger(port) || port < 1 || port > 65535 ||
        (host !== '127.0.0.1' && (host !== '0.0.0.0' || !config.secure))) throw new Error('CONFIG');
    const server = createApp({ config });
    server.on('error', () => { console.error('Nie można uruchomić aplikacji. Kod START-02.'); process.exitCode = 1; });
    server.listen(port, host, () => console.log(`GroupDesk: ${config.origin}`));
  } catch { console.error('Sprawdź konfigurację środowiska. Kod START-01.'); process.exitCode = 1; }
}
