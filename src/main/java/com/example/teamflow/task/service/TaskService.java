package com.example.teamflow.task.service;

import com.example.teamflow.task.dto.request.TaskCreateRequest;
import com.example.teamflow.task.dto.response.TaskSummaryResponse;
import com.example.teamflow.task.entity.Task;
import com.example.teamflow.task.entity.TaskStatus;
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
}
