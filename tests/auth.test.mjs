import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createApp, configuration } from '../server.mjs';

const email = 'sales@example.invalid';
const password = 'fictional-test-password';
const sales = () => ({ id: '10000000-0000-4000-8000-000000000001', app_metadata: { groupdesk: { active: true, role: 'sales' } } });
const reception = hotel => ({ id: `20000000-0000-4000-8000-00000000000${hotel === 'hotel-a' ? 1 : 2}`, app_metadata: { groupdesk: { active: true, role: 'reception', hotel_id: hotel } } });

async function fixture(t, user = sales(), secure = false) {
  const state = { user, calls: [], refreshCount: 0, time: Date.now(), failUser: 0, failLogin: 0, failRefresh: 0, failLogout: false };
  const config = { origin: 'http://127.0.0.1:1', supabaseUrl: 'https://test.supabase.co', key: 'sb_publishable_test', secure };
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
  const tokens = () => ({ access_token: `private-access-${state.refreshCount}`, refresh_token: `private-refresh-${state.refreshCount}`, expires_in: 120 });
  const fetchImpl = async (url, options) => {
    state.calls.push({ url, options });
    assert.equal(options.headers.apikey, config.key);
    assert.notEqual(options.headers.Authorization, `Bearer ${config.key}`);
    assert.equal(options.redirect, 'error');
    if (url.endsWith('token?grant_type=password')) {
      if (state.failLogin) return json({ error: 'sensitive-provider-error' }, state.failLogin);
      assert.deepEqual(JSON.parse(options.body), { email, password });
      return json(tokens());
    }
    if (url.endsWith('token?grant_type=refresh_token')) {
      state.refreshCount++;
      await new Promise(resolve => setTimeout(resolve, 10));
      if (state.failRefresh) return json({ error: 'invalid-refresh' }, state.failRefresh);
      return json(tokens());
    }
    if (url.endsWith('/user')) return state.failUser ? json({ error: 'private-error' }, state.failUser) : json(state.user);
    if (url.endsWith('logout?scope=local')) {
      if (state.failLogout) throw new Error('private-provider-error');
      return new Response(null, { status: 204 });
    }
    throw new Error('Unexpected external request');
  };
  const server = createApp({ config, fetchImpl, now: () => state.time });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  config.origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
  const request = (path, { cookie, body, method = body ? 'POST' : 'GET', origin = config.origin, ...options } = {}) => fetch(config.origin + path, {
    method, redirect: 'manual', headers: { ...(cookie ? { Cookie: cookie } : {}),
      ...(method === 'POST' ? { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' } : {}), ...(options.headers || {}) },
    ...(body ? { body: new URLSearchParams(body) } : {}),
  });
  const login = async (extra = {}) => {
    const response = await request('/login', { body: { email, password, ...extra } });
    return { response, cookie: response.headers.get('set-cookie')?.split(';')[0] };
  };
  return { state, config, request, login };
}

test('anonymous visitors cannot fetch protected pages, source, configuration, or session data', async t => {
  const { request, state } = await fixture(t);
  for (const path of ['/', '/app', '/reception']) {
    const response = await request(path);
    assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/login');
    assert.doesNotMatch(await response.text(), /Wycieczka szkolna|groupdesk-local/);
  }
  assert.equal((await request('/api/session')).status, 401);
  for (const path of ['/index.html', '/.env.local', '/server.mjs', '/src/pages.mjs', '/docs/specyfikacja.md', '/%2e%2e/index.html', '/app/index.html']) {
    assert.equal((await request(path)).status, 404, path);
  }
  assert.equal(state.calls.length, 0);
});

test('sales sign in, receive an opaque HttpOnly cookie, and open their CRM', async t => {
  const { login, request } = await fixture(t);
  const { response, cookie } = await login({ role: 'reception', next: 'https://attacker.invalid' });
  assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/app');
  assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Lax/);
  assert.doesNotMatch(cookie, /private-access|private-refresh/);
  const app = await request('/app', { cookie });
  assert.equal(app.status, 200);
  assert.match(app.headers.get('cache-control'), /no-store/);
  assert.equal(app.headers.get('x-frame-options'), 'DENY');
  const html = await app.text();
  assert.match(html, /Wyloguj się/); assert.match(html, /auth-guard.js/);
  assert.match(html, /groupdesk-auth-v1-10000000/); assert.match(html, /page='groups'/);
  assert.doesNotMatch(html, /private-access|private-refresh|sb_publishable|Brak logowania/);
  const session = await request('/api/session', { cookie });
  assert.deepEqual(await session.json(), { userId: sales().id, role: 'sales', hotelId: null });
  assert.equal((await request('/reception', { cookie })).status, 403);
});

test('reception A and B are isolated from sales and cannot choose another hotel or role', async t => {
  for (const hotel of ['hotel-a', 'hotel-b']) {
    const { login, request } = await fixture(t, reception(hotel));
    const { response, cookie } = await login({ role: 'sales', hotel_id: 'hotel-other' });
    assert.equal(response.headers.get('location'), '/reception');
    assert.equal((await request('/app?role=sales', { cookie })).status, 403);
    const receptionResponse = await request('/reception?hotel_id=hotel-other', { cookie });
    assert.equal(receptionResponse.status, 200);
    const html = await receptionResponse.text();
    assert.match(html, new RegExp(hotel));
    assert.doesNotMatch(html, /hotel-other|Wycieczka szkolna|Organizator|localStorage/);
    const session = await request('/api/session?hotel_id=hotel-other', { cookie });
    assert.equal((await session.json()).hotelId, hotel);
    assert.equal((await request('/api/cards?hotel_id=hotel-other', { cookie })).status, 404);
  }
});

test('deny unassigned, disabled, anonymous, invalid-role, and user_metadata-forged accounts', async t => {
  const users = [
    { id: 'unassigned', app_metadata: {}, user_metadata: { groupdesk: { active: true, role: 'sales' } } },
    { ...sales(), app_metadata: { groupdesk: { active: false, role: 'sales' } } },
    { ...sales(), is_anonymous: true },
    { ...sales(), app_metadata: { groupdesk: { active: true, role: 'owner' } } },
    { ...reception('hotel-a'), app_metadata: { groupdesk: { active: true, role: 'reception' } } },
    { ...reception('hotel-a'), app_metadata: { groupdesk: { active: true, role: 'reception', hotel_id: '<script>' } } },
  ];
  for (const user of users) {
    const { login } = await fixture(t, user);
    const { response } = await login();
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('set-cookie'), null);
    assert.doesNotMatch(await response.text(), /fictional-test-password|private-access/);
  }
});

test('disabling an account removes its existing access on the next request', async t => {
  const { login, request, state } = await fixture(t);
  const { cookie } = await login();
  state.user.app_metadata.groupdesk.active = false;
  const response = await request('/app', { cookie });
  assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/login');
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  state.user.app_metadata.groupdesk.active = true;
  assert.equal((await request('/api/session', { cookie })).status, 401);
});

test('role and hotel changes use fresh server account data instead of cached JWT claims', async t => {
  const { login, request, state } = await fixture(t);
  const { cookie } = await login();
  state.user = { ...reception('hotel-a'), id: sales().id };
  assert.equal((await request('/app', { cookie })).status, 403);
  let response = await request('/api/session', { cookie });
  assert.equal((await response.json()).hotelId, 'hotel-a');
  state.user.app_metadata.groupdesk.hotel_id = 'hotel-b';
  response = await request('/api/session', { cookie });
  assert.equal((await response.json()).hotelId, 'hotel-b');
});

test('concurrent protected requests share one refresh token rotation', async t => {
  const { login, request, state } = await fixture(t);
  const { cookie } = await login();
  state.time += 100000;
  const responses = await Promise.all(Array.from({ length: 5 }, () => request('/api/session', { cookie })));
  assert.ok(responses.every(response => response.status === 200));
  assert.equal(state.refreshCount, 1);
});

test('expired or revoked sessions fail closed', async t => {
  for (const kind of ['idle', 'absolute', 'revoked', 'refresh']) {
    const { login, request, state } = await fixture(t);
    const { cookie } = await login();
    if (kind === 'idle') state.time += 31 * 60000;
    if (kind === 'absolute') state.time += 9 * 60 * 60000;
    if (kind === 'revoked') state.failUser = 401;
    if (kind === 'refresh') { state.time += 100000; state.failRefresh = 400; }
    assert.equal((await request('/api/session', { cookie })).status, 401, kind);
    assert.equal((await request('/app', { cookie })).status, 303, kind);
  }
});

test('logout destroys the local session even when Supabase cannot be reached', async t => {
  const { login, request, state } = await fixture(t);
  const { cookie } = await login();
  assert.equal((await request('/logout', { cookie })).status, 405);
  state.failLogout = true;
  const response = await request('/logout', { cookie, method: 'POST' });
  assert.equal(response.status, 303);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await request('/api/session', { cookie })).status, 401);
});

