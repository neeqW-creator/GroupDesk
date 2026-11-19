# F06 · Odczyt i potwierdzenie wersji przez recepcję

Status: do zrobienia · Priorytet: MVP-1 · Złożoność: wysoka → Wysoki · reguły obiektu i zapis potwierdzenia

Zależy od: F01, F05
Źródło: DEC-2, A1, A4, wcześniejsza specyfikacja §9.2 i AC-12–16

## Do przeczytania

[AGENTS.md](../../AGENTS.md), [specyfikacja](../specyfikacja.md) (§4, §5 E5, §6 Przekazana karta i Potwierdzenie, §7 N1–N2; design.md §10) i sekcja F06 przyszłego planu technicznego.

## Cel

Umożliwić recepcji sprawdzenie ustaleń i świadome potwierdzenie przeczytania wersji.

## Zachowanie

E5 pokazuje najnowszą kartę własnego obiektu i historię wraz ze stanami wersji oraz zaległymi wymaganymi potwierdzeniami. Szczegóły aktualizacji pokazują różnice. Przycisk „Potwierdź przeczytanie” działa na dokładnie otwartej wersji wymagającej potwierdzenia. Sprzedaż widzi wynik w E3.

## Dane

Przekazana karta zawiera wersję, obiekt, utrwalone ustalenia i wymóg potwierdzenia. Potwierdzenie ma ID wersji, konto recepcji z sesji i czas aplikacji. Wersja ma najwyżej jedno potwierdzenie.

## Kryteria akceptacji

- **F06-KA1** [test, ręcznie] Gdy przekazano karty Hotelu A i Hotelu B, to Recepcja A widzi w E5 tylko karty A, a Recepcja B tylko karty B.
- **F06-KA2** [test] Gdy Recepcja A otworzy v1, to stan pozostaje „Oczekuje na potwierdzenie”. Po kliknięciu powstaje potwierdzenie z kontem A, czasem i v1. E3 pokazuje ten sam wynik (N2).
- **F06-KA3** [test] Gdy dwa uprawnione konta recepcji tego samego obiektu potwierdzają równocześnie tę samą wersję, to zostaje jeden zapis z pierwotnym autorem i czasem (N2). Do tego sprawdzenia użyj dodatkowego fikcyjnego konta.
- **F06-KA4** [test, ręcznie] Gdy v1 jest przeczytana, a v2 wymaga potwierdzenia, to E5 pokazuje różnicę i oczekującą v2. Jeśli przekazano potem informacyjną v3, to zaległa v2 nadal wymaga potwierdzenia, a v3 nie ma potwierdzenia.
- **F06-KA5** [test] Gdy Recepcja B bezpośrednio odczytuje lub próbuje potwierdzić kartę A, albo sprzedaż próbuje zapisać potwierdzenie jako recepcja, to operacja jest odrzucona (N1).
- **F06-KA6** [test, ręcznie] Gdy brak kart dla obiektu, to ekran pokazuje „Brak przekazanych kart”. Awaria odczytu wyświetla komunikat o błędzie z możliwością ponowienia.

## Przypadki brzegowe i błędy

Przy nieudanym potwierdzeniu pozostaw użytkownika na tej samej wersji i pokaż „Nie udało się zapisać potwierdzenia”. Umożliw ręczne ponowienie. Jeżeli pierwsza próba została zapisana, ponowienie odczytuje istniejące potwierdzenie. Trwały błąd można zgłosić właścicielowi środowiska z neutralnym identyfikatorem.

## Ochrona danych

P0 w pilotażu. Reguły odczytu i potwierdzania sprawdzają rolę i obiekt po stronie serwera lub bazy. Fałszywy autor z formularza jest ignorowany albo odrzucany.

## Poza zakresem

Potwierdzenia zmian roboczych, potwierdzenia per zmiana lub osoba, edycja ustaleń przez recepcję i rozliczenia.

## Jak sprawdzić ręcznie

Jako Recepcja A otwórz i potwierdź v1, sprawdź stan w E3 i przejdź na v2. Jako Recepcja B spróbuj odczytu karty A.
