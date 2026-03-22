package com.example.teamflow.common.response;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String code,
        String message,
        String path,
        List<String> details
) {
    public static ErrorResponse of(
            LocalDateTime timestamp,
            int status,
            String code,
            String message,
            String path,
            List<String> details
    ) {
        return new ErrorResponse(timestamp, status, code, message, path, details);
    }
}
