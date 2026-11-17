# GroupDesk — specyfikacja CRM do obsługi grup hotelowych

**Wersja:** 1.0  
**Data:** 13 listopada 2026 r.  
**Status:** specyfikacja funkcjonalna do wdrożenia MVP, oparta na ustaleniach z użytkownikiem i pierwszej makiecie  
**Nazwa produktu:** GroupDesk — nazwa robocza

## 1. Cel i sposób czytania dokumentu

System ma wspierać centralny zespół sprzedaży w obsłudze grup turystycznych dla kilku obiektów hotelowych. Ma porządkować zapytania, korespondencję, wyceny, rezerwacje, terminy, płatności oraz przekazanie ustaleń recepcji.

Najważniejsze problemy do rozwiązania:

- gubienie ustaleń między sprzedażą a recepcją;
- brak wspólnej kontroli nad pokojami, blokadami, terminami i zaliczkami;
- trudności w pilnowaniu odpowiedzi i ponownego kontaktu z klientem;
- wiele wariantów i kolejnych wersji ofert;
- rozproszona historia współpracy z powracającymi organizatorami.

Dokument rozróżnia trzy poziomy ustaleń:

| Oznaczenie | Znaczenie |
|---|---|
| Uzgodnione | Wymaganie wynikające z odpowiedzi użytkownika |
| Propozycja | Rozwiązanie projektowe rekomendowane do MVP, bez ostatecznego zatwierdzenia |
| Do weryfikacji | Zależność techniczna lub decyzja wymagająca sprawdzenia przed wdrożeniem |

Wymagania funkcjonalne w sekcjach 2–12 są uzgodnione, chyba że wyraźnie oznaczono je inaczej. Szczegółowy model danych, architektura, nazwy statusów i kryteria odbioru stanowią propozycję realizacji tych wymagań.

## 2. Kontekst biznesowy i granice systemu

### 2.1. Klienci

- Biura podróży i organizatorzy regularnie zamawiający grupy.
- Szkoły, uczelnie i kluby z pobytami cyklicznymi.
- Organizatorzy jednorazowych wyjazdów.

Klient jest odrębnym rekordem od pobytu. Jeden klient może mieć wiele kontaktów oraz wiele kolejnych spraw grupowych. Historia współpracy pozostaje dostępna przy kolejnym zapytaniu.

### 2.2. Podstawowa jednostka pracy

Jedna **sprawa grupowa** obejmuje jedno zapytanie dotyczące jednego planowanego pobytu. Sprawa może zawierać alternatywne obiekty, terminy, układy pokoi i usługi. Wybór wariantu określa podstawę rezerwacji.

**Propozycja zakresu MVP:** jeden wybrany wariant dotyczy jednego obiektu. Serie pobytów i rozdzielenie jednej grupy pomiędzy obiekty pozostają rozszerzeniem modelu, a nie obowiązkowym scenariuszem pierwszej wersji.

### 2.3. Systemy współpracujące

| System | Odpowiedzialność |
|---|---|
| Mews | Źródło dostępności pokoi i, w uzgodnionym zakresie, cen; miejsce ręcznego zakładania i zwalniania blokad |
| Gmail / Google Workspace | Wspólna skrzynka grupowa, wysyłka i odbiór korespondencji |
| CRM | Klienci, sprawy, oferty, warunki, ręcznie rejestrowane wpłaty, zadania, przekazanie recepcji i historia działań |
| Cenniki grupowe | Ceny zapisane w CRM lub importowane z plików; obecnie wykorzystywane są również pliki XLS |

Użytkownik potwierdził korzystanie z Mews we wszystkich obiektach oraz możliwość dostępu przez API. Szczegółowy zakres API, uprawnienia i mapowanie obiektów nie zostały jeszcze sprawdzone.

CRM nie ma w MVP samodzielnie tworzyć ani usuwać blokad w Mews. Wpłaty są wprowadzane ręcznie. Generowanie dokumentów księgowych nie zostało zamówione w ustalonym zakresie.

## 3. Role i dostęp

| Rola | Zakres danych | Główne działania |
|---|---|---|
| Sprzedaż | Wszystkie grupy i obiekty | Obsługa zapytań, oferty, korespondencja, warunki, wpłaty, zadania, przekazywanie kart |
| Recepcja | Grupy własnego obiektu i ich rozliczenia | Odczyt karty, potwierdzenie przeczytania i obsługa przydzielonych zadań |
| Kierownik | Grupy i zadania własnego obiektu | Nadzór nad obsługą i odbiór eskalacji |
| Właściciel / zarząd | Wszystkie obiekty i raporty | Nadzór nad sprzedażą, terminami i wynikami |

