(() => {
  'use strict';
  let checking = false;
  let blocked = false;
  const expected = window.groupdeskAccess;
  function leave() {
    blocked = true;
    document.body.replaceChildren();
    window.location.replace('/login?reason=session');
  }
  async function check() {
    if (checking || blocked) return;
    checking = true;
    try {
      const response = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store', redirect: 'error' });
      if (!response.ok) { leave(); return; }
      const actual = await response.json();
      if (actual.userId !== expected.userId || actual.role !== expected.role || actual.hotelId !== expected.hotelId) leave();
    } catch { leave(); }
    finally { checking = false; }
  }
  // Hide stale pages restored from the browser's back/forward cache until checked.
  window.addEventListener('pageshow', event => {
    if (event.persisted) { document.body.hidden = true; check().finally(() => { if (!blocked) document.body.hidden = false; }); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  document.addEventListener('submit', event => {
    if (event.target.action === `${location.origin}/logout`) {
      blocked = true;
      for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
    }
  }, true);
  setInterval(check, 20000);
  check();
})();
