package com.example.teamflow.share.repository;

import com.example.teamflow.share.entity.TaskShare;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskShareRepository extends JpaRepository<TaskShare, Long> {

    boolean existsByTaskIdAndUserId(Long taskId, Long userId);
}