**Propozycje:**

- Logowanie kontem Google Workspace i przypisanie użytkownika do ról oraz obiektów.
- Osobne uprawnienie administracyjne do konfiguracji użytkowników, integracji i szablonów.
- Recepcja może oznaczać zadania jako wykonane i dopisywać uwagi operacyjne, ale nie zmienia cen ani warunków oferty. Szczegółowe prawo edycji recepcji wymaga zatwierdzenia.
- Dostęp do własnego obiektu obejmuje także filtry, eksporty, załączniki i powiadomienia, a nie tylko widoki ekranowe.

## 4. Przebieg obsługi grupy

1. Wiadomość trafia na wspólną skrzynkę grupową.
2. System proponuje nową sprawę i dane odczytane z maila.
3. Pracownik sprawdza dane, poprawia nieścisłości i zatwierdza zapytanie.
4. Do sprawy przypisywany jest opiekun odpowiedzialny za dalsze działania.
5. Handlowiec sprawdza dostępność wszystkich obiektów dla wskazanego terminu.
6. Przygotowuje warianty i wysyła ofertę.
7. Kolejne negocjacje tworzą nowe wersje oferty, z zachowaniem poprzednich.
8. Klient wybiera wariant; handlowiec ustala warunki wstępnego potwierdzenia.
9. Pracownik ręcznie zakłada blokadę w Mews i odnotowuje to w CRM.
10. Handlowiec potwierdza rezerwację według warunków przyjętych dla klienta.
11. Pracownicy rejestrują wpłaty i uzupełniają dane organizacyjne.
12. Handlowiec zatwierdza i przekazuje kartę grupy recepcji właściwego obiektu.
13. Recepcja potwierdza przeczytanie przekazanej wersji.
14. Przy kolejnych zmianach handlowiec decyduje o konieczności ponownego potwierdzenia.
15. Po pobycie pracownik uzupełnia rozliczenie i zamyka sprawę.

### 4.1. Niezależne statusy — propozycja

Jeden status nie powinien łączyć sprzedaży, płatności i przygotowania pobytu.

| Wymiar | Proponowane wartości |
|---|---|
| Sprzedaż | Nowe, W obsłudze, Oferta wysłana, Negocjacje, Potwierdzenie wstępne, Potwierdzona, Zrealizowana, Przegrana, Anulowana |
| Blokada | Nie założono, Założona ręcznie, Termin minął — wymaga sprawdzenia, Zwolniona, Zastąpiona rezerwacją |
| Płatności | Brak wpłat, Częściowo opłacona, Opłacona, Nadpłata / do wyjaśnienia |
| Termin płatności | Przed terminem, Termin dzisiaj, Po terminie |
| Karta recepcji | Robocza, Przekazana — oczekuje potwierdzenia, Przeczytana, Zmieniona roboczo, Aktualizacja informacyjna |

Zaliczka nie potwierdza automatycznie rezerwacji. Brak zaliczki nie wyklucza potwierdzonej rezerwacji, jeżeli handlowiec zaakceptował inne warunki. System zapisuje podstawę i autora decyzji.

## 5. Zapytania, klienci i korespondencja

### 5.1. Rejestracja zapytania

System proponuje co najmniej: klienta, osobę kontaktową, termin, liczbę osób, podział na uczestników i opiekunów, preferencje pokoi, posiłki, usługi oraz uwagi.

**Propozycje szczegółowe:**

- Pola nieobecne w mailu pozostają nieuzupełnione; system nie dopowiada danych.
- Przy danych niejednoznacznych pracownik widzi oznaczenie „do sprawdzenia” i treść źródłową.
- Nowy kontakt może zostać powiązany z istniejącym klientem po weryfikacji.
- Ponowne przetworzenie tej samej wiadomości nie tworzy drugiej sprawy.
- Odpowiedź w istniejącym wątku jest proponowana do przypisania do tej samej sprawy.
- Pracownik może poprawić błędne powiązanie maila lub oznaczyć wiadomość jako niezwiązaną z obsługą grup.

### 5.2. Obsługa wspólnej skrzynki

