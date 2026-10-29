# Questify Spring Boot PowerShell Runner
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  QUESTIFY SPRING BOOT RUNNER                      " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$mvnCommand = Get-Command mvn -ErrorAction SilentlyContinue

if ($mvnCommand) {
    Write-Host "[OK] Maven found in PATH." -ForegroundColor Green
    mvn spring-boot:run
    exit
}

$localMaven = Join-Path $PSScriptRoot ".tools\apache-maven\bin\mvn.cmd"
if (Test-Path $localMaven) {
    Write-Host "[OK] Using portable Maven from .tools\apache-maven" -ForegroundColor Green
    $env:PATH = "$PSScriptRoot\.tools\apache-maven\bin;" + $env:PATH
    mvn spring-boot:run
    exit
}

Write-Host "[!] 'mvn' is not installed in system PATH." -ForegroundColor Yellow
Write-Host "[*] Downloading portable Apache Maven (one-time setup)..." -ForegroundColor Yellow

$toolsDir = Join-Path $PSScriptRoot ".tools"
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

$zipPath = Join-Path $toolsDir "maven.zip"
$url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"

Write-Host "Downloading Maven from Apache..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $url -OutFile $zipPath

Write-Host "Extracting Maven..." -ForegroundColor Cyan
Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force

$extractedDir = Join-Path $toolsDir "apache-maven-3.9.6"
$targetDir = Join-Path $toolsDir "apache-maven"
if (Test-Path $targetDir) { Remove-Item $targetDir -Recurse -Force }
Rename-Item -Path $extractedDir -NewName "apache-maven"
Remove-Item $zipPath -Force

Write-Host "[OK] Maven setup complete!" -ForegroundColor Green
$env:PATH = "$PSScriptRoot\.tools\apache-maven\bin;" + $env:PATH
mvn spring-boot:run
