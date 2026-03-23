package com.example.teamflow.task.service;

import com.example.teamflow.common.exception.ForbiddenException;
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

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    public TaskService(TaskRepository taskRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.userService = userService;
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

        return TaskSummaryResponse.from(taskRepository.save(task));
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

        return tasks.stream()
                .map(TaskSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskDetailResponse getTask(Long currentUserId, Long taskId) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCanViewTask(task, userId);
        return TaskDetailResponse.from(task);
    }

    @Transactional
    public TaskDetailResponse updateTask(Long currentUserId, Long taskId, TaskUpdateRequest request) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCreator(task, userId);

        User assignee = userService.getOptionalUser(request.assigneeId());
        task.update(
                request.title().trim(),
                request.description(),
                request.dueAt(),
                assignee
        );

        return TaskDetailResponse.from(task);
    }

    @Transactional
    public TaskDetailResponse updateTaskStatus(Long currentUserId, Long taskId, TaskStatusUpdateRequest request) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCanChangeStatus(task, userId);
        task.changeStatus(request.status());
        return TaskDetailResponse.from(task);
    }

    @Transactional
    public void deleteTask(Long currentUserId, Long taskId) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCreator(task, userId);
        taskRepository.delete(task);
    }

    private Task getTaskOrThrow(Long taskId) {
        return taskRepository.findWithDetailsById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
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