- Jedna wspólna skrzynka grupowa dla zespołu.
- Przypisany opiekun każdej sprawy.
- Wysyłanie maili z CRM i przypisywanie odpowiedzi do sprawy.
- Generowanie treści do skopiowania do maila oraz oferty PDF.
- Historia wiadomości i załączników przy sprawie.

**Propozycja:** wysłanie wiadomości wymaga działania pracownika. Automatyzacja rozpoznawania zapytań nie oznacza samodzielnego wysyłania ofert przez system.

## 6. Dostępność i blokady w Mews

### 6.1. Widok dostępności

Dla zadanego przyjazdu i wyjazdu CRM prezentuje wszystkie obiekty i kategorie pokoi. Dane służą przygotowaniu oferty; samo zapytanie ani wysłana oferta nie blokują pokoi.

**Proponowane informacje:** liczba wolnych pokoi na poszczególne noce, dostępność na cały pobyt, czas ostatniego odczytu oraz informacja o braku lub nieaktualności danych.

Nie wolno sumować wolnych pokoi z różnych nocy tak, jakby były dostępne przez cały pobyt. Możliwość utrzymania dokładnego układu pokoi wymaga uwzględnienia danych i reguł udostępnionych przez Mews.

Ocena, czy grupa się mieści, powinna uwzględniać kategorie i układ pokoi, a nie tylko łączną liczbę miejsc. Automatyczne proponowanie optymalnego układu jest opcjonalnym rozszerzeniem.

### 6.2. Rejestr ręcznej blokady

**Proponowane pola:** obiekt, termin, pokoje według kategorii, numer lub identyfikator referencyjny Mews, data założenia, autor, termin wygaśnięcia i status sprawdzenia.

Reguły:

- Pracownik potwierdza, że rzeczywiście założył blokadę w Mews.
- CRM pilnuje terminu, ale nie traktuje jego upływu jako dowodu zwolnienia pokoi.
- Po upływie terminu powstaje zadanie sprawdzenia i ewentualnego zwolnienia blokady w Mews.
- Pracownik odnotowuje wynik działania.
- Zmiana obiektu lub terminu po założeniu blokady wymaga ponownej weryfikacji blokady i dostępności.

## 7. Oferty, kalkulacje i cenniki

### 7.1. Warianty i wersje

**Wariant** oznacza alternatywny obiekt, termin, układ pokoi lub zestaw usług. **Wersja** oznacza kolejną edycję oferty podczas negocjacji.

Jedna sprawa może mieć wiele wersji, a jedna wersja wiele wariantów. Handlowiec oznacza wybrany wariant i jego wersję jako podstawę rezerwacji. Wcześniejsze oferty pozostają w historii.

### 7.2. Elastyczna kalkulacja

Wycena może być za osobę, pokój, noc, usługę lub pakiet. Ceny i sposób liczenia zależą od grupy oraz obiektu.

**Proponowane pola pozycji oferty:**

| Pole | Znaczenie |
|---|---|
| Nazwa | Nocleg, śniadanie, obiadokolacja, parking lub inna usługa |
| Jednostka | Osoba/noc, pokój/noc, osoba/posiłek, pobyt, sztuka, pakiet |
| Ilość | Liczba jednostek rozliczeniowych |
| Cena jednostkowa | Kwota zgodna z określonym sposobem prezentowania podatków |
| Rabat / gratis | Jawna korekta oraz opcjonalne uzasadnienie |
| Źródło ceny | Cennik CRM, import, Mews lub cena ręczna |
| Wartość | Wynik kalkulacji danej pozycji |

**Do ustalenia:** waluty, zasady netto/brutto, VAT, zaokrąglenia, gratisy dla opiekunów oraz uprawnienia do rabatów. Wartości brutto z makiety nie stanowią zatwierdzonej polityki cenowej.

### 7.3. Źródła cen

- Cenniki grupowe utrzymywane w CRM.
- Import cenników, z mapowaniem kolumn i podglądem przed zatwierdzeniem.
- Ceny pobierane z Mews, z możliwością zmiany przez handlowca.

**Propozycja:** cena ma zapisane źródło, datę pobrania i historię ręcznej korekty. Aktualizacja cennika lub odczytu z Mews nie zmienia automatycznie wysłanych ofert ani zaakceptowanej ceny rezerwacji.

