# Backend API startup (Day 5+)
# Usage: .\backend\start.ps1

$root = Split-Path $PSScriptRoot -Parent
$mysqlScript = Join-Path $root "mysql\start-mysql.ps1"

Write-Host "=== Step 1: Start MySQL ==="
powershell -NoProfile -ExecutionPolicy Bypass -File $mysqlScript

Write-Host ""
Write-Host "=== Step 2: Start FastAPI (port 8000) ==="
Set-Location $PSScriptRoot

if (-not (Test-Path ".\venv\Scripts\python.exe")) {
    Write-Host "Creating venv..."
    python -m venv venv
}

Write-Host "Installing dependencies..."
.\venv\Scripts\python.exe -m pip install -r requirements.txt -q

if (-not (Test-Path ".\.env")) {
    Write-Host "WARNING: backend\.env not found."
    Write-Host "Copy .env.example to .env and set DB_PASSWORD."
    exit 1
}

Write-Host "Starting uvicorn..."
Write-Host "Stop with Ctrl+C"
.\venv\Scripts\uvicorn.exe main:app --reload --port 8000
