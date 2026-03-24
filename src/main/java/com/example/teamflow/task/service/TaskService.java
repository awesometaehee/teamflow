package com.example.teamflow.task.service;

import com.example.teamflow.comment.repository.TaskCommentRepository;
import com.example.teamflow.common.exception.ForbiddenException;
import com.example.teamflow.notification.service.NotificationService;
import com.example.teamflow.task.dto.request.TaskCreateRequest;
import com.example.teamflow.task.dto.request.TaskStatusUpdateRequest;
import com.example.teamflow.task.dto.request.TaskUpdateRequest;
import com.example.teamflow.task.dto.response.TaskDetailResponse;
import com.example.teamflow.task.dto.response.TaskSummaryResponse;
import com.example.teamflow.task.entity.Task;
import com.example.teamflow.task.entity.TaskStatus;
import com.example.teamflow.task.exception.TaskNotFoundException;
import com.example.teamflow.task.repository.TaskRepository;
import com.example.teamflow.user.entity.User;
import com.example.teamflow.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final TaskCommentRepository taskCommentRepository;
    private final NotificationService notificationService;

    public TaskService(
            TaskRepository taskRepository,
            UserService userService,
            TaskCommentRepository taskCommentRepository,
            NotificationService notificationService
    ) {
        this.taskRepository = taskRepository;
        this.userService = userService;
        this.taskCommentRepository = taskCommentRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public TaskSummaryResponse createTask(Long currentUserId, TaskCreateRequest request) {
        User creator = userService.getRequiredUser(userService.requireCurrentUserId(currentUserId));
        Task task = new Task(
                request.title().trim(),
                request.description(),
                request.dueAt(),
                creator
        );

        Task savedTask = taskRepository.save(task);
        return TaskSummaryResponse.from(savedTask, 0);
    }

    @Transactional(readOnly = true)
    public List<TaskSummaryResponse> getMyTasks(Long currentUserId, String filterValue) {
        Long creatorId = userService.requireCurrentUserId(currentUserId);
        TaskFilter filter = TaskFilter.from(filterValue);

        List<Task> tasks = switch (filter) {
            case TODAY -> {
                LocalDate today = LocalDate.now();
                yield taskRepository.findTodayTasks(
                        creatorId,
                        today.atStartOfDay(),
                        today.plusDays(1).atStartOfDay()
                );
            }
            case UPCOMING -> {
                LocalDate tomorrow = LocalDate.now().plusDays(1);
                yield taskRepository.findUpcomingTasks(creatorId, tomorrow.atStartOfDay());
            }
            case ALL -> taskRepository.findAllByCreatorIdOrderByCreatedAtDesc(creatorId);
            case DONE -> taskRepository.findAllByCreatorIdAndStatusOrderByCompletedAtDesc(creatorId, TaskStatus.DONE);
        };

        return mapTaskSummaries(tasks);
    }

    @Transactional(readOnly = true)
    public TaskDetailResponse getTask(Long currentUserId, Long taskId) {
        Task task = getAccessibleTask(currentUserId, taskId);
        return TaskDetailResponse.from(task, getCommentCount(task.getId()));
    }

    @Transactional
    public TaskDetailResponse updateTask(Long currentUserId, Long taskId, TaskUpdateRequest request) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCreator(task, userId);
        User actor = userService.getRequiredUser(userId);
        User previousAssignee = task.getAssignee();

        User assignee = userService.getOptionalUser(request.assigneeId());
        task.update(
                request.title().trim(),
                request.description(),
                request.dueAt(),
                assignee
        );
        notificationService.notifyAssignee(task, actor, previousAssignee, assignee);

        return TaskDetailResponse.from(task, getCommentCount(task.getId()));
    }

    @Transactional
    public TaskDetailResponse updateTaskStatus(Long currentUserId, Long taskId, TaskStatusUpdateRequest request) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCanChangeStatus(task, userId);
        task.changeStatus(request.status());
        return TaskDetailResponse.from(task, getCommentCount(task.getId()));
    }

    @Transactional
    public void deleteTask(Long currentUserId, Long taskId) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCreator(task, userId);
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public Task getAccessibleTask(Long currentUserId, Long taskId) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCanViewTask(task, userId);
        return task;
    }

    private Task getTaskOrThrow(Long taskId) {
        return taskRepository.findWithDetailsById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
    }

    private List<TaskSummaryResponse> mapTaskSummaries(List<Task> tasks) {
        List<Long> taskIds = tasks.stream()
                .map(Task::getId)
                .toList();

        var commentCountMap = taskCommentRepository.countByTaskIds(taskIds).stream()
                .collect(Collectors.toMap(
                        TaskCommentRepository.TaskCommentCountView::getTaskId,
                        TaskCommentRepository.TaskCommentCountView::getCommentCount
                ));

        return tasks.stream()
                .map(task -> TaskSummaryResponse.from(task, commentCountMap.getOrDefault(task.getId(), 0L)))
                .toList();
    }

    private long getCommentCount(Long taskId) {
        return taskCommentRepository.countByTaskIds(List.of(taskId)).stream()
                .findFirst()
                .map(TaskCommentRepository.TaskCommentCountView::getCommentCount)
                .orElse(0L);
    }

    private void assertCanViewTask(Task task, Long userId) {
        if (isCreator(task, userId) || isAssignee(task, userId) || isShared(task, userId)) {
            return;
        }

        throw new ForbiddenException("TASK_FORBIDDEN", "You do not have access to this task");
    }

    private void assertCreator(Task task, Long userId) {
        if (isCreator(task, userId)) {
            return;
        }

        throw new ForbiddenException("TASK_FORBIDDEN", "Only the creator can modify this task");
    }

    private void assertCanChangeStatus(Task task, Long userId) {
        if (isCreator(task, userId) || isAssignee(task, userId)) {
            return;
        }

        throw new ForbiddenException("TASK_FORBIDDEN", "Only the creator or assignee can change task status");
    }

    private boolean isCreator(Task task, Long userId) {
        return task.getCreator().getId().equals(userId);
    }

    private boolean isAssignee(Task task, Long userId) {
        return task.getAssignee() != null && task.getAssignee().getId().equals(userId);
    }

    private boolean isShared(Task task, Long userId) {
        return task.getShares().stream()
                .anyMatch(share -> share.getUser().getId().equals(userId));
    }
}
