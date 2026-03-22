package com.example.teamflow.user.service;

import com.example.teamflow.common.exception.UnauthorizedException;
import com.example.teamflow.user.entity.User;
import com.example.teamflow.user.exception.UserNotFoundException;
import com.example.teamflow.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User getRequiredUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    public Long requireCurrentUserId(Long userIdHeader) {
        if (userIdHeader == null) {
            throw new UnauthorizedException("USER_CONTEXT_REQUIRED", "X-User-Id header is required");
        }
        return userIdHeader;
    }
}
