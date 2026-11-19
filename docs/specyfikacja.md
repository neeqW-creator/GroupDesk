# GroupDesk — specyfikacja MVP pilotażu

Wersja 1.0 pilotażu · 19 listopada 2026 r. · Zakres i założenia A1–A4 zatwierdzone.

## 1. Cel i użytkownicy

Centralna sprzedaż przygotowuje ofertę i przekazuje recepcji właściwego hotelu wersję ustaleń potrzebnych do przyjęcia grupy. Sprzedaż może sprawdzić, którą wersję i kiedy przeczytano. Pilotaż obejmuje dwa fikcyjne obiekty i wspólne środowisko testowe.

Podstawą są zatwierdzony szkielet, wcześniejsza specyfikacja funkcjonalna (Git `0d6414a`, `docs/specyfikacja.md`, §3–9 i §19), [prototyp](../index.html) oraz [wytyczne wyglądu](../design.md). W razie rozbieżności zakres pilotażu określają decyzje w §11.

## 2. Co pokazały testy

W dostępnych materiałach brakuje wyników testów z użytkownikami. Hipoteza do sprawdzenia w pilotażu (R1) zakłada, że obsługa dwóch wersji karty pozwoli sprzedaży i recepcji odróżnić aktualne ustalenia od tych już przeczytanych. Obserwujemy, na której wersji pracuje recepcja i czy sprzedaż potrafi wskazać zaległe potwierdzenie bez pomocy prowadzącego.

## 3. Zakres MVP

- **W MVP** — F00–F06. Sprzedaż rejestruje zapytanie ręcznie, sprawdza dostępność poza CRM, tworzy warianty i wersje oferty, pobiera PDF, ręcznie obsługuje korespondencję w Gmailu, oznacza uzgodniony wariant i zapisuje referencję blokady z Mews. Następnie przekazuje kartę. Recepcja widzi kartę i potwierdza wersję. Sprzedaż zmienia godzinę przyjazdu, publikuje nową wersję i wybiera, czy wymaga potwierdzenia.
- **Później** — integracje Gmail i Mews, automatyczny odczyt zapytań, katalog klientów, import i eksport danych poza PDF oferty, listy uczestników i przydziały imienne, wpłaty i rozliczenia, zadania i przypomnienia, raporty, role kierownika i zarządu oraz ekran administracyjny.

Scenariusz odbioru używa grupy 40 osób na dwie noce i dwóch wariantów. Sprzedaż zachowuje ofertę v1, zmienia cenę w v2, pobiera PDF v2 i wybiera wariant Hotelu A. Dodaje referencję testowej blokady, przekazuje kartę v1 i widzi potwierdzenie recepcji A. Zmienia przyjazd z 16:00 na 18:00 i przekazuje v2 z prośbą o ponowne potwierdzenie. Recepcja A widzi obie godziny i potwierdza v2. Recepcja B nie otrzymuje żadnej wersji. Przebieg Gmaila i Mews można przećwiczyć na przygotowanych materiałach testowych bez korzystania z produkcyjnych skrzynek i blokad.

## 4. Role i uprawnienia

| Obszar | Sprzedaż | Recepcja |
|---|---|---|
| Sprawa, oferta, PDF i blokada | Odczyt i obsługa wszystkich spraw | Brak dostępu |
| Robocze ustalenia do karty | Odczyt i edycja | Brak dostępu |
| Przekazana karta | Tworzenie wersji i odczyt historii | Odczyt przekazanych wersji własnego obiektu |
| Potwierdzenie | Odczyt dla wszystkich obiektów | Zapis we własnym imieniu dla wersji własnego obiektu |
| Konta i role | Właściciel konfiguruje testowe konta poza aplikacją | Brak samodzielnej zmiany roli lub obiektu |

Bez uwierzytelnionej, aktywnej sesji dostęp do danych jest zablokowany. Wyłączenie konta odbiera dostęp i zachowuje historyczne potwierdzenia.

## 5. Ekrany i ścieżki

| ID | Ekran | Działanie |
|---|---|---|
| E1 | Logowanie | Nowy ekran. Po zalogowaniu sprzedaż trafia do E2, recepcja do E5. |
| E2 | Grupy i zapytania | Lista spraw, wyszukiwanie po nazwie grupy lub organizatorze, „Nowa grupa”. |
| E3 | Karta grupy | Edycja ustaleń, referencja blokady, „Przekaż kartę”, historia i potwierdzenia. |
| E4 | Oferta | Warianty, „Zapisz wersję”, „Pobierz PDF” i wybór wariantu z zapisanej wersji. |
| E5 | Recepcja | Lista przekazanych kart, najnowsza wersja i historia, zmiany oraz „Potwierdź przeczytanie”. |

