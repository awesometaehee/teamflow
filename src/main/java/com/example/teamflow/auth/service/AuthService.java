package com.example.teamflow.auth.service;

import com.example.teamflow.auth.dto.LoginRequest;
import com.example.teamflow.auth.dto.LoginResponse;
import com.example.teamflow.auth.exception.InvalidCredentialsException;
import com.example.teamflow.user.entity.User;
import com.example.teamflow.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.getPassword().equals(request.password())) {
            throw new InvalidCredentialsException();
        }

        return new LoginResponse(
                UUID.randomUUID().toString(),
                new LoginResponse.UserSessionUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getCreatedAt()
                )
        );
    }
}