test('same-origin checks protect login and logout from CSRF', async t => {
  const { request, login, state } = await fixture(t);
  assert.equal((await request('/login', { body: { email, password }, origin: 'https://attacker.invalid' })).status, 403);
  assert.equal(state.calls.length, 0);
  const { cookie } = await login();
  assert.equal((await request('/logout', { cookie, method: 'POST', origin: 'https://attacker.invalid' })).status, 403);
  assert.equal((await request('/api/session', { cookie })).status, 200);
});

test('authentication failures preserve the identifier, clear the password, and never reflect provider errors', async t => {
  for (const failure of [400, 429, 500]) {
    const { request, state } = await fixture(t);
    state.failLogin = failure;
    const response = await request('/login', { body: { email, password } });
    assert.equal(response.status, failure === 400 ? 401 : failure === 500 ? 503 : 429);
    const html = await response.text();
    assert.match(html, /sales@example.invalid/);
    assert.doesNotMatch(html, /fictional-test-password|sensitive-provider-error/);
  }
});

test('Supabase outages do not serve cached protected content', async t => {
  const { login, request, state } = await fixture(t);
  const { cookie } = await login();
  state.failUser = 503;
  const response = await request('/app', { cookie });
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /Wycieczka szkolna|private-error/);
  assert.equal((await request('/api/session', { cookie })).status, 503);
});

