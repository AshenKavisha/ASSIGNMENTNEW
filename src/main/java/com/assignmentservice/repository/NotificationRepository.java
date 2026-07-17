// File: NotificationRepository.java
package com.assignmentservice.repository;

import com.assignmentservice.model.Notification;
import com.assignmentservice.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications by user
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // Find notifications by user and status
    List<Notification> findByUserAndStatusOrderByCreatedAtDesc(User user, Notification.NotificationStatus status);

    // Count unread notifications by user
    long countByUserAndStatus(User user, Notification.NotificationStatus status);

    // Find notifications by type and user
    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, Notification.NotificationType type);

    // Find notifications by assignment
    List<Notification> findByRelatedAssignmentIdOrderByCreatedAtDesc(Long assignmentId);

    // Find important notifications
    List<Notification> findByUserAndImportantTrueOrderByCreatedAtDesc(User user);

    // Find top N notifications by user (for dashboard preview) - FIXED
    @Query(value = "SELECT n FROM Notification n WHERE n.user = :user ORDER BY n.createdAt DESC")
    List<Notification> findTopByUserOrderByCreatedAtDesc(@Param("user") User user, Pageable pageable);

    // Mark all as read for user
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.status = 'READ', n.readAt = :now WHERE n.user = :user AND n.status = 'UNREAD'")
    int markAllAsRead(@Param("user") User user, @Param("now") LocalDateTime now);

    // Delete old notifications
    @Modifying
    @Transactional
    void deleteByCreatedAtBefore(LocalDateTime date);

    // Find notifications for admin about specific assignment
    @Query("SELECT n FROM Notification n WHERE n.relatedAssignmentId = :assignmentId AND n.type IN :types ORDER BY n.createdAt DESC")
    List<Notification> findAssignmentNotifications(@Param("assignmentId") Long assignmentId,
                                                   @Param("types") List<Notification.NotificationType> types);

    // Find top 5 notifications by user (alternative method)
    List<Notification> findTop5ByUserOrderByCreatedAtDesc(User user);
}