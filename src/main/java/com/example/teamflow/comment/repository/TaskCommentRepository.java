package com.example.teamflow.comment.repository;

import com.example.teamflow.comment.entity.TaskComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {

    @EntityGraph(attributePaths = {"author"})
    List<TaskComment> findAllByTaskIdOrderByCreatedAtAsc(Long taskId);

    @Query("""
            select c.task.id as taskId, count(c) as commentCount
            from TaskComment c
            where c.task.id in :taskIds
            group by c.task.id
            """)
    List<TaskCommentCountView> countByTaskIds(Collection<Long> taskIds);

    interface TaskCommentCountView {
        Long getTaskId();
        long getCommentCount();
    }
}
