@echo off
:: Temporarily set JAVA_HOME to JDK 23 for this project only
set JAVA_HOME=C:\Program Files\Java\jdk-23
set PATH=%JAVA_HOME%\bin;%PATH%

:: Run the maven command with passed arguments
mvn %*
