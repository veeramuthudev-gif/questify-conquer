@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo   QUESTIFY SPRING BOOT RUNNER
echo ===================================================

set "PATH=%~dp0.tools\apache-maven\bin;%PATH%"

echo [*] Launching Spring Boot with embedded Apache Maven...
"%~dp0.tools\apache-maven\bin\mvn.cmd" spring-boot:run

pause