Sprzedaż przechodzi E1 → E2 → E3 → E4 → E3. Recepcja przechodzi E1 → E5 → szczegóły wersji w E5.

## 6. Model danych

W tabeli **Z** oznacza zwykłe dane demonstracyjne. **I** oznacza identyfikator lub dane kontaktowe mogące identyfikować osobę po przejściu na prawdziwe dane. W pilotażu wszystkie wartości są fikcyjne. Wewnętrzne identyfikatory powiązań nadaje aplikacja i chroni zgodnie z §4.

| Encja i pola | Typ, wymagalność i przykład fikcyjny | Kto ustawia i po co | Kto widzi | Kategoria |
|---|---|---|---|---|
| Obiekt · nazwa | Tekst, wymagana, „Hotel A” | Właściciel, konfiguracja zakresu obiektu | Sprzedaż, recepcja własnego obiektu | Z |
| Konto · identyfikator logowania, etykieta | Tekst, wymagane, „recepcja-a”, „Recepcja A” | Właściciel, logowanie i rozpoznanie autora | Identyfikator do logowania własnego konta. Etykieta w odpowiedniej historii. | I |
| Konto · rola, obiekt, aktywność | Wybór roli, odwołanie do obiektu wymagane dla recepcji, tak/nie | Właściciel, przypisanie dostępu | Właściciel w konfiguracji, użytkownik widzi swój zakres pracy | Z |
| Sprawa grupy · nazwa i organizator | Tekst, wymagane, „Grupa Alfa”, „Organizator A” | Sprzedaż, identyfikacja sprawy | Sprzedaż, recepcja poprzez kartę | Z |
| Sprawa grupy · opiekun, opcjonalny kontakt organizacyjny | Konto sprzedaży wymagane. Etykieta i kanał kontaktu opcjonalne, „Koordynator A”, „grupa@example.invalid”. | Sprzedaż, odpowiedzialność i kontakt przy przyjeździe | Sprzedaż, recepcja w przekazanej karcie w zakresie kontaktu operacyjnego | I |
| Sprawa grupy · termin, godziny, liczebność, pokoje, usługi i uwagi | Daty, godziny, liczby, tekst. Termin, obie godziny i liczebność wymagane przy przekazaniu. Przykład 40 osób, 20 pokoi, przyjazd 16:00. | Sprzedaż, uzgodnienia pobytu | Sprzedaż, recepcja poprzez kartę | Z |
| Sprawa grupy · wybrany wariant | Odwołanie do wariantu i wersji, wymagane przy przekazaniu | Sprzedaż, wskazanie podstawy ustaleń | Sprzedaż | Z |
| Oferta · sprawa, wersja, chwila zapisu | Odwołanie i wartości nadawane przez aplikację, wymagane, „v2” | Aplikacja, historia ustaleń | Sprzedaż | Z |
| Oferta · ważność i warunki | Data oraz tekst, wymagane przy zapisaniu wersji | Sprzedaż, ustalenie ważności i warunków oferty | Sprzedaż | Z |
| Oferta · warianty i pozycje cenowe | Co najmniej jeden wariant. Obiekt, termin i co najmniej jedna pozycja z nazwą, ilością i końcową ceną jednostkową w PLN. | Sprzedaż wpisuje dane, aplikacja oblicza sumy | Sprzedaż | Z |
| Blokada · sprawa, obiekt, termin pobytu, zakres pokoi, referencja, wygaśnięcie | Odwołania, daty, ilości i tekst, wymagane, „TEST-BLK-01” | Sprzedaż, potwierdzenie ręcznego działania i podstawa do sprawdzenia | Sprzedaż | Z |
| Blokada · autor i czas odnotowania | Konto i czas, wymagane | Aplikacja, ślad działania sprzedaży | Sprzedaż | I dla konta, Z dla czasu |
| Przekazana karta · sprawa, obiekt, wersja, czas, obowiązek potwierdzenia | Odwołania, liczba, czas, tak/nie, wymagane | Aplikacja utrwala wersję i wybór sprzedaży | Sprzedaż, recepcja właściwego obiektu | Z |
| Przekazana karta · autor i utrwalone ustalenia | Konto autora oraz kopia pól operacyjnych sprawy z chwili przekazania | Aplikacja, identyfikacja autora i zachowanie ustaleń | Sprzedaż, recepcja właściwego obiektu | I dla autora, opiekuna i kontaktu. Z dla pozostałych pól. |
| Potwierdzenie · wersja, konto recepcji, czas | Odwołania i czas, wszystkie wymagane | Aplikacja, dowód przeczytania danej wersji | Sprzedaż, recepcja właściwego obiektu | I dla konta, Z dla wersji i czasu |

