package com.example.teamflow.task.dto.response;

import com.example.teamflow.task.entity.Task;
import com.example.teamflow.task.entity.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TaskDetailResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDateTime dueAt,
        LocalDateTime completedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        TaskUserResponse creator,
        TaskUserResponse assignee,
        List<TaskUserResponse> sharedUsers
) {
    public static TaskDetailResponse from(Task task) {
        return new TaskDetailResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueAt(),
                task.getCompletedAt(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                TaskUserResponse.from(task.getCreator()),
                task.getAssignee() == null ? null : TaskUserResponse.from(task.getAssignee()),
                task.getShares().stream()
                        .map(taskShare -> TaskUserResponse.from(taskShare.getUser()))
                        .toList()
        );
    }
}
