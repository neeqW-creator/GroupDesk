# F01 · Logowanie i dostęp według roli oraz obiektu

Status: do zrobienia · Priorytet: MVP-1 · Złożoność: wysoka → Wysoki · sesje i kontrola dostępu

Zależy od: F00
Źródło: DEC-1, A1, wcześniejsza specyfikacja §3

## Do przeczytania

[AGENTS.md](../../AGENTS.md), [specyfikacja](../specyfikacja.md) (§4, §6 Konto i Obiekt, §7 N1; design.md §7) i sekcja F01 przyszłego planu technicznego.

## Cel

Rozpoznać rolę po zalogowaniu i egzekwować dostęp do danych na podstawie sesji.

## Zachowanie

Właściciel nadaje role i przypisuje recepcję do obiektu poza interfejsem aplikacji. E1 kieruje sprzedaż do E2, a recepcję do E5. Wylogowanie lub wyłączenie konta odbiera dostęp. Zdefiniuj reguły, które kolejne karty zastosują do swoich danych.

## Dane

Konto ma identyfikator, etykietę, rolę, aktywność i obiekt dla recepcji. Obiekt ma nazwę i identyfikator. Zakres odczytu i zapisu określa macierz w §4.

## Kryteria akceptacji

- **F01-KA1** [test, ręcznie] Gdy zaloguje się konto sprzedaży lub Recepcja A, to odpowiednio otwiera się E2 lub E5.
- **F01-KA2** [test] Gdy sesja wygasła albo konto jest wyłączone, to odczyt oraz zapis są odrzucone, a interfejs prowadzi do logowania.
- **F01-KA3** [test] Gdy Recepcja A próbuje odczytać lub zmienić dane z zakresu recepcji B, także poza interfejsem, to reguły odrzucają odczyt i zapis (N1). Sprawdź symetrycznie konto B.
- **F01-KA4** [test] Gdy konto recepcji wysyła operację lub parametr przypisujący mu rolę sprzedaży albo inny obiekt, to próba jest odrzucona, a zakres sesji pozostaje ten sam.
- **F01-KA5** [test, ręcznie] Gdy błędne dane logowania lub awaria usługi uniemożliwiają logowanie, to sesja nie powstaje, a ekran pozwala podjąć nową próbę.

## Przypadki brzegowe i błędy

Po błędzie pokaż neutralny komunikat logowania lub niedostępności usługi. Zachowaj wpisany identyfikator, wyczyść pole sekretu i pozwól spróbować ręcznie. Aplikacja nie ponawia próby. Powtarzającą się awarię właściciel środowiska diagnozuje po neutralnym identyfikatorze błędu.

## Ochrona danych

P0 w pilotażu. Zaufanym źródłem tożsamości jest aktywna sesja. Logi i komunikaty nie zawierają identyfikatorów logowania ani sekretów.

## Poza zakresem

Rejestracja użytkowników, zarządzanie rolami w aplikacji i odzyskiwanie konta przez własne mechanizmy.

## Jak sprawdzić ręcznie

Zaloguj się trzema kontami, sprawdź ekrany startowe i wyloguj się. Uruchom test odmowy dostępu dla recepcji A i B.