Każda sprawa ma wiele zapisanych ofert i przekazanych kart. Blokada jest powiązana ze sprawą. Na daną wersję karty przypada najwyżej jedno potwierdzenie. W pilotażu brak usuwania pojedynczych spraw i wersji z interfejsu. Właściciel resetuje przygotowane dane testowe jako całość.

## 7. Ochrona danych i bezpieczeństwo

**P0 dla pilotażu** z fikcyjnymi rekordami i fikcyjnymi identyfikatorami kont. Użycie rzeczywistych identyfikatorów pracowników uruchamia bramkę P1. Wprowadzenie danych osób trzecich wymaga oceny P2 przed ich przyjęciem. Zakres pilotażu nie obejmuje list uczestników ani treści wiadomości. Dane wpisywane ręcznie ograniczają się do pól §6.

- Tylko dane fikcyjne w testach, repozytorium, rozmowach, zrzutach i eksportach przekazywanych agentowi. Praca odbywa się w osobnym środowisku deweloperskim. Konfigurację przyszłej produkcji prowadzi właściciel.
- Sekrety przechowuje właściciel poza Gitem i poza dostępem agenta. `.env.example` zawiera wyłącznie nazwy zmiennych. Uprzywilejowane klucze pozostają po stronie serwera.
- Każdy odczyt i zapis zaczyna od odmowy dostępu. Reguły ustalają rolę i obiekt na podstawie sesji, a sprawdzenie następuje po stronie serwera lub bazy. Walidacja zapisu obowiązuje również przy operacjach poza interfejsem.
- Logi, błędy, adresy i nazwy plików używają neutralnych identyfikatorów. Log techniczny może zawierać czas, typ operacji i identyfikator błędu.
- Testy używają atrap usług i fikcyjnych kont. Działania Gmail i Mews wykonuje człowiek poza aplikacją.

| ID | Niezmiennik | Sprawdzenie |
|---|---|---|
| N1 | Recepcja widzi wyłącznie przekazane karty własnego obiektu i potwierdza wyłącznie własny obiekt. | F01-KA3, F06-KA5 |
| N2 | Potwierdzenie jest świadomym działaniem przypisanym do konta, czasu i wersji. | F06-KA2, F06-KA3 |
| N3 | Zapisane oferty i przekazane karty zachowują pierwotną treść. | F03-KA3, F05-KA3 |
| N4 | Przeterminowana blokada wymaga sprawdzenia. Upływ czasu sam nie oznacza zwolnienia pokoi. | F04-KA3 |

**Lista weryfikacji Fazy C**

- Sprawdź każde kryterium karty i odnotuj dowód. Uruchom dostępne testy N1–N4, upewnij się, że nowe testy pojawiają się wraz z odpowiednimi kartami.
- Sprawdź dwa konta recepcji, odmowę odczytu i zapisu poza interfejsem, walidację po stronie zaufanej i ochronę przed nadpisaniem.
- Sprawdź zmienione pliki, commit, narzędzia i logi pod kątem sekretów, dostępu do produkcji i danych osobowych. Sprawdź zgodność z kartą, §9 i wyglądem oraz zasadność zmian oczekiwań w testach.

**Bramka przed przyjęciem prawdziwych danych**

Właściciel zatwierdza osobne środowisko produkcyjne i klucze, region przechowywania w UE, listę dostawców i aktualne warunki przetwarzania. Potwierdza testy dwóch kont, informację dla użytkowników, sposób usunięcia lub ograniczenia przetwarzania konta i danych, retencję oraz wynik weryfikacji całego MVP. Przy P2 ustala minimalny zestaw danych i konsultuje plan z prawnikiem lub inspektorem ochrony danych przed przyjęciem takich danych. Wynik i datę odnotowuje w README.

