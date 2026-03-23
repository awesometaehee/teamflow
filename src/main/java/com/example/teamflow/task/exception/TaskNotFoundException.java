package com.example.teamflow.task.exception;

import com.example.teamflow.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class TaskNotFoundException extends ApiException {

    public TaskNotFoundException(Long taskId) {
        super(HttpStatus.NOT_FOUND, "TASK_NOT_FOUND", "Task not found: " + taskId);
    }
}
