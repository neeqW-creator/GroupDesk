# GroupDesk CRM

GroupDesk pomaga sprzedaży hotelowej przygotować ofertę dla grupy i przekazać recepcji wersjonowaną kartę z ustaleniami pobytu.

## Wypróbuj

Otwórz [index.html](index.html) w przeglądarce. Obecny prototyp działa lokalnie bez instalacji i przechowuje dane demonstracji w przeglądarce. Wersja pilotażowa będzie korzystać z osobnych, fikcyjnych kont sprzedaży i recepcji. Dostęp do pilotażu uzupełni właściciel po jego udostępnieniu.

## Główna ścieżka pilotażu

Sprzedaż zapisuje zapytanie i ofertę, odnotowuje blokadę z Mews i przekazuje kartę grupy. Recepcja właściwego obiektu potwierdza jej przeczytanie. Gdy zmienią się ustalenia, obie role widzą, która wersja została przekazana i potwierdzona.

## Stan funkcji

| ID | Funkcja | Priorytet | Status | Weryfikacja |
|---|---|---|---|---|
| [F00](docs/funkcje/F00-fundament.md) | Fundament pilotażu i dane testowe | MVP-1 | Do zrobienia | Oczekuje |
| [F01](docs/funkcje/F01-logowanie-i-dostep.md) | Logowanie i dostęp według roli oraz obiektu | MVP-1 | Do zrobienia | Oczekuje |
| [F02](docs/funkcje/F02-rejestracja-sprawy.md) | Ręczna rejestracja i edycja sprawy | MVP-1 | Do zrobienia | Oczekuje |
| [F03](docs/funkcje/F03-oferty.md) | Warianty, wersje, wybór oferty i PDF | MVP-1 | Do zrobienia | Oczekuje |
| [F04](docs/funkcje/F04-blokada-mews.md) | Odnotowanie ręcznej blokady Mews | MVP-1 | Do zrobienia | Oczekuje |
| [F05](docs/funkcje/F05-przekazanie-karty.md) | Przekazanie karty i publikacja kolejnej wersji | MVP-1 | Do zrobienia | Oczekuje |
| [F06](docs/funkcje/F06-potwierdzenie-recepcji.md) | Odczyt i potwierdzenie wersji przez recepcję | MVP-1 | Do zrobienia | Oczekuje |

## Zmiany względem specyfikacji

Brak odstępstw implementacyjnych. Zakres pilotażu i odłożenie rozliczeń określają DEC-1 i DEC-3 w §11.

## Znane ograniczenia

Gmail i Mews są na etapie pilotażu obsługiwane ręcznie. Rozliczenia przewidziano po pilotażu. W obecnym prototypie role są symulowane, a dane pozostają w przeglądarce. Wyniki prób z użytkownikami będą zbierane w pilotażu.

## Bezpieczeństwo i dane

- Poziom P0 przy fikcyjnych danych i identyfikatorach kont.
- Weryfikacja całego MVP i bramka prawdziwych danych oczekują na Fazę C oraz decyzję właściciela zgodnie z §7.

## Jak uruchomić lokalnie

Demo uruchamia się po otwarciu `index.html`. F00 uzupełni instrukcję przygotowania konfiguracji testowej, ładowania danych, uruchomienia wersji pilotażowej i wykonania testów.

## Dokumentacja

- [Specyfikacja pilotażu](docs/specyfikacja.md) i [karty funkcji](docs/funkcje/).
- [Wytyczne wyglądu](design.md), [zasady dla agentów](AGENTS.md) i [wcześniejsza specyfikacja funkcjonalna w PDF](docs/specyfikacja.pdf).
- Plan techniczny `docs/plan.md` powstaje w Fazie A. Raporty `docs/weryfikacja/` powstają w Fazie C.