## 8. Założenia techniczne

Aplikacja webowa ze wspólną bazą i logowaniem obsługiwanym przez usługę, w wydzielonym środowisku pilotażowym. W Fazie A wybierz usługę, region UE, sposób konfiguracji testowych kont i reguł dostępu, obsługę jednoczesnej edycji, sposób utrwalania wersji i generowania PDF, sposób powtarzalnego ładowania danych oraz proces lokalnego uruchomienia i testów. Sprawdź aktualne limity, koszt i zasady dostawców. Łącza z integracjami oraz wybór bibliotek pozostają poza tą specyfikacją.

## 9. Wymagania ogólne

- Zachowaj język polski, wzorce formularzy i styl z [design.md](../design.md). E1 oraz stany błędu i pustych list E2 i E5 to sytuacje do uzupełnienia w projekcie interfejsu zgodnie z istniejącymi wzorcami.
- Umożliw obsługę klawiaturą, czytelne etykiety i fokus. Sprawdź główną ścieżkę na komputerze i telefonie. Daty i godziny prezentuj w czasie polskim.
- Zapisy przestrzegają A4. Jeśli stan zmieniła inna osoba, pokaż konflikt, zachowaj wpisane wartości i umożliw porównanie z nowszym zapisem przed ponowieniem.
- Jeśli lista jest pusta, użyj komunikatu odpowiadającego ekranowi. Błąd wczytania zgłoś oddzielnie i pozwól ponowić odczyt.

## 10. Funkcje

| ID | Funkcja | Zależności | Złożoność i poziom |
|---|---|---|---|
| [F00](funkcje/F00-fundament.md) | Fundament pilotażu i dane testowe | — | Wysoka · Wysoki |
| [F01](funkcje/F01-logowanie-i-dostep.md) | Logowanie i dostęp według roli oraz obiektu | F00 | Wysoka · Wysoki |
| [F02](funkcje/F02-rejestracja-sprawy.md) | Ręczna rejestracja i edycja sprawy | F01 | Średnia · Średni |
| [F03](funkcje/F03-oferty.md) | Warianty, wersje, wybór oferty i PDF | F02 | Wysoka · Wysoki |
| [F04](funkcje/F04-blokada-mews.md) | Odnotowanie ręcznej blokady Mews | F02 | Średnia · Średni |
| [F05](funkcje/F05-przekazanie-karty.md) | Przekazanie karty i publikacja kolejnej wersji | F03, F04 | Wysoka · Wysoki |
| [F06](funkcje/F06-potwierdzenie-recepcji.md) | Odczyt i potwierdzenie wersji przez recepcję | F01, F05 | Wysoka · Wysoki |

Wszystkie karty mają priorytet MVP-1. Złożoność F00 podniesiono względem szkieletu zgodnie z wymaganiami promptu dla konfiguracji dostępu do bazy i ochrony sekretów.

## 11. Decyzje i założenia

- **DEC-1** — sprzedaż i recepcja, ręczny Gmail i Mews, fikcyjne dane. Decyzja właściciela w rozmowie, 19.11.2026.
- **DEC-2** — sprzedaż decyduje, czy aktualizacja karty wymaga ponownego potwierdzenia. Wcześniejsza specyfikacja §9.2 i zaakceptowany szkielet.
- **DEC-3** — wpłaty i rozliczenia po pilotażu. Decyzja właściciela w rozmowie, 19.11.2026.
- **A1** — jedno potwierdzenie ze strony recepcji właściwego obiektu, dwa fikcyjne obiekty do sprawdzenia dostępu.
- **A2** — przed pierwszym przekazaniem zapisuje się wybór wariantu i odnotowuje blokadę. Wyjątki pozostają otwarte (Q2).
- **A3** — przy pierwszym zapisie wystarczą nazwa grupy, organizator i opiekun. Komplet ustaleń jest sprawdzany przy przekazaniu.
- **A4** — przy błędzie zapisu wartości pozostają w formularzu, a sukces jest sygnalizowany po zapisie.

A1–A4 zaakceptowano 19.11.2026. Do scenariusza testowego przyjęto kalkulację w PLN jako sumę pozycji, wymagane daty, godziny i liczebność przy publikacji oraz zachowanie tego samego obiektu po pierwszym przekazaniu. Szczegóły opisują F03 i F05. Reguły handlowe dla rzeczywistych ofert i zmiana obiektu po przekazaniu pozostają otwarte w Q3 i Q8.