Nie ustalono pierwszeństwa źródeł cen. Handlowiec powinien móc świadomie wybrać podstawę kalkulacji.

### 7.4. Wyniki przygotowania oferty

- PDF do załączenia do wiadomości.
- Treść maila do skopiowania.
- Wysyłka z CRM przez ustaloną skrzynkę Gmail.
- Zapis użytej wersji, wariantów, załącznika, odbiorców i czasu wysłania.

**Propozycja:** PDF zawiera identyfikator oferty, datę i ważność, opis wariantów, ceny, zakres usług, warunki płatności i anulacji oraz dane kontaktowe opiekuna.

## 8. Warunki rezerwacji i rozliczenia

Dla każdej grupy ustala się osobno:

- ważność oferty;
- termin wygaśnięcia blokady;
- zaliczkę kwotową lub procentową oraz termin wpłaty;
- termin dopłaty;
- warunki anulacji i bezkosztowej zmiany liczby osób;
- termin podania ostatecznej liczby osób;
- termin dostarczenia listy uczestników.

Wpłaty i rozliczenie wprowadza pracownik. **Proponowane dane wpłaty:** kwota, waluta, data, płatnik, metoda, referencja i autor wpisu. Korekta pozostawia ślad poprzedniego wpisu.

System wyświetla wartość rezerwacji, wpłaty, saldo oraz terminy. Nie sumuje różnych walut bez ustalonej reguły przeliczenia. Nadpłata nie jest ukrywana przez sprowadzenie salda do zera.

Karta opisuje, kto płaci za noclegi i usługi oraz czy uczestnicy mają dopłacać na recepcji. Dokładny model wielu płatników i zwrotów wymaga doprecyzowania przed implementacją rozliczeń.

## 9. Karta grupy i przekazanie recepcji

### 9.1. Zakres karty

- Nazwa grupy, klient i opiekun sprawy.
- Obiekt, daty oraz godziny przyjazdu i wyjazdu.
- Liczba uczestników i opiekunów.
- Podział pokoi według kategorii; lista uczestników i przypisania, jeśli dostępne.
- Dane kontaktowe opiekuna grupy.
- Posiłki, liczby porcji, godziny i dodatkowe usługi.
- Ceny, wpłaty, saldo oraz instrukcje dotyczące płatników.
- Uwagi organizacyjne, specjalne życzenia i zadania.
- Numer wersji, autor oraz czas przekazania.

### 9.2. Przekazanie i potwierdzenie

Handlowiec zatwierdza i przekazuje gotową kartę. Recepcja potwierdza przeczytanie. Kolejne zmiany mogą być zapisywane roboczo przed ponownym przekazaniem.

Przy aktualizacji handlowiec każdorazowo decyduje, czy recepcja musi ponownie potwierdzić przeczytanie. System pokazuje różnice względem poprzedniej przekazanej wersji.

**Proponowany mechanizm wersjonowania:**

- Przekazana karta jest utrwalonym zapisem ustaleń organizacyjnych.
- Potwierdzenie zawiera użytkownika, czas i numer przeczytanej wersji.
- Wersja wymagająca ponownego potwierdzenia pozostaje oczekująca do wykonania działania przez recepcję.
- Aktualizacja informacyjna nie tworzy fałszywego potwierdzenia przeczytania nowej wersji.
- Samo otwarcie ekranu nie zastępuje świadomego przycisku potwierdzenia.
- Recepcja ma widoczny dostęp do najnowszej przekazanej wersji i zaległych obowiązków potwierdzenia.
- Bieżące saldo może być pokazywane obok karty jako osobny, wyraźnie oznaczony stan rozliczenia; historyczna karta zachowuje wcześniejsze ustalenia.

**Do decyzji:** czy wystarczy jedno potwierdzenie dowolnego uprawnionego recepcjonisty, czy wymagane jest potwierdzenie przez wyznaczoną osobę albo zmianę.

**Propozycja z makiety:** przed pierwszym przekazaniem karty wymagane jest odnotowanie blokady w Mews. To nie jest jeszcze zatwierdzona reguła biznesowa i musi dopuszczać uzgodnione wyjątki, jeżeli obiekt ich potrzebuje.

## 10. Zadania, powiadomienia i eskalacje

System pilnuje:

- ponownego kontaktu z klientem;
- końca ważności oferty;
- terminu blokady pokoi;
- zaliczki i dopłaty;
- ostatecznej liczby osób i listy uczestników;
- przekazania karty recepcji.

