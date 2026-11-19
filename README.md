# GroupDesk CRM

GroupDesk pomaga sprzedaży hotelowej przygotować ofertę dla grupy i przekazać recepcji wersjonowaną kartę z ustaleniami pobytu.

## Wypróbuj

Uruchom serwer według instrukcji poniżej i otwórz [logowanie](http://localhost:3000/login). Supabase obsługuje hasła i tożsamość, a serwer chroni strony według uprawnień nadanych przez właściciela. Konto sprzedaży przechodzi do listy grup, konto recepcji do osobnej strony własnego obiektu.

Plik `index.html` pozostaje samodzielnym, publicznym demo z fikcyjnymi danymi. Jego otwarcie z dysku nie uruchamia ochrony dostępu. Serwer nie udostępnia tego pliku bezpośrednio.

## Główna ścieżka pilotażu

Sprzedaż zapisuje zapytanie i ofertę, odnotowuje blokadę z Mews i przekazuje kartę grupy. Recepcja właściwego obiektu potwierdza jej przeczytanie. Gdy zmienią się ustalenia, obie role widzą, która wersja została przekazana i potwierdzona.

## Stan funkcji

| ID | Funkcja | Priorytet | Status | Weryfikacja |
|---|---|---|---|---|
| [F00](docs/funkcje/F00-fundament.md) | Fundament pilotażu i dane testowe | MVP-1 | Do zrobienia | Oczekuje |
| [F01](docs/funkcje/F01-logowanie-i-dostep.md) | Logowanie i dostęp według roli oraz obiektu | MVP-1 | Częściowo: Auth i ochrona tras | 18 testów lokalnych; odbiór kont i danych oczekuje |
| [F02](docs/funkcje/F02-rejestracja-sprawy.md) | Ręczna rejestracja i edycja sprawy | MVP-1 | Do zrobienia | Oczekuje |
| [F03](docs/funkcje/F03-oferty.md) | Warianty, wersje, wybór oferty i PDF | MVP-1 | Do zrobienia | Oczekuje |
| [F04](docs/funkcje/F04-blokada-mews.md) | Odnotowanie ręcznej blokady Mews | MVP-1 | Do zrobienia | Oczekuje |
| [F05](docs/funkcje/F05-przekazanie-karty.md) | Przekazanie karty i publikacja kolejnej wersji | MVP-1 | Do zrobienia | Oczekuje |
| [F06](docs/funkcje/F06-potwierdzenie-recepcji.md) | Odczyt i potwierdzenie wersji przez recepcję | MVP-1 | Do zrobienia | Oczekuje |

## Zmiany względem specyfikacji

Na prośbę właściciela dodano warstwę Auth i ochronę tras do istniejącego prototypu przed ukończeniem F00. Nie oznacza to ukończenia F01 ani odbioru pilotażu. Pełna wspólna baza, reguły RLS i przekazywanie kart pozostają do wykonania. Zakres i zależności opisuje [plan](docs/plan.md).

## Znane ograniczenia

Gmail i Mews są obsługiwane ręcznie. Rozliczenia przewidziano po pilotażu. Serwer egzekwuje dostęp do stron, lecz dane CRM sprzedaży nadal są lokalnymi danymi demonstracyjnymi w przeglądarce, osobno dla każdego konta. Recepcja nie otrzymuje kodu CRM sprzedaży ani jego danych. Jej strona jest przygotowana do podłączenia przekazanych kart w F05–F06. Nie ma jeszcze wspólnej bazy ani operacji na kartach, których izolację można potwierdzić testami N1. Wpisy prototypu nie stanowią audytowalnej historii kont.

Sesje są przechowywane w pamięci jednego procesu serwera. Restart wylogowuje użytkowników. Hosting wieloinstancyjny wymaga wspólnego magazynu sesji. Odczytane wcześniej lub wyeksportowane lokalne dane nie mogą zostać odebrane przez wylogowanie; używaj wyłącznie fikcyjnych danych. Kontrola strony w przeglądarce następuje także co 20 sekund i przy powrocie do karty.

## Bezpieczeństwo i dane

- Poziom P0 przy fikcyjnych danych i identyfikatorach kont.
- Weryfikacja całego MVP i bramka prawdziwych danych oczekują na Fazę C oraz decyzję właściciela zgodnie z §7.

## Jak uruchomić lokalnie

Wymagany Node.js 24 LTS. Nie trzeba instalować pakietów: serwer korzysta z modułów Node i oficjalnego API REST Supabase Auth.

1. Skopiuj `.env.example` do `.env.local`. Uzupełnij `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `APP_ORIGIN` (lokalnie `http://localhost:3000`) i `PORT` (`3000`). Używaj wyłącznie projektu testowego. Pliki `.env` są ignorowane w Git. W tej instalacji konfigurację publiczną projektu testowego przygotowano lokalnie.
2. Właściciel tworzy fikcyjne konta testowe i nadaje im dostęp według [instrukcji Auth](docs/auth.md). Bez uprawnień konto nie uzyska dostępu, nawet po poprawnym zalogowaniu do Supabase.
3. Uruchom z katalogu projektu:

```powershell
node --use-system-ca --env-file=.env.local server.mjs
```

Otwórz `http://localhost:3000`. Używaj tego adresu dokładnie; alternatywny host jest odrzucany. Serwer nasłuchuje wyłącznie na `127.0.0.1`. Zewnętrzny hosting wymaga HTTPS, poprawnego `APP_ORIGIN`, pośrednika przekazującego oryginalny nagłówek `Host` i ukończenia odbioru pilotażu.

Testy bez sieci, kont, wysyłania maili i zmian w Supabase:

```powershell
node --test tests/auth.test.mjs
```

Kontrola publicznych ustawień i odmowy odczytu konta bez sesji (tylko odczyt):

```powershell
node --use-system-ca --env-file=.env.local scripts/check-auth.mjs
```

Przejście testów z atrapą nie potwierdza działania kont w prawdziwym projekcie. Przed odbiorem wykonaj ręczny scenariusz z `docs/auth.md`.

## Dokumentacja

- [Specyfikacja pilotażu](docs/specyfikacja.md) i [karty funkcji](docs/funkcje/).
- [Wytyczne wyglądu](design.md), [zasady dla agentów](AGENTS.md) i [wcześniejsza specyfikacja funkcjonalna w PDF](docs/specyfikacja.pdf).
- [Plan prac i status Auth](docs/plan.md), [konfiguracja kont i odbiór Auth](docs/auth.md). Raporty `docs/weryfikacja/` powstają w osobnej Fazie C.
