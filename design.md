# GroupDesk — design aplikacji

**Wersja dokumentu:** 1.0  
**Data eksportu:** 16 listopada 2026 r.  
**Projekt:** GroupDesk — demo CRM grup hotelowych  
**Demo:** https://groupdesk-demo-mw-2026.smart-2809.chatgpt.site  
**Źródło:** `dist/index.html`, opublikowana wersja projektu 4  
**Rewizja źródła:** `d6e2ca46cc869e8d69ccd782ca2262a99d7c31c6`

## 1. Cel dokumentu

Dokument opisuje aktualny wygląd i zachowanie mikroaplikacji na podstawie kodu projektu. W repozytorium nie było osobnego pliku `design.md`; ten plik stanowi wyodrębnioną dokumentację istniejącego interfejsu.

Nie jest pełną specyfikacją docelowego CRM. Funkcje planowane, takie jak Mews, Gmail, wspólna baza danych i rzeczywiste role użytkowników, nie są przedstawiane jako działające elementy demo.

## 2. Kierunek wizualny

- Narzędzie do codziennej pracy sprzedaży i recepcji, z naciskiem na czytelność danych i kolejnego działania.
- Jasne tło przestrzeni roboczej, białe panele i granatowa nawigacja.
- Kolor morski wyróżnia główne działania i wybrany wariant.
- Informacje finansowe mają wyraźną hierarchię i wyrównanie liczb.
- Kolorom stanów towarzyszą etykiety tekstowe.
- Nazwy ekranów, przycisków i komunikaty są po polsku.
- Interfejs nie wymaga pobierania zewnętrznych fontów, ilustracji ani bibliotek.

## 3. Kolory

### 3.1. Podstawowe tokeny CSS

| Token | Wartość | Zastosowanie |
|---|---|---|
| `--bg` | `#f3f5f8` | Tło aplikacji |
| `--paper` | `#ffffff` | Panele, formularze, górny pasek |
| `--ink` | `#1b2d40` | Tekst główny |
| `--muted` | `#5c6b7a` | Opisy pomocnicze, etykiety, metadane |
| `--line` | `#dce3ea` | Obramowania i separatory |
| `--brand` | `#17616c` | Akcje główne, aktywne zakładki, zaznaczenie wariantu |
| `--soft` | `#eaf4f3` | Neutralne komunikaty i etykiety stanu |
| `--nav` | `#172d3c` | Tło bocznej nawigacji |
| `--warn` | `#945115` | Tekst etykiety ostrzegawczej |
| `--warm` | `#fff2df` | Tło ostrzeżeń |
| `--red` | `#a63838` | Tekst akcji usuwania |

### 3.2. Kolory dodatkowe

| Element | Wartość |
|---|---|
| Aktywna pozycja nawigacji | `#2b4959` |
| Nawigacja po najechaniu | `#244251` |
| Tekst nawigacji | `#d5e0e6` |
| Akcent znaku GroupDesk | `#79cbc8` |
| Tło wybranego wariantu | `#f7fbfb` |
| Obramowanie pól formularza | `#cdd7e0` |
| Tło obowiązkowego pola grupy | `#edf5ff` |
| Obramowanie obowiązkowego pola | `#91aec9` |
| Gwiazdka pola obowiązkowego | `#28577f` |
| Obrys fokusu | `#83b9c2` |
| Przyciemnienie tła dialogu | `#15283d88` |

Obecna aplikacja ma jeden jasny motyw. Tryb ciemny nie jest zaimplementowany.

## 4. Typografia

Stos fontów: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Element | Rozmiar i właściwości |
|---|---|
| Tekst podstawowy | 14 px, interlinia 1.55 |
| Nagłówek strony `h1` | 27 px, interlinia 1.25, odstęp liter -0.7 px |
| Nagłówek sekcji `h2` | 18 px, odstęp liter -0.2 px |
| Nagłówek elementu `h3` | 15 px |
| Opis pomocniczy, etykieta, status | 12 px |
| Treść tabel | 13 px |
| Nagłówek tabeli | 12 px, grubość 500 |
| Wartość wskaźnika | 30 px, grubość 650 |
| Cena wariantu | 25 px, grubość 650 |
| Przyciski | Grubość 500 |

Kwoty są formatowane przez `Intl` dla `pl-PL`, jako PLN. Komórki liczbowe używają wyrównania do prawej i cyfr tabelarycznych (`tabular-nums`). Daty tekstowe mają format polski; wygląd natywnych pól daty i czasu zależy również od przeglądarki.