Kanały: lista zadań i powiadomienia w CRM, pilne zdarzenia dodatkowo mailem, przekroczenia terminów również do kierownika.

**Proponowany model zadania:** typ, sprawa, obiekt, odpowiedzialny użytkownik, termin, priorytet, status, wykonanie, odbiorca eskalacji i historia powiadomień.

**Do konfiguracji:** definicja pilnego zdarzenia, wyprzedzenie przypomnienia, godziny wysyłki, czas opóźnienia eskalacji oraz sposób obsługi nieobecności opiekuna.

Powiadomienia powinny być odporne na duplikaty. Zmiana terminu, anulowanie pobytu lub wykonanie zadania musi aktualizować zaplanowane przypomnienia. Informacja o problemie z wysyłką pozostaje widoczna w CRM.

## 11. Ekrany docelowego MVP

| Ekran | Zawartość i główne działania |
|---|---|
| Pulpit | Zapytania do zatwierdzenia, zadania dzisiejsze i zaległe, blokady, wpłaty, przyjazdy i sprawy oczekujące na reakcję |
| Zapytania / sprzedaż | Wspólna kolejka, opiekun, etap, klient, termin pobytu, kolejne działanie i filtrowanie |
| Nowe zapytanie | Mail źródłowy obok proponowanych danych; korekta, powiązanie z klientem i zatwierdzenie |
| Dostępność | Wszystkie obiekty i kategorie pokoi dla terminu; źródło, czas odczytu i przejście do oferty |
| Karta grupy | Podsumowanie, oferty, korespondencja, pokoje i uczestnicy, organizacja, płatności, zadania i historia |
| Oferta | Pozycje, warianty, kolejne wersje, źródła cen, warunki, PDF i mail |
| Recepcja | Przyjazdy własnego obiektu, przekazane karty, różnice, potwierdzenia, zadania i rozliczenia |
| Klienci | Dane organizatora, kontakty, historia zapytań, ofert i pobytów |
| Raporty | Widok wyników według obiektu, okresu i opiekuna |
| Ustawienia | Role, obiekty, cenniki, szablony, terminy i konfiguracja integracji — proponowany ekran administracyjny |

Interfejs powinien umożliwiać pracę na komputerze i telefonie. Wszystkie listy, karty i powiadomienia muszą respektować zakres roli.

## 12. Raportowanie

Uzgodniono dostęp zarządu do raportów sprzedaży. **Proponowany zakres początkowy:**

- liczba zapytań, wysłanych ofert i potwierdzonych rezerwacji;
- konwersja zapytań na rezerwacje;
- wartość potwierdzonych rezerwacji według obiektu i opiekuna;
- wartość zarejestrowanych wpłat i salda;
- zadania po terminie i niepotwierdzone karty recepcji;
- historia i powtarzalność zamówień klienta;
- powody przegranych spraw.

Raporty nie sumują alternatywnych wariantów jako odrębnych rezerwacji. Należy oddzielić datę wpłynięcia zapytania, potwierdzenia rezerwacji i realizacji pobytu. Wartość oferty, rezerwacji i wpływów pieniężnych to różne miary.

Definicje wskaźników, waluty raportowe i szczegółowe filtry wymagają zatwierdzenia.

## 13. Proponowany model danych

