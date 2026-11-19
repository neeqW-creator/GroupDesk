import { configuration } from '../server.mjs';

try {
  const config = configuration();
  const options = { headers: { apikey: config.key }, redirect: 'error', signal: AbortSignal.timeout(10000) };
  const response = await fetch(`${config.supabaseUrl}/auth/v1/settings`, options);
  if (!response.ok) throw new Error('SETTINGS');
  const settings = await response.json();
  const anonymous = await fetch(`${config.supabaseUrl}/auth/v1/user`, { ...options, signal: AbortSignal.timeout(10000) });
  if (settings.external?.email !== true || anonymous.status !== 401) throw new Error('AUTH');
  console.log('PASS: usługa Auth odpowiada, logowanie email jest dostępne, odczyt konta bez sesji odrzucony.');
  console.log(`Rejestracja publiczna: ${settings.disable_signup ? 'wyłączona' : 'włączona (GroupDesk wymaga osobnego nadania dostępu)'}.`);
} catch {
  console.error('FAIL: sprawdź konfigurację i dostęp do usługi Auth. Kod CHECK-01.');
  process.exitCode = 1;
}
