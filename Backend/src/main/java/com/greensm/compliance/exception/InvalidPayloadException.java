package com.greensm.compliance.exception;

public class InvalidPayloadException extends RuntimeException {
    private final String code;

    public InvalidPayloadException(String message) {
        super(message);
        this.code = "INVALID_PAYLOAD";
    }

    public InvalidPayloadException(String message, String code) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