| Encja | Najważniejsze dane i relacje |
|---|---|
| Obiekt | Nazwa, identyfikator Mews, konfiguracja i przypisany kierownik |
| Kategoria pokoju | Obiekt, identyfikator Mews, pojemność i mapowanie do cenników |
| Użytkownik / przypisanie roli | Tożsamość logowania, role, obiekty, aktywność |
| Klient | Organizator, typ, dane kontaktowe i rozliczeniowe |
| Osoba kontaktowa | Klient, imię i nazwisko, email, telefon, funkcja |
| Sprawa grupowa | Klient, kontakt, opiekun, nazwa grupy, status, wybrany wariant i terminy |
| Oferta / wersja | Sprawa, numer wersji, ważność, treść warunków, stan i czas wysłania |
| Wariant oferty | Wersja, obiekt, daty, liczebność, układ pokoi i kalkulacja |
| Pozycja oferty | Wariant, jednostka, ilość, cena, rabat, źródło i wartość |
| Cennik / pozycja cennika | Obiekt, okres, kategoria, jednostka, cena i historia importu |
| Wycena zewnętrzna | Odczyt z Mews, czas, parametry i cena użyta do kalkulacji |
| Odczyt dostępności | Obiekt, termin, kategorie, wartości i czas pobrania |
| Blokada | Sprawa, obiekt, referencja Mews, termin, zakres i status ręcznej obsługi |
| Warunki płatności / rata | Kwota lub procent, podstawa, termin i warunki obowiązujące dla rezerwacji |
| Wpłata / korekta | Sprawa, płatnik, kwota, waluta, data, referencja i autor |
| Uczestnik / przydział pokoju | Sprawa, niezbędne dane uczestnika, kategoria lub pokój, jeśli ustalone |
| Usługa organizacyjna | Rodzaj, termin, liczba osób, godzina i uwagi |
| Wersja karty recepcji | Sprawa, obiekt, numer, utrwalona treść, różnice, autor i wymóg potwierdzenia |
| Potwierdzenie przeczytania | Konkretna wersja karty, użytkownik i czas |
| Wiadomość / załącznik | Skrzynka, identyfikator wiadomości i wątku, sprawa, kierunek, treść i metadane |
| Zadanie / powiadomienie | Sprawa, właściciel, termin, status, odbiorca eskalacji i wynik wysyłki |
| Zdarzenie historii | Autor, czas, obiekt zmiany, działanie, wartości poprzednie i nowe |

Relacje podstawowe: klient ma wiele spraw; sprawa ma wiele wersji ofert; wersja ma wiele wariantów; sprawa wskazuje jeden wybrany wariant. Wersje karty recepcji i ich potwierdzenia są niezależne od wersji ofert.

## 14. Proponowana architektura

Nie wybrano jeszcze technologii ani miejsca wdrożenia. Dotychczasowa makieta nie stanowi decyzji o stosie technologicznym.

Rekomendowany podział odpowiedzialności:

1. **Aplikacja webowa:** pulpit, karta grupy, kalkulacje, recepcja i ustawienia.
2. **Backend:** reguły biznesowe, kontrola dostępu, wersjonowanie i integracje.
3. **Relacyjna baza danych:** klienci, sprawy, oferty, zadania i potwierdzenia.
4. **Magazyn plików:** PDF, załączniki i importy, z kontrolą dostępu.
5. **Procesy w tle:** odbiór maili, odczyty Mews, przypomnienia i ponawianie nieudanych operacji.
6. **Moduł rozpoznawania wiadomości:** proponowanie danych, bez samodzielnego potwierdzania rezerwacji.

Wybór pomiędzy rozwiązaniem w ekosystemie Google a osobną aplikacją wymaga ustalenia liczby użytkowników, wolumenu korespondencji, wymagań utrzymaniowych i budżetu. Wcześniejsze projekty Apps Script nie przesądzają technologii tego CRM.

## 15. Integracje — zakres do sprawdzenia

### 15.1. Mews

Do potwierdzenia w dokumentacji i środowisku testowym:

- właściwy produkt API i uprawnienia dla wszystkich obiektów;
- dostępność kategorii pokoi dla każdej nocy i zakres informacji o blokadach;
- definicja dostępności, ograniczenia sprzedaży i mapowanie kategorii;
- dane cenowe i plany taryfowe, podatki, waluty oraz ograniczenia pobytów;
- limity wywołań i sposób odświeżania;
- dostęp do środowiska testowego i mapowanie identyfikatorów obiektów.

Integracja w MVP jest odczytowa. Dokument nie zakłada istnienia konkretnego endpointu ani nie potwierdza, że każda oczekiwana dana jest dostępna w obecnych uprawnieniach.

### 15.2. Gmail / Google Workspace

Do potwierdzenia:

- adres i forma wspólnej skrzynki: konto, alias, delegacja lub inne rozwiązanie;
- uprawnienia aplikacji do odczytu i wysyłki;
- zakres pobieranej historii i obsługa załączników;
- sposób pobierania nowych wiadomości i przypisywania odpowiedzi;
- tożsamość nadawcy, podpis oraz obsługa błędów i niejednoznacznego wyniku wysyłki.

Ponowienie operacji po awarii nie może powodować niekontrolowanego wysłania drugiej oferty. System powinien odróżniać szkic, wiadomość w kolejce, wysłaną oraz wymagającą sprawdzenia.

