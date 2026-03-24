package com.example.teamflow.notification.repository;

import com.example.teamflow.notification.entity.Notification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @EntityGraph(attributePaths = {"task"})
    List<Notification> findAllByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    @EntityGraph(attributePaths = {"task"})
    Optional<Notification> findByIdAndRecipientId(Long notificationId, Long recipientId);
}
