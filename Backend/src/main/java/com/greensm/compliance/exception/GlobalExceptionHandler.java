package com.greensm.compliance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .success(false)
            .message(ex.getMessage())
            .code(ex.getCode())
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidPayloadException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPayload(InvalidPayloadException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .success(false)
            .message(ex.getMessage())
            .code(ex.getCode())
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder sb = new StringBuilder();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(fieldError.getField()).append(": ").append(fieldError.getDefaultMessage());
        }

        ErrorResponse error = ErrorResponse.builder()
            .success(false)
            .message("Dữ liệu đầu vào không hợp lệ: " + sb)
            .code("INVALID_PAYLOAD")
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = ErrorResponse.builder()
            .success(false)
            .message("Lỗi máy chủ nội bộ: " + ex.getMessage())
            .code("SERVER_ERROR")
            .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
