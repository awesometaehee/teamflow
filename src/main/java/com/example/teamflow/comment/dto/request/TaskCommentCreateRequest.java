package com.example.teamflow.comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskCommentCreateRequest(
        @NotBlank(message = "Content is required")
        @Size(max = 2000, message = "Content must be 2000 characters or fewer")
        String content
) {
}
