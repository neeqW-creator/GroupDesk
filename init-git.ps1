$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw "Zainstaluj Git for Windows i uruchom ponownie PowerShell." }
if (Test-Path .git) { Write-Host "Repozytorium Git juz istnieje."; exit 0 }
git init -b main
if ($LASTEXITCODE -ne 0) { throw "Nie udalo sie utworzyc repozytorium." }
git add .
if ($LASTEXITCODE -ne 0) { throw "Nie udalo sie dodac plikow." }
git commit -m "Initial GroupDesk CRM prototype"
if ($LASTEXITCODE -ne 0) { throw "Sprawdz konfiguracje Git user.name i user.email, nastepnie wykonaj git commit." }