## 5. Układ aplikacji

### 5.1. Komputer

- Dwie kolumny: nawigacja 216 px oraz elastyczna część robocza.
- Panel nawigacji: znak GroupDesk, przyciski ekranów i informacja o trybie lokalnym.
- Górny pasek: stan zapisu, autor wpisów, eksport danych.
- Treść: maksymalna szerokość 1440 px, marginesy wewnętrzne 28 px pionowo i 30 px poziomo.
- Nagłówek ekranu: tytuł i opis po lewej, przyciski po prawej; elementy zawijają się przy braku miejsca.
- Stopka: informacja o lokalnym zapisie i ograniczeniach demonstracji.

### 5.2. Siatki i odstępy

| Element | Parametry |
|---|---|
| Wskaźniki pulpitu | 3 kolumny, odstęp 14 px |
| Układ podsumowania grupy | Proporcje 1.4 : 1, odstęp 18 px |
| Formularz | 2 kolumny, odstęp 15 px; wybrane pola na całą szerokość |
| Karty wariantów | Automatyczna liczba kolumn, minimalna szerokość 250 px, odstęp 14 px |
| Panel | Padding 20 px, odstęp dolny 18 px, promień 12 px |
| Grupa przycisków | Odstęp 8 px, zawijanie |
| Wiersz danych | Padding pionowy 13 px i dolny separator |

### 5.3. Responsywność

| Szerokość | Zachowanie |
|---|---|
| Powyżej 950 px | Pełny układ z boczną nawigacją |
| Do 950 px | Nawigacja 175 px; podsumowanie grupy przechodzi do jednej kolumny |
| Do 700 px | Nawigacja nad treścią; przyciski zawijane; formularze i siatki odczytu jednokolumnowe |
| Do 700 px | Wskaźniki w dwóch kolumnach, trzeci na pełną szerokość; pola edycyjne 16 px; przyciski co najmniej 44 px wysokości |
| Do 390 px | Wskaźniki i warianty w jednej kolumnie |

Tabele mogą przewijać się poziomo w obrębie kontenera. Dialog ma maksymalną wysokość 90vh i własne przewijanie.

## 6. Nawigacja i ekrany

| Ekran | Zawartość |
|---|---|
| Pulpit | Otwarte sprawy, zadania po terminie, wartość potwierdzonych rezerwacji, najbliższe działania, ostatnie sprawy |
| Grupy i zapytania | Wyszukiwanie, filtr etapu, lista grup z klientem, opiekunem, terminem, obiektem, wartością i saldem |
| Zadania i terminy | Zadania ręczne oraz działania wynikające z warunków, płatności i blokad |
| Recepcja | Ostatnie przekazane karty, filtr obiektu, zmiany i potwierdzenia przeczytania |
| Klienci | Sprawy pogrupowane według nazwy klienta |
| Dane i instrukcja | Eksport/import JSON, rozpoczęcie z pustą bazą, instrukcja i zakres demo |

Po wybraniu grupy otwiera się jej karta z zakładkami:

1. Podsumowanie.
2. Oferty.
3. Płatności.
4. Recepcja.
5. Zadania.
6. Historia.

Ekrany przełączają się wewnątrz pojedynczego dokumentu HTML. Nie mają osobnych adresów URL. Odświeżenie wraca do pulpitu, zachowując zapisane dane.

## 7. Komponenty

### 7.1. Przyciski

- Główny: morski, biały tekst; zapis i najważniejsze działanie.
- Standardowy: biały, obramowany; edycja, przejście do listy i druk.
- Usuwanie: tekst w kolorze czerwonym.
- Mały: 12 px i minimum 34 px wysokości na komputerze.
- Podstawowy: minimum 40 px wysokości; na małych ekranach minimum 44 px.
- Nieaktywny: krycie 50%, bez aktywnego kursora.

Etykiety opisują czynność, np. „Dodaj wariant”, „Podgląd”, „Przywróć”.

### 7.2. Statusy i komunikaty

- `.pill`: krótka etykieta stanu z tekstem.
- `.pill.warn`: wymagane działanie, termin lub oczekiwanie.
- `.notice`: informacja przy formularzu lub procesie.
- `.notice.warn`: konsekwencje wymagające uwagi użytkownika.
- `#flash`: komunikat nad aplikacją, `role="status"`, `aria-live="polite"`, z przyciskiem „OK”.
- Stan pusty: czytelny opis braku danych, zamiast pustego panelu.

