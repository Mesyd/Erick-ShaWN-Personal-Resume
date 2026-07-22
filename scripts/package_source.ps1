param(
  [string]$OutputDirectory = "outputs"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
$gitSafeDirectory = $projectRoot -replace "\\", "/"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archiveName = "Erick-ShaWN-Personal-Resume-source-$timestamp.zip"
$outputPath = Join-Path $projectRoot (Join-Path $OutputDirectory $archiveName)

New-Item -ItemType Directory -Path (Join-Path $projectRoot $OutputDirectory) -Force | Out-Null

git -c safe.directory=$gitSafeDirectory archive --format=zip -o $outputPath HEAD

if ($LASTEXITCODE -ne 0) {
  throw "git archive failed with exit code $LASTEXITCODE"
}

Write-Host "Created source archive:"
Write-Host $outputPath
