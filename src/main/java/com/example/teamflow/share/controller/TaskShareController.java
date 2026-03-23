package com.example.teamflow.share.controller;

import com.example.teamflow.share.dto.request.TaskShareCreateRequest;
import com.example.teamflow.share.dto.response.SharedTaskListResponse;
import com.example.teamflow.share.service.TaskShareService;
import com.example.teamflow.task.dto.response.TaskDetailResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskShareController {

    private final TaskShareService taskShareService;

    public TaskShareController(TaskShareService taskShareService) {
        this.taskShareService = taskShareService;
    }

    @GetMapping("/shared")
    public ResponseEntity<SharedTaskListResponse> getSharedTasks(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId
    ) {
        return ResponseEntity.ok(taskShareService.getSharedTasks(currentUserId));
    }

    @PostMapping("/{taskId}/shares")
    public ResponseEntity<TaskDetailResponse> addShare(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskShareCreateRequest request
    ) {
        return ResponseEntity.ok(taskShareService.addShare(currentUserId, taskId, request));
    }

    @DeleteMapping("/{taskId}/shares/{userId}")
    public ResponseEntity<TaskDetailResponse> removeShare(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @PathVariable Long taskId,
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(taskShareService.removeShare(currentUserId, taskId, userId));
    }
}
