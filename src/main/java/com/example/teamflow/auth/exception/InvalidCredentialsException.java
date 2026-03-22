package com.example.teamflow.auth.exception;

import com.example.teamflow.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends ApiException {

    public InvalidCredentialsException() {
        super(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Email or password is incorrect");
    }
}
