package com.example.teamflow.task.controller;

import com.example.teamflow.task.dto.request.TaskCreateRequest;
import com.example.teamflow.task.dto.response.TaskSummaryResponse;
import com.example.teamflow.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
}
