# F05 · Przekazanie karty i publikacja kolejnej wersji

Status: do zrobienia · Priorytet: MVP-1 · Złożoność: wysoka → Wysoki · walidacja powiązań i niezmienne wersje

Zależy od: F03, F04
Źródło: DEC-2, A2–A4, wcześniejsza specyfikacja §9 i AC-12–14

## Do przeczytania

[AGENTS.md](../../AGENTS.md), [specyfikacja](../specyfikacja.md) (§4, §5 E3, §6 Przekazana karta, §7 N3, §12 Q2 i Q8; design.md §10) i sekcja F05 przyszłego planu technicznego.

## Cel

Utrwalić wersję ustaleń dla recepcji i pokazać zmiany przy kolejnym przekazaniu.

## Zachowanie

Sprzedaż sprawdza ustalenia w E3 i wybiera „Przekaż kartę”. Pierwsza wersja wymaga potwierdzenia. Przy kolejnej sprzedaż wybiera, czy wymaga potwierdzenia, i widzi zmienione pola względem ostatniej przekazanej wersji. Aktualizacja robocza pozostaje w E3 do czasu publikacji. Kolejna wersja pozostaje w obrębie tego samego obiektu. Zmiana obiektu po przekazaniu wymaga decyzji przed rozszerzeniem pilotażu.

## Dane

Sprawa dostarcza ustalenia operacyjne, wybrany wariant i ręcznie odnotowaną blokadę. Przekazana karta utrwala dane z chwili publikacji, obiekt, numer, autora, czas i wymóg potwierdzenia. Zapis wykonuje sprzedaż. Odczyt recepcji jest ograniczony do uprawnionego obiektu.

## Kryteria akceptacji

- **F05-KA1** [test] Gdy sprawa nie ma wyboru wariantu, zgodnej blokady, dat, którejś godziny lub liczebności, to publikacja jest odrzucona z listą braków. Obiekt i daty blokady muszą odpowiadać ustaleniom opartym na wybranym wariancie.
- **F05-KA2** [test, ręcznie] Gdy sprzedaż przekazuje pierwszą poprawną kartę, to powstaje v1 z właściwym obiektem, autorem i stanem „Oczekuje na potwierdzenie”.
- **F05-KA3** [test] Gdy sprzedaż zmieni godzinę z 16:00 na 18:00, to v1 zachowuje 16:00, a po przekazaniu v2 pokazuje 18:00 i różnicę 16:00 → 18:00 (N3).
- **F05-KA4** [test] Gdy sprzedaż przekazuje v2 bez wymogu potwierdzenia, to v2 ma status „Informacyjna”, a poprzednie potwierdzenie pozostaje przypisane do v1.
- **F05-KA5** [test] Gdy równoczesne przekazania lub ponowienie po niejasnym wyniku dotyczą tej samej zmiany roboczej, to powstaje najwyżej jedna wersja. Konflikt wskazuje aktualną wersję.
- **F05-KA6** [test] Gdy sprzedaż próbuje przekazać kolejną wersję dla innego obiektu albo recepcja próbuje opublikować kartę, to zapis jest odrzucony.

## Przypadki brzegowe i błędy

Po błędzie zachowaj wartości i wybór potwierdzenia. Pokaż „Nie udało się przekazać karty” i pozwól ponowić ręcznie. Częściowy zapis nie może ujawnić niekompletnej wersji. Przy trwałym błędzie właściciel środowiska dostaje neutralny identyfikator z opisu użytkownika.

## Ochrona danych

P0 w pilotażu. Przekazuj wyłącznie pola operacyjne z §6. Cena, oferta, PDF oraz referencja Mews pozostają w widoku sprzedaży.

## Poza zakresem

Zmiana hotelu po przekazaniu, wyjątki od blokady, wysyłanie powiadomień i rejestr wpłat.

## Jak sprawdzić ręcznie

Przygotuj sprawę z ofertą i blokadą, opublikuj v1. Zmień godzinę i opublikuj v2, sprawdź różnicę, stan potwierdzenia oraz treść v1.
