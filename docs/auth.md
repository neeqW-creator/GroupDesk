# Supabase Auth · konfiguracja i odbiór

## Co jest podłączone

Projekt testowy `groupdesk` wskazany przez właściciela, 19.11.2026. Adres i klucz publishable są lokalnie w ignorowanym pliku `.env.local`. Klucz publishable jest publicznym identyfikatorem aplikacji, nie nadaje praw administratora. Aplikacja nie potrzebuje klucza secret/service_role. `.env.example` zawiera wyłącznie nazwy konfiguracji.

Korzystamy z aktualnego [API REST Supabase Auth](https://github.com/supabase/auth/blob/master/openapi.yaml): grant hasła, grant odświeżenia, odczyt aktualnego konta i wylogowanie bieżącej sesji. Źródłem autoryzacji jest konto pobrane z Auth, nie samodzielnie odczytany JWT czy edytowalne `user_metadata`. [Dokumentacja getUser](https://supabase.com/docs/reference/javascript/auth-getuser) i [sesji](https://supabase.com/docs/guides/auth/sessions).

## Konta testowe · wykonuje właściciel

Nie utworzono ani nie zmieniono kont z poziomu agenta: w sesji nie ma narzędzi administracyjnych Supabase. Właściciel zachowuje hasła poza repozytorium i dostępem agenta. Nie wysyłaj nam haseł ani kluczy uprzywilejowanych.

1. Otwórz projekt testowy w Supabase → **Authentication → Users → Add user → Create new user**. Utwórz jedno fikcyjne konto sprzedaży i dwa fikcyjne konta recepcji. Użyj funkcji tworzenia potwierdzonego konta testowego bez zaproszenia mailowego. Nie korzystaj z prawdziwych adresów osób ani wysyłki email.
2. Właściciel nadaje każdemu kontu administracyjne `app_metadata.groupdesk`. Dozwolone wartości:

```json
{"groupdesk":{"active":true,"role":"sales"}}
```

```json
{"groupdesk":{"active":true,"role":"reception","hotel_id":"hotel-a"}}
```

```json
{"groupdesk":{"active":true,"role":"reception","hotel_id":"hotel-b"}}
```

`hotel_id` to stały identyfikator obiektu, nie nazwa wybrana przez użytkownika. Nie należy wpisywać tych uprawnień do `user_metadata`. Domyślnie każde konto bez takiego przydziału ma odmowę dostępu, także jeśli zarejestruje się przez publiczne API Supabase.

Jeśli panel nie pozwala edytować App Metadata, właściciel może w **SQL Editor projektu testowego** wykonać poniższy przydział, podstawiając UUID istniejącego konta i właściwą rolę. To zmiana danych konta, nie migracja schematu. Zwrócony pojedynczy wiersz stanowi potwierdzenie przydziału. Błędny/brakujący UUID nie może zostać zaakceptowany jako sukces.

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"groupdesk":{"active":true,"role":"sales"}}'::jsonb
where id = 'UZUPELNIJ_UUID_KONTA'::uuid
returning id, raw_app_meta_data -> 'groupdesk' as groupdesk;
```

Dla konta recepcji zastąp JSON przydziałem dla `hotel-a` albo `hotel-b` z przykładów powyżej. Pozostałe klucze metadanych konta zostają zachowane.

Wyłączenie konta w GroupDesk: zmień `groupdesk.active` na `false` administracyjnie. Istniejąca sesja traci dostęp przy następnym żądaniu serwera; otwarta strona zostanie zamknięta podczas kontroli sesji (co 20 sekund lub przy powrocie do karty). Nie polegaj na zmianie samych `user_metadata`.

Właściciel może także wyłączyć publiczną rejestrację w konfiguracji Auth projektu, jeżeli konta mają być wyłącznie tworzone administracyjnie. Nie zmieniono tego ustawienia automatycznie.

## Trasy

| Trasa | Dostęp |
|---|---|
| `/login` GET | Publiczny formularz; zalogowane konto jest kierowane do swojej strony |
| `/login` POST | Email i hasło, kontrola pochodzenia, limit prób; bez opcji rejestracji |
| `/` | Aktywna sesja; przekierowanie według roli |
| `/app` | Wyłącznie aktywna sprzedaż; dotychczasowy CRM demonstracyjny |
| `/reception` | Wyłącznie aktywna recepcja ze stałym identyfikatorem obiektu; bez lokalnych danych sprzedaży |
| `/api/session` | Wyłącznie aktywna sesja; neutralny identyfikator konta, rola i obiekt; nigdy tokeny |
| `/logout` POST | Kończy lokalną sesję i próbuje zakończyć bieżącą sesję Auth; chronione przed CSRF |
| `/auth-guard.js` | Publiczny skrypt kontroli sesji bez danych użytkownika |
| Pozostałe ścieżki | 404; brak publicznego serwera plików |

## Kontrola lokalna i ręczna

`node --test tests/auth.test.mjs` — testy HTTP i kontrola zachowania skryptu sesji na atrapach Auth. Sprawdzają logowanie, wylogowanie, odmowę odczytu źródeł, role A/B, forgery metadanych/parametrów, dezaktywację, zmianę roli, wygaśnięcie, awarie, równoległe odświeżenie tokenu, CSRF, limit prób, bezpieczne cookie, neutralne błędy i poprawność JS wygenerowanej strony. Testy nie łączą się z projektem i nie wysyłają emaili.

`node --use-system-ca --env-file=.env.local scripts/check-auth.mjs` — tylko odczyt rzeczywistej usługi: ustawienia Auth, logowanie email oraz odmowa odczytu konta bez sesji. Nie testuje hasła ani przydziału ról.

Ręczny odbiór po przygotowaniu kont:

1. Bez sesji otwórz `/app` i `/reception`: formularz logowania. Spróbuj `/index.html` i `/.env.local`: 404.
2. Zaloguj sprzedaż: lista grup i przycisk wylogowania. Otwórz `/reception`: 403.
3. Wyloguj się, następnie użyj Wstecz: powrót do logowania. Bez starej sesji `/api/session` zwraca 401.
4. Zaloguj recepcję A: osobna strona `hotel-a`. `/app` zwraca 403. Dopisanie `?hotel_id=hotel-b&role=sales` nie zmienia roli ani obiektu. Powtórz symetrycznie dla B.
5. Wyłącz `active` zalogowanego konta w panelu administratora: kolejny odczyt strony jest odrzucony, a otwarta karta wraca do logowania po sprawdzeniu sesji.
6. Podaj błędne hasło: email pozostaje w formularzu, hasło zostaje wyczyszczone, brak sesji. Sprawdź niedostępność Auth w oddzielnej konfiguracji testowej: brak chronionych danych w odpowiedzi.

Ręczne logowanie rzeczywistymi kontami, testy operacji bazy i niezależna Faza C nie zostały jeszcze wykonane. Nie deklarujemy zakończenia F01 ani bezpieczeństwa lokalnych danych prototypu dla produkcji.
