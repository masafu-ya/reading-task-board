# Day 11: auth migration for existing learning_app database
param(
    [string]$MySqlExe = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$SqlFile = Join-Path $PSScriptRoot "migrate_day11_auth.sql"

if (-not (Test-Path $MySqlExe)) {
    Write-Host "MySQL client not found: $MySqlExe"
    Write-Host "Run manually: Get-Content migrate_day11_auth.sql | mysql -u root -p learning_app"
    exit 1
}

Write-Host "Applying Day 11 auth migration..."
Write-Host "Enter MySQL root password when prompted."

Get-Content $SqlFile -Raw | & $MySqlExe -u root -p learning_app
if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration failed. If user_id column already exists, that may be OK."
    exit $LASTEXITCODE
}

Write-Host "Migration completed."
