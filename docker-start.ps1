# Docker Compose startup (Day 13)
# Usage: .\docker-start.ps1

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$BackendEnv = Join-Path $Root "backend\.env"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed or not in PATH. Install Docker Desktop first."
    exit 1
}

$localMysql = Get-Process mysqld -ErrorAction SilentlyContinue
if ($localMysql) {
    Write-Host "WARNING: Local MySQL is running (PID: $($localMysql.Id))."
    Write-Host "Docker uses host port 3307 for MySQL, so both can coexist."
    Write-Host "Stop local MySQL if you prefer: stop the mysqld process or use Services."
    Write-Host ""
}

if (-not (Test-Path $BackendEnv)) {
    Write-Host "backend\.env not found."
    Write-Host "Copy backend\.env.example to backend\.env and set DB_PASSWORD."
    exit 1
}

Write-Host "Loading backend\.env for Docker Compose..."
Get-Content $BackendEnv | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $eq = $line.IndexOf("=")
    if ($eq -lt 1) { return }
    $key = $line.Substring(0, $eq).Trim()
    $val = $line.Substring($eq + 1).Trim()
    Set-Item -Path "Env:$key" -Value $val
}

if (-not $env:DB_PASSWORD) {
    Write-Error "DB_PASSWORD is not set in backend\.env"
    exit 1
}

Set-Location $Root
Write-Host "Starting Docker Compose (build + up)..."
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend:  http://localhost:8000/docs"
Write-Host "Stop with Ctrl+C"
docker compose up --build
