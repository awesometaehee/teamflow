package com.example.teamflow.comment.dto.response;

import com.example.teamflow.comment.entity.TaskComment;
import com.example.teamflow.task.dto.response.TaskUserResponse;

import java.time.LocalDateTime;

public record TaskCommentResponse(
        Long id,
        String content,
        LocalDateTime createdAt,
        TaskUserResponse author
) {
    public static TaskCommentResponse from(TaskComment comment) {
        return new TaskCommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                TaskUserResponse.from(comment.getAuthor())
        );
    }
}
