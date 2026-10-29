@echo off
set "PATH=%~dp0.tools\apache-maven\bin;%PATH%"
"%~dp0.tools\apache-maven\bin\mvn.cmd" %*
