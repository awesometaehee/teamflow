package com.example.teamflow.task.repository;

import com.example.teamflow.task.entity.Task;
import com.example.teamflow.task.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByCreatorIdOrderByCreatedAtDesc(Long creatorId);

    List<Task> findAllByCreatorIdAndStatusOrderByCompletedAtDesc(Long creatorId, TaskStatus status);

    @Query("""
            select t
            from Task t
            where t.creator.id = :creatorId
              and t.status <> com.example.teamflow.task.entity.TaskStatus.DONE
              and t.dueAt >= :start
              and t.dueAt < :end
            order by t.dueAt asc, t.createdAt desc
            """)
    List<Task> findTodayTasks(Long creatorId, LocalDateTime start, LocalDateTime end);

    @Query("""
            select t
            from Task t
            where t.creator.id = :creatorId
              and t.status <> com.example.teamflow.task.entity.TaskStatus.DONE
              and t.dueAt >= :start
            order by t.dueAt asc, t.createdAt desc
            """)
    List<Task> findUpcomingTasks(Long creatorId, LocalDateTime start);
}
