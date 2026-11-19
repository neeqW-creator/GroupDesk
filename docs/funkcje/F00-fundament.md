# F00 · Fundament pilotażu i dane testowe

Status: do zrobienia · Priorytet: MVP-1 · Złożoność: wysoka → Wysoki · konfiguracja dostępu do bazy i ochrony sekretów

Zależy od: —
Źródło: DEC-1, A1, wymagania F00 z promptu

## Do przeczytania

[AGENTS.md](../../AGENTS.md), [specyfikacja](../specyfikacja.md) (§7–9 i §13; design.md §2–5) i sekcja F00 przyszłego planu technicznego.

## Cel

Uruchomić odtwarzalne środowisko pilotażu, w którym cała ścieżka może być sprawdzona na fikcyjnych danych.

## Zachowanie

Utwórz szkielet według Fazy A i wydzieloną bazę deweloperską w regionie UE z domyślną odmową dostępu. Zastosuj tokeny wizualne z design.md. Przygotuj `.env.example` z samymi nazwami i sprawdź reguły ignorowania. Skonfiguruj blokadę odczytu sekretów przez agenta według aktualnej dokumentacji narzędzia. Właściciel uzupełnia sekrety środowiska testowego. Opisz w README przebieg od konfiguracji przez dane startowe do uruchomienia testów.

## Dane

Hotel A, Hotel B, jedno konto sprzedaży i po jednym koncie recepcji każdego obiektu, korzystające z fikcyjnych identyfikatorów. Przygotuj scenariusz Grupy Alfa na dwie noce z dwoma wariantami, referencją TEST-BLK-01 i zmianą 16:00 → 18:00. Zakres rekordów ładowanych do bazy rośnie wraz z kartami wprowadzającymi ich encje.

## Kryteria akceptacji

- **F00-KA1** [ręcznie] Gdy właściciel wykona kroki z README na świeżym środowisku testowym, to może uruchomić aplikację lokalnie i uruchomić zestaw testów jednym poleceniem.
- **F00-KA2** [test] Gdy dane startowe zostaną załadowane dwukrotnie, to po obu uruchomieniach istnieją dokładnie dwa obiekty i trzy fikcyjne konta.
- **F00-KA3** [test] Gdy Git sprawdza wzorce .env i .env.local, to pliki są ignorowane, a .env.example można dodać i zawiera tylko nazwy zmiennych.
- **F00-KA4** [ręcznie] Gdy test konfiguracji ochrony spróbuje odczytać plik zastępczy o wzorcu .env, to narzędzie odmawia dostępu. Test używa pliku bez sekretów.
- **F00-KA5** [test, ręcznie] Gdy osoba bez sesji odczytuje fikcyjne rekordy przez interfejs dostępu do danych, to odczyt jest odrzucony. Środowisko pilotażowe ma potwierdzony region UE.
- **F00-KA6** [test] Gdy ładowanie danych kończy się błędem, to wynik sygnalizuje niepowodzenie, a ponowienie po usunięciu przyczyny daje pełny zestaw bez duplikatów.

## Przypadki brzegowe i błędy

Błąd konfiguracji albo zasilenia danych zatrzymuje daną operację z identyfikatorem błędu i bez wypisania wartości konfiguracji. Właściciel środowiska otrzymuje wynik z narzędzia uruchomieniowego. Po usunięciu przyczyny uruchamia operację ponownie. Faza A ustala mechanizm zapewniający spójność po częściowym błędzie.

## Ochrona danych

P0 w pilotażu. Testy bez prawdziwej wysyłki i płatnych wywołań. Zastosuj atrapy wyłącznie tam, gdzie implementacja korzysta z usług zewnętrznych.

## Poza zakresem

Logowanie i macierz ról (F01), integracje Gmail i Mews oraz konfiguracja produkcji.

## Jak sprawdzić ręcznie

Uruchom aplikację i testy według README. Załaduj dane dwa razy, sprawdź liczebności i potwierdź ochronę na pliku zastępczym.
