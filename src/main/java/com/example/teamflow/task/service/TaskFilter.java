package com.example.teamflow.task.service;

import com.example.teamflow.common.exception.BadRequestException;

public enum TaskFilter {
    TODAY,
    UPCOMING,
    ALL,
    DONE;

    public static TaskFilter from(String value) {
        try {
            return TaskFilter.valueOf(value.trim().toUpperCase());
        } catch (RuntimeException exception) {
            throw new BadRequestException(
                    "INVALID_TASK_FILTER",
                    "filter must be one of today, upcoming, all, done"
            );
        }
    }
}
