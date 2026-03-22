package com.example.teamflow.auth.dto;

import java.time.LocalDateTime;

public record LoginResponse(
        String sessionToken,
        UserSessionUserResponse user
) {
    public record UserSessionUserResponse(
            Long id,
            String name,
            String email,
            LocalDateTime createdAt
    ) {
    }
}
