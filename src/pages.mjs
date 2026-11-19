const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const scriptJSON = value => JSON.stringify(value).replace(/</g, '\\u003c');
const style = `:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f6f7f2;color:#203c36;font:15px/1.6 system-ui,sans-serif}main{max-width:480px;margin:8vh auto;padding:32px;background:#fff;border:1px solid #e2e8e2;border-radius:13px}.logo{font-weight:750;font-size:28px;margin-bottom:24px}.logo span{color:#a06d36}h1{font-size:26px;line-height:1.3;margin:0 0 12px}p{color:#5b6c63}label{display:block;font-size:13px;margin:18px 0 5px}input{width:100%;padding:12px;border:1px solid #ced8d0;border-radius:7px;font:inherit;color:inherit}button{margin-top:22px;padding:11px 18px;border:1px solid #285c4d;border-radius:8px;background:#285c4d;color:white;font:inherit;cursor:pointer}button:hover{background:#194638}a{color:#285c4d}:focus-visible{outline:3px solid #d59a47;outline-offset:3px}.notice{background:#fcf0d8;color:#80551b;border-radius:8px;padding:12px}.muted{font-size:13px;color:#5b6c63}@media(max-width:540px){main{margin:24px 12px;padding:24px}}`;
export const logout = '<form method="post" action="/logout"><button class="btn small" type="submit">Wyloguj się</button></form>';
export function page(title, content, tail = '') {
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} · GroupDesk</title><style>${style}</style></head><body><main><div class="logo">GroupDesk<span>.</span></div><h1>${escape(title)}</h1>${content}</main>${tail}</body></html>`;
}
export function loginPage(email = '', error = '') {
  return page('Zaloguj się', `<p>Dostęp dla zespołu sprzedaży i recepcji.</p>${error ? `<p class="notice" role="alert">${escape(error)}</p>` : ''}<form method="post" action="/login"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" maxlength="254" value="${escape(email)}" required autofocus><label for="password">Hasło</label><input id="password" name="password" type="password" autocomplete="current-password" maxlength="1024" required><button type="submit">Zaloguj się</button></form><p class="muted">Konto i zakres dostępu nadaje właściciel aplikacji.</p>`);
}
function guard(access) {
  return `<script>window.groupdeskAccess=${scriptJSON({ userId: access.userId, role: access.role, hotelId: access.hotelId })};</script><script src="/auth-guard.js" defer></script>`;
}
export function receptionPage(access) {
  return page('Recepcja', `<p>Obiekt: <strong>${escape(access.hotelId)}</strong></p><p>Brak udostępnionych kart. Przekazywanie kart do wspólnej bazy nie jest jeszcze podłączone.</p>${logout}`, guard(access));
}
export function salesPage(source, access) {
  const key = `groupdesk-auth-v1-${access.userId}`;
  // Keep the standalone, public demo distinct from the authenticated server route.
  return source
    .replace("const KEY='groupdesk-local-v1'", `const KEY=${scriptJSON(key)}`)
    .replace("page='home'", "page='groups'")
    .replace('maxlength="80"><button class="btn small" data-action="export">', `maxlength="80" readonly>${logout}<button class="btn small" data-action="export">`)
    .replace("render();if(bootWarning)", "db.actor='Sprzedaż';render();if(bootWarning)")
    .replace('Brak logowania, synchronizacji, integracji i wysyłki powiadomień.', 'Logowanie Supabase. Dane demonstracyjne pozostają lokalne; brak synchronizacji i integracji.')
    .replace('wielu użytkowników i ochrony dostępu.', 'wspólnej bazy danych. Ochrona strony działa na serwerze; lokalne dane są demonstracyjne.')
    .replace('Do współdzielonej pracy produkcyjnej potrzebny będzie backend i logowanie.', 'Do pracy na prawdziwych danych potrzebna jest wspólna baza z regułami dostępu i odbiór pilotażu.')
    .replace('</body>', `${guard(access)}</body>`);
}
