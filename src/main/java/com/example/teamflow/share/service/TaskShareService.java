package com.example.teamflow.share.service;

import com.example.teamflow.comment.repository.TaskCommentRepository;
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
import java.util.stream.Collectors;

@Service
public class TaskShareService {

    private final TaskRepository taskRepository;
    private final TaskShareRepository taskShareRepository;
    private final UserService userService;
    private final TaskCommentRepository taskCommentRepository;

    public TaskShareService(
            TaskRepository taskRepository,
            TaskShareRepository taskShareRepository,
            UserService userService,
            TaskCommentRepository taskCommentRepository
    ) {
        this.taskRepository = taskRepository;
        this.taskShareRepository = taskShareRepository;
        this.userService = userService;
        this.taskCommentRepository = taskCommentRepository;
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
        return TaskDetailResponse.from(task, getCommentCount(task.getId()));
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
        return TaskDetailResponse.from(task, getCommentCount(task.getId()));
    }

    @Transactional(readOnly = true)
    public SharedTaskListResponse getSharedTasks(Long currentUserId) {
        Long userId = userService.requireCurrentUserId(currentUserId);

        List<Task> assignedTaskEntities = taskRepository.findAssignedTasks(userId);
        List<TaskSummaryResponse> assignedTasks = mapTaskSummaries(assignedTaskEntities);

        List<Task> sharedTaskEntities = taskRepository.findSharedTasks(userId).stream()
                .filter(task -> task.getAssignee() == null || !task.getAssignee().getId().equals(userId))
                .toList();
        List<TaskSummaryResponse> sharedTasks = mapTaskSummaries(sharedTaskEntities);

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
}