### 7.3. Dialogi

- Natywny element `dialog`, otwierany przez `showModal()`.
- Standardowa szerokość maksymalna 690 px; podgląd oferty 960 px.
- Szerokość dostępna: szerokość okna minus 24 px.
- Promień 14 px, padding 24 px; na telefonie padding 18 px.
- Tytuł powiązany przez `aria-labelledby`; widoczne „Zamknij” i, w formularzach, „Anuluj”.

## 8. Formularz nowej grupy

Pola obowiązkowe mają jasnoniebieskie tło, niebieskoszare obramowanie i gwiazdkę przy etykiecie. Oznaczenie bazuje bezpośrednio na atrybucie `required`, więc pozostaje zgodne z wymagalnością pola.

Objaśnienie nad formularzem:

> Pola z niebieskim tłem i gwiazdką (*) są obowiązkowe. Pozostałe możesz uzupełnić później.

| Pole | Obowiązkowe |
|---|---|
| Nazwa grupy | Tak |
| Klient / organizator | Tak |
| Typ klienta | Nie; ma wartość domyślną |
| Osoba kontaktowa | Nie |
| Email | Nie |
| Telefon | Nie |
| Opiekun sprawy | Tak |
| Przyjazd | Tak |
| Wyjazd | Tak |
| Liczba osób | Tak |
| Liczba pokoi | Tak |
| Godzina przyjazdu | Tak |
| Godzina wyjazdu | Tak |
| Układ pokoi / uczestnicy | Nie |
| Posiłki i usługi | Nie |
| Uwagi organizacyjne | Nie |

To samo oznaczenie obowiązuje przy edycji grupy. Pola opcjonalne pozostają białe. Kolor nie znika po uzupełnieniu pola, ponieważ informuje o jego wymagalności, a nie błędzie.

Walidacja: wymagane wartości, poprawny format emailu, dodatnie całkowite liczby osób i pokoi, wyjazd później niż przyjazd. Część kontroli jest natywna, a część realizowana w JavaScript. Komunikaty walidacyjne nie mają obecnie indywidualnego układu błędów pod każdym polem.

## 9. Oferty i warianty

### 9.1. Karta wariantu

- Nazwa obiektu i opcjonalna etykieta „Wybrany”.
- Nazwa pozycji głównej oraz jednostka rozliczeniowa.
- Łączna kwota brutto.
- Rozbicie na pobyt, posiłki, dodatki i rabat.
- Źródło ceny.
- Działania: „Edytuj”, „Usuń” i, dla niewybranego wariantu, „Wybierz”.

Wybrany wariant ma obramowanie 2 px w kolorze marki oraz delikatne tło. Pozostałe mają obramowanie 1 px. Wyrównanie paddingu zapobiega zmianie wymiarów przy zaznaczeniu.

### 9.2. Usuwanie i przywracanie

- Usuwanie wymaga potwierdzenia w dialogu.
- Dla wybranego wariantu wymagany jest wybór zastępczego; początkowo brak wybranego zastępstwa.
- Przy istniejącej blokadzie, potwierdzeniu lub karcie recepcji pojawia się informacja o konieczności sprawdzenia ustaleń.
- Ostatni wariant nie może zostać usunięty; aplikacja wyjaśnia, że najpierw należy dodać nowy.
- Usunięte warianty są dostępne w rozwijanej sekcji „Usunięte warianty” z akcją „Przywróć”.
- Przywrócenie nie zmienia automatycznie wybranego wariantu.
- Operacje są rejestrowane w historii; zapisane oferty i karty recepcji zachowują wcześniejszą treść.

### 9.3. Zapisane wersje i podgląd

- Każda zapisana wersja ma numer, datę, autora, liczbę wariantów i termin pobytu.
- Obok znajdują się przyciski „Podgląd” i „Drukuj / zapisz PDF”.
- Podgląd pokazuje utrwaloną wersję, a nie aktualne wartości robocze.
- Zawiera warianty, pozycje, ilości, ceny, podsumowania, warunki i płatnika.
- Informacja nad dokumentem wyjaśnia, że późniejsze zmiany grupy nie zmieniają tej oferty.
- Podgląd i wydruk korzystają ze wspólnej funkcji `offerMarkup()`.
- Przycisk druku jest dostępny również wewnątrz podglądu; przed drukiem dialog jest zamykany.

