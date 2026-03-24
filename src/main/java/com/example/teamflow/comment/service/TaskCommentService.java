package com.example.teamflow.comment.service;

import com.example.teamflow.comment.dto.request.TaskCommentCreateRequest;
import com.example.teamflow.comment.dto.response.TaskCommentResponse;
import com.example.teamflow.comment.entity.TaskComment;
import com.example.teamflow.comment.repository.TaskCommentRepository;
import com.example.teamflow.notification.service.NotificationService;
import com.example.teamflow.task.entity.Task;
import com.example.teamflow.task.service.TaskService;
import com.example.teamflow.user.entity.User;
import com.example.teamflow.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final NotificationService notificationService;

    public TaskCommentService(
            TaskCommentRepository taskCommentRepository,
            TaskService taskService,
            UserService userService,
            NotificationService notificationService
    ) {
        this.taskCommentRepository = taskCommentRepository;
        this.taskService = taskService;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @Transactional
    public TaskCommentResponse createComment(Long currentUserId, Long taskId, TaskCommentCreateRequest request) {
        Task task = taskService.getAccessibleTask(currentUserId, taskId);
        User author = userService.getRequiredUser(userService.requireCurrentUserId(currentUserId));

        TaskComment comment = new TaskComment(task, author, request.content().trim());
        TaskComment savedComment = taskCommentRepository.save(comment);
        notificationService.notifyCommented(task, author);
        return TaskCommentResponse.from(savedComment);
    }

    @Transactional(readOnly = true)
    public List<TaskCommentResponse> getComments(Long currentUserId, Long taskId) {
        Task task = taskService.getAccessibleTask(currentUserId, taskId);

        return taskCommentRepository.findAllByTaskIdOrderByCreatedAtAsc(task.getId()).stream()
                .map(TaskCommentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<Long, Long> getCommentCountMap(List<Long> taskIds) {
        if (taskIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return taskCommentRepository.countByTaskIds(taskIds).stream()
                .collect(Collectors.toMap(
                        TaskCommentRepository.TaskCommentCountView::getTaskId,
                        TaskCommentRepository.TaskCommentCountView::getCommentCount
                ));
    }
}
