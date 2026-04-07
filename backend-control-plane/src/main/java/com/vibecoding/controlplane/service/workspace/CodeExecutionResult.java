package com.vibecoding.controlplane.service.workspace;

public class CodeExecutionResult {
    private String stdout;
    private String stderr;
    private int exitCode;
    private String errorMessage;

    public CodeExecutionResult(String stdout, String stderr, int exitCode, String errorMessage) {
        this.stdout = stdout;
        this.stderr = stderr;
        this.exitCode = exitCode;
        this.errorMessage = errorMessage;
    }

    public String getStdout() {
        return stdout;
    }

    public String getStderr() {
        return stderr;
    }

    public int getExitCode() {
        return exitCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}