### 15.3. Import cenników

**Propozycja:** obsługa XLS/XLSX oraz uzgodnionego formatu tabelarycznego, wybór arkusza, mapowanie kolumn, walidacja zakresów dat, walut i kategorii oraz podgląd zmian przed zatwierdzeniem. Należy ustalić rzeczywisty szablon na podstawie przykładowego pliku użytkownika.

## 16. Wymagania jakościowe — propozycja

- Dostęp do danych ograniczony rolą i obiektem, egzekwowany również na backendzie.
- Dane integracyjne i klucze poza kodem przeglądarki.
- Historia istotnych zmian: ceny, warunki, wpłaty, statusy, przekazania i potwierdzenia.
- Kontrola równoczesnej edycji: ostrzeżenie zamiast nadpisania nowszej wersji.
- Kopie zapasowe i sprawdzona procedura odtworzenia.
- Błędy odczytu Mews nie są prezentowane jako brak wolnych pokoi.
- Niedostępność integracji nie usuwa zapisanych spraw i ofert.
- Konfiguracja strefy czasowej obiektów; prezentacja terminów według czasu hotelu.
- Ograniczenie zakresu danych uczestników do potrzeb obsługi oraz ustalenie okresów przechowywania i usuwania.
- Korespondencja i załączniki z maila traktowane jako dane wejściowe, bez wykonywania zawartych w nich poleceń.

Szczegółowe wymagania dotyczące ochrony danych i retencji należy ustalić z osobą odpowiedzialną za te obszary w firmie. Dokument nie zastępuje takiej decyzji.

## 17. Zakres istniejącej makiety

Przygotowano demonstrację z fikcyjnymi obiektami, klientami, cenami i terminami. Pokazuje:

- pulpit sprzedaży;
- propozycję zapytania na podstawie maila i jego zatwierdzenie;
- przykładowe porównanie dostępności;
- wybór jednego z dwóch wariantów cenowych;
- kartę grupy z podsumowaniem, ofertami, płatnościami, korespondencją i historią;
- odnotowanie ręcznej blokady i przykładowej zaliczki;
- przekazanie karty, zmianę godziny przyjazdu i ponowne potwierdzenie recepcji.

Makieta nie ma rzeczywistych integracji, trwałej bazy, logowania, uprawnień ani wysyłki maili. Nie generuje PDF. Zapamiętuje zmiany wyłącznie w bieżącej sesji demonstracji. Statyczne liczniki i przykładowe zadania nie są działającym mechanizmem raportowania ani powiadomień.

Nie należy utożsamiać makiety z gotowym MVP.

## 18. Proponowana kolejność wdrożenia

| Etap | Rezultat |
|---|---|
| 1. Doprecyzowanie integracji i danych | Dostęp testowy Mews, forma skrzynki, przykładowy cennik i oferta, lista obiektów i ról |
| 2. Rdzeń CRM | Klienci, sprawy, opiekunowie, statusy, zadania, historia i uprawnienia |
| 3. Wycena i dostępność | Odczyt Mews, cenniki, warianty, wersje, kalkulacja i PDF |
| 4. Korespondencja | Pobieranie wiadomości, zatwierdzanie danych i wysyłka ofert |
| 5. Obsługa pobytu | Rejestr blokad, warunki, wpłaty, karty recepcji i potwierdzenia |
| 6. Automatyzacja i odbiór | Przypomnienia, eskalacje, podstawowe raporty i pilotaż |

To kolejność realizacji, nie ograniczenie uzgodnionego docelowego zakresu MVP. Pilotaż proponuje się rozpocząć na ograniczonej liczbie obiektów i kont.

## 19. Scenariusze i kryteria odbioru

