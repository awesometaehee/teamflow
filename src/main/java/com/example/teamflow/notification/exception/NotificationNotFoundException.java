package com.example.teamflow.notification.exception;

import com.example.teamflow.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class NotificationNotFoundException extends ApiException {

    public NotificationNotFoundException(Long notificationId) {
        super(HttpStatus.NOT_FOUND, "NOTIFICATION_NOT_FOUND", "Notification not found: " + notificationId);
    }
}
