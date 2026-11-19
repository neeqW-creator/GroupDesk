# F03 · Warianty, wersje, wybór oferty i PDF

Status: do zrobienia · Priorytet: MVP-1 · Złożoność: wysoka → Wysoki · kalkulacja, wersje i spójność PDF

Zależy od: F02
Źródło: DEC-1, A2, A4, wcześniejsza specyfikacja §7 oraz AC-05–07

## Do przeczytania

[AGENTS.md](../../AGENTS.md), [specyfikacja](../specyfikacja.md) (§5 E4, §6 Oferta i Sprawa grupy, §7 N3, §12 Q3; design.md §9 i §11) i sekcja F03 przyszłego planu technicznego.

## Cel

Przygotować warianty oraz pobrać PDF odpowiadający wybranej zapisanej wersji.

## Zachowanie

Sprzedaż tworzy w E4 wersję z co najmniej jednym wariantem i zapisuje ją z ważnością i warunkami. Może rozpocząć kolejną wersję od poprzedniej. Kwota pozycji to ilość razy wpisana cena jednostkowa, a kwota wariantu to suma pozycji w PLN liczonych do groszy. PDF zawiera numer wersji, datę zapisu, ważność, warianty, ceny i warunki. Sprzedaż ręcznie obsługuje pocztę i wskazuje w sprawie wariant z zapisanej wersji.

## Dane

Oferta to sprawa, wersja, czas, ważność, warunki, warianty z obiektem, terminem i pozycjami cenowymi. Sprawa wskazuje jedną wybraną wersję i wariant. Dostęp ma sprzedaż.

## Kryteria akceptacji

- **F03-KA1** [test] Gdy wariant ma 20 × 125,50 zł i 40 × 25,00 zł, to jego suma wynosi 3 510,00 zł. Pozycja z ceną 0,00 zł jest dopuszczalna, cena ujemna i ilość 0 są odrzucane.
- **F03-KA2** [test, ręcznie] Gdy sprzedaż zapisze ofertę z wariantami Hotel A i Hotel B oraz wskaże Hotel A, to oba warianty pozostają w historii, a sprawa wskazuje dokładnie Hotel A i numer wersji.
- **F03-KA3** [test] Gdy w v2 sprzedaż zmieni cenę v1 z 125,50 zł na 130,00 zł, to v1 i PDF pobrany dla v1 nadal wykazują pierwotną cenę (N3).
- **F03-KA4** [test, ręcznie] Gdy sprzedaż pobiera PDF dla v2 przy otwartej edycji v3, to dokument pokazuje dane v2. Zawiera wymagane warianty i sumy; wybranie pobrania nie zmienia historii sprawy.
- **F03-KA5** [test] Gdy oferta nie zawiera wariantu, pozycja ma więcej niż dwa miejsca po przecinku albo ważność jest przed dniem zapisu, to zapis jest odrzucony z oznaczeniem pola.
- **F03-KA6** [test] Gdy recepcja próbuje odczytać ofertę lub wygenerować jej PDF, to dostaje odmowę.

## Przypadki brzegowe i błędy

Po błędzie zapisu zachowaj edycję i pozwól ponowić ręcznie. Podwójne kliknięcie lub ponowienie po niejasnym wyniku zapisuje jedną wersję danej operacji. Błąd tworzenia PDF pokazuje „Nie udało się przygotować PDF” i pozwala ponowić dla tej samej wersji. Aplikacja nie ponawia samoczynnie. Trwały błąd można przekazać właścicielowi środowiska z neutralnym identyfikatorem.

## Ochrona danych

P0 w pilotażu. Nazwa pobieranego pliku wykorzystuje wyłącznie neutralny identyfikator oferty i numer wersji. W pilotażu PDF zawiera dane fikcyjne.

## Poza zakresem

Cenniki, podatki, rabaty, inne waluty, wysyłka i historia korespondencji.

## Jak sprawdzić ręcznie

Zapisz v1 z dwoma wariantami, skopiuj do v2 i zmień jedną cenę. Pobierz oba PDF i porównaj tę pozycję. Wskaż wariant.
