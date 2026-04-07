param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

# Temporarily set JAVA_HOME to JDK 23 for this PowerShell session
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Run the maven command with passed arguments
mvn @Args
