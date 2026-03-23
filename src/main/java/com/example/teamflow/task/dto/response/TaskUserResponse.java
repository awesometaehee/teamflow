package com.example.teamflow.task.dto.response;

import com.example.teamflow.user.entity.User;

public record TaskUserResponse(
        Long id,
        String name,
        String email
) {
    public static TaskUserResponse from(User user) {
        return new TaskUserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