## 10. Karta recepcji

- Przekazanie tworzy odrębną wersję ustaleń.
- Wersja zawiera obiekt, terminy, godziny, liczebność, układ pokoi, usługi, kontakt, uwagi i instrukcję płatnika.
- Różnice względem poprzedniej wersji są wyróżnione w komunikacie.
- Użytkownik potwierdza przeczytanie konkretnej wersji przyciskiem.
- Status wskazuje: oczekiwanie na potwierdzenie, przeczytanie lub przekazanie informacyjne.
- Starsze wymagane potwierdzenia pozostają widoczne jako zaległe.
- Bieżące rozliczenie jest prezentowane osobno od utrwalonej treści karty.

Widok recepcji jest demonstracją procesu. Pole „Autor wpisów” nie jest logowaniem ani rzeczywistym mechanizmem uprawnień.

## 11. Druk i PDF

- Format A4, marginesy 18 mm.
- Ukrywane są nawigacja, formularze, dialogi i stopka aplikacji.
- Drukowana jest wyłącznie zawartość `.print-only`.
- Tekst podstawowy: 12 px, tabele: 11 px, tytuł: 24 px.
- Dokument ma nagłówek z numerem wersji, nazwą i informacją o autorze.
- PDF powstaje przez systemowe okno drukowania przeglądarki i opcję zapisu PDF.
- Aplikacja nie generuje pliku PDF po stronie serwera.

## 12. Dostępność i interakcje

Istniejące rozwiązania:

- Natywne przyciski, pola, listy wyboru, tabele i dialogi.
- Etykiety powiązane z polami przez `for` i `id`.
- Widoczny fokus klawiatury.
- Oznaczenie obowiązkowych pól także gwiazdką i tekstowym objaśnieniem.
- Zakładki z `role="tab"`, `aria-selected` i powiązanym panelem.
- Etykieta aktualnej pozycji nawigacji `aria-current="page"`.
- Zawijanie treści i przewijanie tabel w ograniczonym kontenerze.

Ograniczenia: dokument nie deklaruje audytu zgodności WCAG. Obsługa strzałek dla zakładek nie jest zaimplementowana; interakcje są dostępne standardową sekwencją klawisza Tab. Nie wykonano pełnego audytu kontrastów i czytników ekranu.

## 13. Dane i stany aplikacji

- Pojedynczy plik HTML zawiera układ, CSS i JavaScript.
- Dane są przechowywane lokalnie pod kluczem `groupdesk-local-v1`.
- Eksport/import JSON służy przenoszeniu i odtwarzaniu danych.
- Stan zapisu jest prezentowany w górnym pasku.
- Gdy zapis jest niedostępny, aplikacja informuje o pracy w pamięci sesji.
- Zmiana danych w drugiej karcie przeglądarki wstrzymuje zapis bieżącej sesji i pokazuje konflikt.
- Zawartość HTML nie zawiera danych dopisanych przez użytkownika w przeglądarce.
- Aktualizacja hostowanej aplikacji korzysta z tego samego klucza danych i nie wymaga czyszczenia bazy.

## 14. Granice demonstracji

Obecny design obejmuje działający lokalnie prototyp. Nie obejmuje interfejsu rzeczywistej integracji Mews, skrzynki Gmail, automatycznego odczytu zapytań, importu XLS, wysyłki powiadomień, logowania ani wspólnej bazy zespołu.

Statusy „do kierownika” i pola autora przedstawiają proces pracy, ale nie są dowodem wysłania maila lub uwierzytelnienia osoby.

## 15. Zasady kolejnych zmian

1. Zachowywać aktualne kolory, rytm odstępów i polskie nazwy działań.
2. Wymagalność pól wiązać z rzeczywistą walidacją formularza.
3. Nie opierać istotnego stanu wyłącznie na kolorze.
4. Zachować niezależność wariantów roboczych, zapisanych ofert i przekazanych kart recepcji.
5. Umożliwiać odzyskanie usuniętych wariantów bez zmiany historycznych dokumentów.
6. Utrzymywać wspólny renderer podglądu i wydruku oferty.
7. Przy rozbudowie najpierw sprawdzać podstawową ścieżkę pracy na telefonie i komputerze.
8. Nowe integracje pokazywać jako działające dopiero po rzeczywistym wdrożeniu.
