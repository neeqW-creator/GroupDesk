# Zasady pracy w GroupDesk

## Dokumenty

- [Specyfikacja](docs/specyfikacja.md) określa zakres, model danych (§6) i ochronę danych (§7). Każda [karta](docs/funkcje/) dotyczy jednej sesji budowy.
- `docs/plan.md` powstaje w Fazie A. Aktualizuj w nim status, następny krok i wnioski istotne dla dalszej pracy.
- [design.md](design.md) określa język wizualny. [index.html](index.html) pokazuje przepływ w prototypie.
- W razie rozbieżności stosuj kolejność decyzje DEC → specyfikacja → karta → plan. Rozbieżność zgłoś właścicielowi.

## Sposób pracy

- Zacznij od `git status`, dostępnych testów i planu w 3–5 punktach. Przeczytaj kartę, wskazane sekcje oraz właściwy fragment planu.
- Buduj zakres jednej karty. Zmiany zakresu lub kryteriów uzgadniaj z właścicielem. Zachowaj uzasadnione oczekiwania istniejących testów.
- Po wykonaniu sprawdź testy i ścieżkę ręczną, uzupełnij [README](README.md) i plan, zapisz commit z ID funkcji.
- Publikacja, wysyłka i zmiany w zewnętrznych usługach wymagają zgody właściciela. Dokumentację i komunikaty pisz po polsku.

## Ochrona danych

- Korzystaj wyłącznie z fikcyjnych danych i kont w oddzielnym środowisku testowym. Przykłady, zrzuty, logi i eksporty przekazywane agentowi również używają fikcyjnych danych.
- Właściciel przechowuje sekrety poza Gitem i dostępem agenta. Pracuj z `.env.example` zawierającym same nazwy. Uprzywilejowane klucze pozostają po stronie serwera. Agent pracuje bez dostępu do produkcji.
- Reguły dostępu domyślnie odmawiają odczytu i zapisu. Tożsamość, rola i obiekt pochodzą z sesji. Uprawnienia i dane wejściowe sprawdzaj po stronie serwera lub bazy. Testuj również bezpośrednie operacje.
- Logi, błędy, adresy i nazwy plików korzystają z neutralnych identyfikatorów. Jeśli pojawi się prawdziwy sekret albo dane, zgłoś ich obecność bez cytowania. W przypadku ujawnienia sekretu właściciel go rotuje.
- Gmail i Mews są obsługiwane ręcznie. Testy używają sztucznych materiałów bez wysyłania prawdziwych wiadomości i bez zmian w Mews. Prawdziwe dane wymagają przejścia bramki z §7 specyfikacji.
- N1–N4 sprawdzają granice dostępu pomiędzy obiektami, potwierdzanie konkretnej wersji, niezmienność historii oraz zachowanie po upływie terminu blokady.
