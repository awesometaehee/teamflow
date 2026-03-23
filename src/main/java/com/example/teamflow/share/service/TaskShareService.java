package com.example.teamflow.share.service;

import com.example.teamflow.common.exception.BadRequestException;
import com.example.teamflow.common.exception.ForbiddenException;
import com.example.teamflow.share.dto.request.TaskShareCreateRequest;
import com.example.teamflow.share.dto.response.SharedTaskListResponse;
import com.example.teamflow.share.repository.TaskShareRepository;
import com.example.teamflow.task.dto.response.TaskDetailResponse;
import com.example.teamflow.task.dto.response.TaskSummaryResponse;
import com.example.teamflow.task.entity.Task;
import com.example.teamflow.task.exception.TaskNotFoundException;
import com.example.teamflow.task.repository.TaskRepository;
import com.example.teamflow.user.entity.User;
import com.example.teamflow.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskShareService {

    private final TaskRepository taskRepository;
    private final TaskShareRepository taskShareRepository;
    private final UserService userService;

    public TaskShareService(TaskRepository taskRepository, TaskShareRepository taskShareRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.taskShareRepository = taskShareRepository;
        this.userService = userService;
    }

    @Transactional
    public TaskDetailResponse addShare(Long currentUserId, Long taskId, TaskShareCreateRequest request) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCreator(task, userId);

        User sharedUser = userService.getRequiredUser(request.userId());
        validateShareTarget(task, sharedUser);

        if (taskShareRepository.existsByTaskIdAndUserId(taskId, sharedUser.getId())) {
            throw new BadRequestException("TASK_SHARE_EXISTS", "This user is already shared on the task");
        }

        task.addShare(sharedUser);
        return TaskDetailResponse.from(task);
    }

    @Transactional
    public TaskDetailResponse removeShare(Long currentUserId, Long taskId, Long sharedUserId) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Task task = getTaskOrThrow(taskId);
        assertCreator(task, userId);

        User sharedUser = userService.getRequiredUser(sharedUserId);

        if (!taskShareRepository.existsByTaskIdAndUserId(taskId, sharedUserId)) {
            throw new BadRequestException("TASK_SHARE_NOT_FOUND", "The shared user is not linked to this task");
        }

        task.removeShare(sharedUser);
        return TaskDetailResponse.from(task);
    }

    @Transactional(readOnly = true)
    public SharedTaskListResponse getSharedTasks(Long currentUserId) {
        Long userId = userService.requireCurrentUserId(currentUserId);

        List<TaskSummaryResponse> assignedTasks = taskRepository.findAssignedTasks(userId).stream()
                .map(TaskSummaryResponse::from)
                .toList();

        List<TaskSummaryResponse> sharedTasks = taskRepository.findSharedTasks(userId).stream()
                .filter(task -> task.getAssignee() == null || !task.getAssignee().getId().equals(userId))
                .map(TaskSummaryResponse::from)
                .toList();

        return new SharedTaskListResponse(assignedTasks, sharedTasks);
    }

    private Task getTaskOrThrow(Long taskId) {
        return taskRepository.findWithDetailsById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
    }

    private void assertCreator(Task task, Long userId) {
        if (task.getCreator().getId().equals(userId)) {
            return;
        }

        throw new ForbiddenException("TASK_FORBIDDEN", "Only the creator can manage task shares");
    }

    private void validateShareTarget(Task task, User sharedUser) {
        if (task.getCreator().getId().equals(sharedUser.getId())) {
            throw new BadRequestException("INVALID_SHARE_TARGET", "The creator does not need to be shared on the task");
        }

        if (task.getAssignee() != null && task.getAssignee().getId().equals(sharedUser.getId())) {
            throw new BadRequestException("INVALID_SHARE_TARGET", "The assignee does not need an additional share");
        }
    }
}
