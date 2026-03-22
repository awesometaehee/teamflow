package com.example.teamflow.user.exception;

import com.example.teamflow.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApiException {

    public UserNotFoundException(Long userId) {
        super(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found: " + userId);
    }
}
