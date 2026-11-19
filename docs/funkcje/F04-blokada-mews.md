# F04 · Odnotowanie ręcznej blokady Mews

Status: do zrobienia · Priorytet: MVP-1 · Złożoność: średnia → Średni · zapis i oznaczenie terminu sprawdzenia

Zależy od: F02
Źródło: DEC-1, A2, A4, wcześniejsza specyfikacja §6.2 i AC-08–09

## Do przeczytania

[AGENTS.md](../../AGENTS.md), [specyfikacja](../specyfikacja.md) (§4, §5 E3, §6 Blokada, §7 N4; design.md §7) i sekcja F04 przyszłego planu technicznego.

## Cel

Dać sprzedaży zapis ręcznej operacji w Mews i sygnał, kiedy wymaga sprawdzenia.

## Zachowanie

Sprzedaż odnotowuje blokadę w E3 po ręcznej operacji w Mews. Pokazuje się referencja i termin wygaśnięcia. Upływ terminu oznacza „Wymaga sprawdzenia”. Zmiana obiektu lub terminu pobytu wymaga potwierdzenia zgodności blokady przed użyciem jej przy przekazaniu.

## Dane

Blokada należy do sprawy i ma obiekt, termin pobytu, zakres pokoi, referencję, termin wygaśnięcia, autora i czas odnotowania. Sprzedaż czyta i aktualizuje rekord, aplikacja nadaje autora z sesji i czas.

## Kryteria akceptacji

- **F04-KA1** [test, ręcznie] Gdy sprzedaż wpisze obiekt, termin, zakres pokoi, TEST-BLK-01 i wygaśnięcie, to E3 pokazuje wpis po ponownym wczytaniu.
- **F04-KA2** [test] Gdy brakuje referencji albo zakres obejmuje 0 pokoi, to zapis jest odrzucony. Jeden pokój z poprawnymi pozostałymi polami jest dopuszczalny.
- **F04-KA3** [test] Gdy czas osiągnie termin wygaśnięcia, to E3 pokazuje „Wymaga sprawdzenia”, a referencja pozostaje widoczna bez oznaczenia zwolnienia (N4).
- **F04-KA4** [test] Gdy obiekt lub daty sprawy zmienią się i przestaną odpowiadać zapisanej blokadzie, to E3 sygnalizuje konieczność sprawdzenia zgodności.
- **F04-KA5** [test] Gdy rola recepcji bezpośrednio odpyta lub wyśle zmianę wpisu blokady, to dostaje odmowę.

## Przypadki brzegowe i błędy

Błąd zapisu zachowuje formularz, wyświetla komunikat i umożliwia ręczne ponowienie. Podwójne kliknięcie nie tworzy drugiej blokady. Użytkownik może przekazać trwały błąd właścicielowi środowiska z identyfikatorem.

## Ochrona danych

P0 w pilotażu. Referencja i obiekty są testowe. Aplikacja nie potrzebuje klucza Mews.

## Poza zakresem

Odczyt dostępności, zmiany w Mews z CRM, automatyczne zadania i powiadomienia.

## Jak sprawdzić ręcznie

Odnotuj testową blokadę, sprawdź wpis po odświeżeniu. Użyj przykładu z upływającym terminem i zobacz oznaczenie sprawdzenia.
