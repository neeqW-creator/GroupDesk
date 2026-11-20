# Plan prac · Auth i chronione trasy

19.11.2026. Zakres tej sesji wynika z bezpośredniej prośby właściciela: podłączyć Supabase Auth i chronić trasy istniejącego GroupDesk. Właściciel potwierdził, że `groupdesk` jest projektem testowym. To plan tej warstwy, nie zakończona Faza A całego MVP.

## Plan i wykonanie

1. Sprawdzić prototyp, F01 i macierz dostępu — wykonano. Prototyp to pojedynczy HTML bez backendu i bez testów. Stan początkowy Git: czysty, `main` o jeden commit przed `origin/main`.
2. Dodać serwer, logowanie i wylogowanie — wykonano. Node 24, bez zależności zewnętrznych, oficjalne REST API Supabase Auth.
3. Egzekwować role i obiekt po stronie serwera — wykonano dla stron. Sprzedaż `/app`, recepcja `/reception`. Dane autoryzacji wyłącznie z bieżącego `GET /auth/v1/user`, z administracyjnego `app_metadata.groupdesk`. Brak przypisania oznacza odmowę.
4. Sprawdzić granice dostępu, udokumentować konfigurację i ograniczenia — 18 testów lokalnych PASS. Działanie trzech rzeczywistych kont testowych i końcowy odbiór F01 oczekują.

## Architektura i decyzje

- Serwer nie serwuje katalogu repozytorium. Wyłącznie jawnie wskazane trasy; `/index.html`, `.env`, pliki źródłowe i niezaimplementowane API są niedostępne. Nie dodano publicznej rejestracji ani odzyskiwania hasła.
- Hasło trafia bezpośrednio z formularza do lokalnego serwera, dalej przez HTTPS do Auth; nie jest zapisywane ani logowane. Tokeny dostępowe i odświeżające pozostają w pamięci serwera. Przeglądarka otrzymuje losowy identyfikator sesji w ciasteczku HttpOnly / SameSite=Lax / Secure przy HTTPS. Brak kluczy uprzywilejowanych.
- Sesja trwa maksymalnie 8 godzin i wygasa po 30 minutach bez żądania do serwera. Kontrola otwartej strony co 20 sekund utrzymuje aktywną sesję. Odświeżenie tokenu jest serializowane między równoległymi żądaniami jednej sesji. Restart serwera kończy wszystkie sesje. Błąd usługi nie udostępnia chronionej strony.
- Serwer sprawdza aktualne konto przy każdym chronionym żądaniu. `active: false` lub usunięcie uprawnień odbiera dostęp przy następnym żądaniu. Metadane użytkownika, parametry URL i formularza nigdy nie nadają roli ani obiektu.
- Strona sprzedaży korzysta z istniejącego prototypu, z osobnym kluczem localStorage dla konta. Samodzielny plik demo pozostaje odrębny i nie zawiera Auth. Dane demonstracyjne nie są synchronizowane ani importowane automatycznie. To nie jest zabezpieczenie dostępu do lokalnych plików czy danych już odczytanych przez uprawnionego użytkownika.
- Recepcja dostaje osobny ekran bez danych i bez kodu sprzedaży. F05 i F06 podłączą przekazane karty. Żadne nowe tabele ani operacje bazy danych nie zostały dodane; nie deklarujemy gotowych reguł RLS ani ukończenia N1 na danych.
- Konta i uprawnienia nadaje właściciel poza aplikacją. Instrukcje w `docs/auth.md`. Publiczna rejestracja w Supabase nie daje dostępu do GroupDesk bez przydziału administratora.

## Status kart i niezmienników

| Zakres | Status |
|---|---|
| F00 | Nieukończone: brak wspólnej bazy, potwierdzenia regionu UE, danych startowych i pełnej Fazy A |
| F01-KA1 | Automatycznie sprawdzone przekierowania obu ról; ręczne logowanie kont projektu oczekuje |
| F01-KA2 | Sprawdzone na atrapach: wygaśnięcie, dezaktywacja, unieważnienie i błąd usługi |
| F01-KA3 / N1 | Sprawdzona izolacja tras i zakresu obiektu A/B; testy bezpośrednich operacji danych oczekują na bazę |
| F01-KA4 | Sprawdzone odrzucenie roli z user_metadata, parametrów klienta i brak samodzielnej zmiany zakresu |
| F01-KA5 | Sprawdzone błędy hasła/usługi, zachowanie emaila, czyszczenie hasła; ręczny test oczekuje |
| F02–F06 / N2–N4 | Poza tą zmianą; prototyp nie stanowi implementacji bezpiecznego pilotażu |

## Następny krok

### Wdrożenie testowe na Render, 20.11.2026

Gałąź `deploy/render` zawiera konfigurację usługi Node.js w regionie Frankfurt. Adres publiczny wybiera `APP_ORIGIN` albo adres przydzielony przez Render. Nasłuchiwanie na wszystkich interfejsach wymaga adresu aplikacji HTTPS. Po uruchomieniu usługi trzeba sprawdzić formularz, odmowę dostępu bez sesji i zalogowanie istniejącym kontem testowym.

### Poprawka formularza, 19.11.2026

Właściciel zgłosił „Brak dostępu” po utworzeniu konta. Nadano zatwierdzoną rolę sprzedaży wskazanemu kontu przez panel Supabase; osobny odczyt potwierdził aktywne uprawnienia. Pozostałą blokadę odtworzono w prawdziwej przeglądarce bez używania haseł: `Referrer-Policy: no-referrer` powodowała `Origin: null` w natywnym POST formularza. Zmieniono politykę na `same-origin`, która zachowuje prawidłowy Origin i nie wysyła Referer do obcych stron. Warunek ochrony CSRF pozostaje bez zmian, a stronę odmowy uzupełniono o bezpieczny link do nowego formularza. Dodano test regresji polityki nagłówków i odrzucania `Origin: null`. Pierwotne testy HTTP z ręcznie ustawionym Origin nie wykryły tego zachowania przeglądarki.

Właściciel tworzy trzy fikcyjne konta w testowym projekcie i nadaje ich `app_metadata.groupdesk`; następnie wykonujemy scenariusz rzeczywistego logowania z `docs/auth.md`. Kolejna faza obejmuje pełny plan F00, potwierdzenie regionu UE, wspólną bazę i RLS z testami bezpośrednich operacji. Dopiero potem można zamknąć F01 i dołączać przekazywanie kart. Do czasu odbioru korzystamy wyłącznie z fikcyjnych danych i kont.
