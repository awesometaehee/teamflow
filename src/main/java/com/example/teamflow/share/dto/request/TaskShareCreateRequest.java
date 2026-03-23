package com.example.teamflow.share.dto.request;

import jakarta.validation.constraints.NotNull;

public record TaskShareCreateRequest(
        @NotNull(message = "userId is required")
        Long userId
) {
}