## 12. Pytania otwarte i ryzyka

| ID | Pytanie i wpływ |
|---|---|
| Q1 | Ile czasu jest na pilotaż i kto go odbierze? Do potwierdzenia przed zamknięciem harmonogramu Fazy A, szczególnie nakładu na F03. |
| Q2 | Czy hotel potrzebuje wyjątku od wymaganej blokady? F05 pilotażu stosuje A2. Decyzja blokuje wyłącznie obsługę wyjątków. |
| Q3 | Waluty, podatki, rabaty, cenniki, języki, szablon, ważność i warunki handlowe. F03 działa na przykładowej kalkulacji w PLN. Decyzje blokują docelową obsługę ofert. |
| Q4 | Rzeczywiste obiekty, kategorie pokoi, role i zastępstwa, identyfikatory oraz zakres uprawnień audytowanych w Mews. Dotyczy przygotowania rzeczywistego wdrożenia i integracji po pilotażu. |
| Q5 | Forma skrzynki, zakres historii Gmail i uprawnienia do integracji. Dotyczy późniejszej integracji. |
| Q6 | Zasady korekt, zwrotów, wielu płatników, rozliczeń i przypomnień. Dotyczy zakresu po pilotażu. |
| Q7 | Hosting, budżet, retencja i odpowiedzialność za awarie. Faza A wybiera konfigurację testową. Wdrożenie z realnymi danymi wymaga decyzji właściciela w ramach §7. |
| Q8 | Jak przekazać grupę do innego obiektu po opublikowaniu karty? Do rozstrzygnięcia przed rozszerzeniem F05 o zmianę obiektu, wraz z zasadą dostępu do wcześniejszych wersji. |

R1 — Brak potwierdzonych obserwacji z testów prototypu. Przeprowadź scenariusz z §3 z osobą ze sprzedaży i osobą z recepcji, zapisując obserwacje oddzielnie od interpretacji. R2 — Wartości ręcznie przenoszone między narzędziami mogą się rozjechać. W pilotażu sprawdź zgodność dat i obiektu w ofercie, blokadzie i przekazanej karcie.

Przed F00 właściciel wskazuje osoby do odbioru, potwierdza dostępny czas i przygotowuje przykładowe zapytanie, testową referencję blokady oraz dwa fikcyjne warianty. Można wykorzystać scenariusz z §3 i dane startowe z F00.

## 13. Jak budować z tą specyfikacją

1. **Faza A · Najwyższy.** Przeczytaj [AGENTS.md](../AGENTS.md), specyfikację i siedem kart. Oceń gotowość (PASS / WARNING / FAIL), zweryfikuj aktualne warunki usług i przygotuj `docs/plan.md` bez implementacji. Plan obejmuje architekturę, model i reguły dostępu, środowiska, decyzje z §8, kolejność i zakres każdej karty, testy N1–N4, uruchomienie, ryzyka i pytania. Oznacz status kart i następny krok. Wnioski techniczne prowadź w planie.
2. **Faza B · Poziom z karty.** W jednej sesji zbuduj jedną kartę według jej treści i odpowiedniej sekcji planu. Uruchom testy, uzupełnij status w planie i README, zapisz commit z ID funkcji.
3. **Faza C · Najwyższy.** W osobnej sesji sprawdź kartę względem kryteriów, niezmienników, zakresu i zmian z commita. Zapisz dowody i werdykt PASS / WARNING / FAIL w `docs/weryfikacja/Fxx.md` i README. Poprawki prowadzi Faza B. Po najwyżej dwóch rundach weryfikacji karty właściciel rozstrzyga pozostałe ostrzeżenia. Weryfikację całego MVP odnotuj w `docs/weryfikacja/MVP.md` przed pilotażem i przed przejściem na prawdziwe dane.

**Zawartość repozytorium** — README, AGENTS, CLAUDE, prototyp `index.html`, `design.md`, ta specyfikacja, siedem kart i wcześniejsza specyfikacja funkcjonalna w PDF. Plan, kod MVP, środowiskowy przykład konfiguracji, dane startowe, testy i raporty dojdą w kolejnych fazach. Wyniki przyszłych prób z użytkownikami można zapisać w `docs/wnioski-z-testow-aplikacji.md`.