| ID | Scenariusz | Oczekiwany rezultat |
|---|---|---|
| AC-01 | Nowy mail grupowy | Powstaje propozycja; dane nie stają się potwierdzoną rezerwacją bez działania pracownika |
| AC-02 | Ponowne przetworzenie wiadomości | Brak drugiej sprawy i zdublowanych wiadomości |
| AC-03 | Jeden termin, wiele obiektów | Dostępność kategorii pokazana dla całego pobytu, ze źródłem i czasem odczytu |
| AC-04 | Awaria odczytu Mews | Widoczny błąd lub nieaktualność; brak fałszywej informacji o zerowej dostępności |
| AC-05 | Oferta z dwiema alternatywami | Warianty pozostają w jednej sprawie; wybranie jednego nie usuwa drugiego z historii |
| AC-06 | Korekta ceny i nowa wersja | Poprzednia wysłana oferta i jej PDF pozostają niezmienione |
| AC-07 | Oferta PDF i email | Treść, kwoty i warunki odpowiadają wybranej wersji; historia pokazuje wynik wysyłki |
| AC-08 | Ręczna blokada | CRM zapisuje fakt odnotowania i termin, nie tworząc blokady w Mews |
| AC-09 | Upływ blokady | Powstaje zadanie sprawdzenia; CRM nie twierdzi automatycznie, że pokoje zwolniono |
| AC-10 | Potwierdzenie bez zaliczki | Możliwe zgodnie z warunkami klienta; autor i podstawa decyzji są zapisane |
| AC-11 | Zaliczka lub korekta wpłaty | Saldo i terminy są poprawne, historia zachowana, bez automatycznego zmieniania etapu sprzedaży |
| AC-12 | Pierwsze przekazanie karty | Recepcja właściwego obiektu widzi wersję i może potwierdzić jej przeczytanie |
| AC-13 | Zmiana wymagająca potwierdzenia | Recepcja widzi różnice; poprzednie potwierdzenie nie zastępuje nowego |
| AC-14 | Zmiana informacyjna | Wersja jest dostępna, ale system nie dopisuje nieistniejącego potwierdzenia użytkownika |
| AC-15 | Zaległe zadanie | Opiekun widzi zaległość; zgodnie z konfiguracją wysyłany jest mail i eskalacja do kierownika |
| AC-16 | Ograniczenie do obiektu | Recepcja nie otrzymuje danych innego obiektu przez ekran, eksport ani bezpośrednie odwołanie |
| AC-17 | Raport sprzedaży | Wartość alternatywnych ofert nie jest sumowana jako kilka sprzedanych pobytów |
| AC-18 | Równoczesna edycja | Drugi zapis nie nadpisuje bez ostrzeżenia nowszych ustaleń |

Główny scenariusz pilotażowy: zapytanie szkoły o 40 osób na dwie noce → dwa obiekty → oferta v1 → dodanie obiadokolacji i oferta v2 → wybór wariantu → ręczna blokada Mews → zaliczka → karta v1 → potwierdzenie recepcji → zmiana przyjazdu → karta v2 → ponowne potwierdzenie → rozliczenie.

## 20. Decyzje pozostałe przed implementacją

1. Rzeczywiste nazwy i liczba obiektów, kategorie pokoi oraz identyfikatory Mews.
2. Liczba użytkowników, przypisania ról i zasady zastępstw.
3. Dokładny zakres dostępu API Mews i sposób pobierania cen.
4. Adres i forma wspólnej skrzynki Gmail oraz zakres importu historii.
5. Waluty, netto/brutto, VAT, gratisy i dopuszczalne rabaty.
6. Wzór cennika oraz szablon PDF i maila, języki ofert.
7. Konfiguracja domyślnych warunków rezerwacji i przypomnień.
8. Szczegółowe prawa recepcji i reguła potwierdzania zmian na zmianach roboczych.
9. Zasady korekt, zwrotów, wielu płatników oraz oznaczania końcowego rozliczenia.
10. Hosting, technologia, budżet utrzymania i obsługa awarii.
11. Retencja danych uczestników, wiadomości i załączników.
12. Zakres pilotażu oraz osoby odpowiedzialne za odbiór.

## 21. Elementy poza ustalonym zakresem MVP

Bez odrębnej decyzji nie obejmuje się wdrożeniem: automatycznego zapisu lub zwalniania blokad w Mews, automatycznego uzgadniania wpłat z bankiem, wystawiania faktur, portalu klienta, samodzielnego potwierdzania rezerwacji przez AI, zarządzania seriami pobytów oraz optymalizatora podziału grupy między obiekty.

## 22. Podstawa opracowania

Specyfikację sporządzono na podstawie ustaleń w rozmowie i przygotowanej makiety GroupDesk. Nazwy klientów, obiektów, kwoty, daty i warunki użyte w demonstracji są fikcyjnymi przykładami. Dokument nie potwierdza technicznych możliwości konkretnych endpointów Mews ani aktualnej konfiguracji Google Workspace; wymagają one osobnej weryfikacji przed integracją.
