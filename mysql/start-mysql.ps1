# MySQL 起動スクリプト（学習用・サービス未登録の場合）
# 使い方: PowerShell で .\mysql\start-mysql.ps1

$mysqlBin = "C:\Program Files\MySQL\MySQL Server 8.4\bin"
$config = "C:\ProgramData\MySQL\MySQL Server 8.4\my.ini"
$mysqld = Join-Path $mysqlBin "mysqld.exe"

if (-not (Test-Path $mysqld)) {
    Write-Error "MySQL が見つかりません。Oracle.MySQL をインストールしてください。"
    exit 1
}

$running = Get-Process mysqld -ErrorAction SilentlyContinue
if ($running) {
    Write-Host "MySQL はすでに起動しています (PID: $($running.Id))"
    exit 0
}

Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=`"$config`"" -WindowStyle Hidden
Start-Sleep -Seconds 4
Write-Host "MySQL を起動しました。ポート 3306"
Write-Host ('接続確認: "' + (Join-Path $mysqlBin "mysql.exe") + '" -u root -p')
