# F02 · Ręczna rejestracja i edycja sprawy

Status: do zrobienia · Priorytet: MVP-1 · Złożoność: średnia → Średni · formularz i zapis jednej encji

Zależy od: F01
Źródło: DEC-1, A3, A4, wcześniejsza specyfikacja §5.1

## Do przeczytania

[AGENTS.md](../../AGENTS.md), [specyfikacja](../specyfikacja.md) (§4, §5 E2–E3, §6 Sprawa grupy, §9; design.md §6 i §8) i sekcja F02 przyszłego planu technicznego.

## Cel

Zapisać sprawę na podstawie testowego zapytania i stopniowo uzupełnić ustalenia.

## Zachowanie

Sprzedaż wybiera „Nowa grupa” w E2, zapisuje podstawowe informacje i otwiera E3. Może edytować dane pobytu, a lista umożliwia znalezienie sprawy po grupie lub organizatorze. Formularz wskazuje pola wymagane dla bieżącego zapisu.

## Dane

Wymagane przy utworzeniu są nazwa grupy, organizator i opiekun ze sprzedaży. Daty, godziny, liczebność, pokoje, usługi, uwagi i fikcyjny kontakt można uzupełnić później. Dane sprawy widzi sprzedaż. Recepcja otrzymuje ustalenia po przekazaniu w F05.

## Kryteria akceptacji

- **F02-KA1** [test, ręcznie] Gdy sprzedaż wpisze „Grupa Alfa”, „Organizator A” i opiekuna, pozostawiając termin pusty, to sprawa pojawia się na liście i otwiera się w E3.
- **F02-KA2** [test] Gdy nazwa składa się z samych spacji, organizator jest pusty albo opiekun nie należy do sprzedaży, to zapis jest odrzucony i komunikat wskazuje pole.
- **F02-KA3** [test] Gdy komplet dat zawiera wyjazd wcześniejszy od przyjazdu albo równy dacie przyjazdu, to zapis jest odrzucony. Liczebność 1 jest poprawna, 0 i wartości ułamkowe są odrzucane.
- **F02-KA4** [test, ręcznie] Gdy użytkownik wyszukuje istniejącą nazwę organizatora albo grupy, to lista pokazuje pasującą sprawę. Brak dopasowań daje komunikat „Brak pasujących spraw”.
- **F02-KA5** [test] Gdy dwa zapisy dotyczą tego samego stanu sprawy, to starsza edycja otrzymuje komunikat o konflikcie i zachowuje wpisane wartości.
- **F02-KA6** [test] Gdy recepcja próbuje odczytać lub zmienić roboczą sprawę, to dostaje odmowę.

## Przypadki brzegowe i błędy

Niepowodzenie wczytania pokazuje błąd i ponowienie. Przy zapisie pokaż „Nie udało się zapisać sprawy”, zachowaj wartości i pozwól ręcznie ponowić. Przy podwójnym kliknięciu lub ponowieniu po niejasnym wyniku powstaje najwyżej jedna nowa sprawa z danej operacji. Trwały błąd użytkownik może przekazać właścicielowi środowiska podając neutralny identyfikator.

## Ochrona danych

P0 w pilotażu. Przykłady i kontakt są fikcyjne. Treść wiadomości Gmail pozostaje poza bazą i logami.

## Poza zakresem

Automatyczne zaczytanie maila, katalog klientów, import, oferty i przekazanie karty.

## Jak sprawdzić ręcznie

Utwórz niepełną sprawę, znajdź ją na liście, dopisz termin i odśwież ekran. Spróbuj zapisać odwrócone daty.