test('login throttles repeated attempts and invalidates the previous session on a new login', async t => {
  const { login, request, state } = await fixture(t);
  const first = await login();
  const second = await request('/login', { cookie: first.cookie, body: { email, password } });
  assert.equal(second.status, 303);
  assert.notEqual(second.headers.get('set-cookie')?.split(';')[0], first.cookie);
  assert.equal((await request('/api/session', { cookie: first.cookie })).status, 401);
  state.failLogin = 400;
  for (let i = 0; i < 8; i++) await login();
  const blocked = await login();
  assert.equal(blocked.response.status, 429);
  assert.ok(Number(blocked.response.headers.get('retry-after')) > 0);
});

test('secure deployment uses a Secure, host-only session cookie', async t => {
  const { login } = await fixture(t, sales(), true);
  const { response } = await login();
  assert.match(response.headers.get('set-cookie'), /^__Host-groupdesk_session=/);
  assert.match(response.headers.get('set-cookie'), /; Secure$/);
  assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000');
});

test('invalid configuration fails before the server starts', () => {
  const valid = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example' };
  assert.equal(configuration(valid).origin, 'http://localhost:3000');
  for (const overrides of [
    { SUPABASE_PUBLISHABLE_KEY: 'sb_secret_never' }, { SUPABASE_URL: 'http://example.supabase.co' },
    { APP_ORIGIN: 'http://public.example' }, { APP_ORIGIN: 'https://example.invalid/path' },
    { APP_ORIGIN: 'https://user:password@example.invalid' },
  ]) assert.throws(() => configuration({ ...valid, ...overrides }));
});

test('generated sales HTML retains valid JavaScript and only one logout form', async t => {
  const { login, request } = await fixture(t);
  const { cookie } = await login();
  const html = await (await request('/app', { cookie })).text();
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) assert.doesNotThrow(() => new vm.Script(match[1]));
  assert.equal((html.match(/action="\/logout"/g) || []).length, 1);
  assert.match(html, /maxlength="80" readonly/);
});

test('browser session guard removes stale content when authentication is lost', async () => {
  const source = await readFile(new URL('../src/auth-guard.js', import.meta.url), 'utf8');
  let removed = false, redirected = '', timer;
  const sandbox = {
    window: { groupdeskAccess: { userId: 'one', role: 'sales', hotelId: null }, addEventListener() {}, location: { replace(value) { redirected = value; } } },
    document: { body: { replaceChildren() { removed = true; } }, addEventListener() {} },
    fetch: async () => ({ ok: false }), setInterval(fn) { timer = fn; },
  };
  vm.runInNewContext(source, sandbox);
  await new Promise(resolve => setImmediate(resolve));
  assert.ok(removed); assert.equal(redirected, '/login?reason=session'); assert.equal(typeof timer, 'function');
});
