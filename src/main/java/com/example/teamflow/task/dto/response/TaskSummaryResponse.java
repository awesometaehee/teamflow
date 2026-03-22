package com.example.teamflow.task.dto.response;

import com.example.teamflow.task.entity.Task;
import com.example.teamflow.task.entity.TaskStatus;

import java.time.LocalDateTime;

public record TaskSummaryResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDateTime dueAt,
        LocalDateTime completedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TaskSummaryResponse from(Task task) {
        return new TaskSummaryResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueAt(),
                task.getCompletedAt(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
