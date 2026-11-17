# GroupDesk CRM

Prototyp CRM do obsługi grup turystycznych w hotelach.

## Uruchomienie
Otwórz `index.html` w przeglądarce. Nie wymaga instalowania zależności ani kompilacji.
Dane zapisywane są lokalnie w przeglądarce. Integracje Gmail i Mews nie są podłączone.
Przeniesienie plików nie przenosi danych z demo. Aby je przenieść, wyeksportuj kopię JSON w dotychczasowej aplikacji i zaimportuj ją w nowej. Kopii danych klientów nie dodawaj do Git.

## Pliki
- `index.html` — aplikacja z podglądem ofert, usuwaniem wariantów i oznaczeniem wymaganych pól.
- `design.md` — opis wyglądu i komponentów.
- `docs/specyfikacja.md` — specyfikacja funkcjonalna.
- `docs/specyfikacja.pdf` — specyfikacja PDF.
- `init-git.ps1` — inicjalizacja repozytorium Git na Windows.

## Git i GitHub
W folderze projektu uruchom w PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\init-git.ps1
```

Następnie utwórz puste prywatne repozytorium GitHub i wykonaj (zastąp adres swoim):

```powershell
git remote add origin https://github.com/UZYTKOWNIK/GroupDesk.git
git push -u origin main
```

Skrypt wymaga zainstalowanego Git. Pierwszy commit wymaga skonfigurowanych `user.name` oraz `user.email`. Nie zawiera haseł ani kluczy API.
