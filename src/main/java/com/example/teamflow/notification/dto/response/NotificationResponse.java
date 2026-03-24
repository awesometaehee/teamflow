package com.example.teamflow.notification.dto.response;

import com.example.teamflow.notification.entity.Notification;
import com.example.teamflow.notification.entity.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        Long taskId,
        String taskTitle,
        NotificationType type,
        String message,
        boolean read,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTask().getId(),
                notification.getTask().getTitle(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
