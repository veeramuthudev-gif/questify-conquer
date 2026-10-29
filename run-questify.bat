@echo off
setlocal
cd /d "%~dp0backend"

echo ===================================================
echo   QUESTIFY SPRING BOOT FULL STACK SERVER
echo ===================================================

set "PATH=%~dp0backend\.tools\apache-maven\bin;%PATH%"

echo [*] Launching Spring Boot...
"%~dp0backend\.tools\apache-maven\bin\mvn.cmd" spring-boot:run

pause
