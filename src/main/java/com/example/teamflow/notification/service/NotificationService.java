package com.example.teamflow.notification.service;

import com.example.teamflow.notification.dto.response.NotificationResponse;
import com.example.teamflow.notification.entity.Notification;
import com.example.teamflow.notification.entity.NotificationType;
import com.example.teamflow.notification.exception.NotificationNotFoundException;
import com.example.teamflow.notification.repository.NotificationRepository;
import com.example.teamflow.task.entity.Task;
import com.example.teamflow.user.entity.User;
import com.example.teamflow.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationService(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(Long currentUserId) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        return notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long currentUserId, Long notificationId) {
        Long userId = userService.requireCurrentUserId(currentUserId);
        Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, userId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));
        notification.markRead();
        return NotificationResponse.from(notification);
    }

    @Transactional
    public void notifyAssignee(Task task, User actor, User previousAssignee, User nextAssignee) {
        if (nextAssignee == null) {
            return;
        }

        if (previousAssignee != null && previousAssignee.getId().equals(nextAssignee.getId())) {
            return;
        }

        if (actor.getId().equals(nextAssignee.getId())) {
            return;
        }

        String message = previousAssignee == null
                ? actor.getName() + " assigned you to \"" + task.getTitle() + "\""
                : actor.getName() + " changed the assignee for \"" + task.getTitle() + "\" to you";

        notificationRepository.save(new Notification(nextAssignee, task, NotificationType.ASSIGNED, message));
    }

    @Transactional
    public void notifyShared(Task task, User actor, User sharedUser) {
        if (actor.getId().equals(sharedUser.getId())) {
            return;
        }

        String message = actor.getName() + " shared \"" + task.getTitle() + "\" with you";
        notificationRepository.save(new Notification(sharedUser, task, NotificationType.SHARED, message));
    }

    @Transactional
    public void notifyCommented(Task task, User actor) {
        Set<User> recipients = new LinkedHashSet<>();
        recipients.add(task.getCreator());

        if (task.getAssignee() != null) {
            recipients.add(task.getAssignee());
        }

        task.getShares().forEach(share -> recipients.add(share.getUser()));

        recipients.stream()
                .filter(recipient -> !recipient.getId().equals(actor.getId()))
                .map(recipient -> new Notification(
                        recipient,
                        task,
                        NotificationType.COMMENTED,
                        actor.getName() + " commented on \"" + task.getTitle() + "\""
                ))
                .forEach(notificationRepository::save);
    }
}
