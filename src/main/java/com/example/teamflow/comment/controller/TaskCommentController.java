package com.example.teamflow.comment.controller;

import com.example.teamflow.comment.dto.request.TaskCommentCreateRequest;
import com.example.teamflow.comment.dto.response.TaskCommentResponse;
import com.example.teamflow.comment.service.TaskCommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
public class TaskCommentController {

    private final TaskCommentService taskCommentService;

    public TaskCommentController(TaskCommentService taskCommentService) {
        this.taskCommentService = taskCommentService;
    }

    @PostMapping
    public ResponseEntity<TaskCommentResponse> createComment(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskCommentCreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskCommentService.createComment(currentUserId, taskId, request));
    }

    @GetMapping
    public ResponseEntity<List<TaskCommentResponse>> getComments(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @PathVariable Long taskId
    ) {
        return ResponseEntity.ok(taskCommentService.getComments(currentUserId, taskId));
    }
}
