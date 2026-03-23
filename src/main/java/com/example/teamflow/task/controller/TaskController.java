package com.example.teamflow.task.controller;

import com.example.teamflow.task.dto.request.TaskCreateRequest;
import com.example.teamflow.task.dto.request.TaskStatusUpdateRequest;
import com.example.teamflow.task.dto.request.TaskUpdateRequest;
import com.example.teamflow.task.dto.response.TaskDetailResponse;
import com.example.teamflow.task.dto.response.TaskSummaryResponse;
import com.example.teamflow.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskSummaryResponse> createTask(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @Valid @RequestBody TaskCreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(currentUserId, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TaskSummaryResponse>> getMyTasks(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @RequestParam("filter") String filter
    ) {
        return ResponseEntity.ok(taskService.getMyTasks(currentUserId, filter));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDetailResponse> getTask(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @PathVariable Long taskId
    ) {
        return ResponseEntity.ok(taskService.getTask(currentUserId, taskId));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskDetailResponse> updateTask(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskUpdateRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTask(currentUserId, taskId, request));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskDetailResponse> updateTaskStatus(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTaskStatus(currentUserId, taskId, request));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @PathVariable Long taskId
    ) {
        taskService.deleteTask(currentUserId, taskId);
        return ResponseEntity.noContent().build();
    }
}
