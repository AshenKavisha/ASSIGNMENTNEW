// File: Notification.java
package com.assignmentservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status = NotificationStatus.UNREAD;

    @Column(name = "is_important")
    private boolean important = false;

    @Column(name = "related_assignment_id")
    private Long relatedAssignmentId;

    @Column(name = "related_user_id")
    private Long relatedUserId;

    @Column(name = "action_url")
    private String actionUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum NotificationType {
        ASSIGNMENT_SUBMITTED,      // User submitted assignment
        ASSIGNMENT_APPROVED,       // Admin approved assignment
        ASSIGNMENT_REJECTED,       // Admin rejected assignment
        SOLUTION_DELIVERED,        // Admin delivered solution
        REVISION_REQUESTED,        // User requested revision
        REVISION_COMPLETED,        // Admin completed revision
        REVISION_REJECTED,         // Admin rejected revision
        PAYMENT_RECEIVED,          // Payment received
        SYSTEM,                    // System notification (for all users)
        ADMIN,                     // Admin-only notification
        FEEDBACK_RECEIVED,
        PAYMENT_REQUIRED,      // NEW
        PAYMENT_CONFIRMED     // NEW
    }

    public enum NotificationStatus {
        UNREAD,
        READ,
        ARCHIVED
    }

    // Constructors
    public Notification() {}

    public Notification(User user, String title, String message, NotificationType type) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public NotificationStatus getStatus() { return status; }
    public void setStatus(NotificationStatus status) { this.status = status; }

    public boolean isImportant() { return important; }
    public void setImportant(boolean important) { this.important = important; }

    public Long getRelatedAssignmentId() { return relatedAssignmentId; }
    public void setRelatedAssignmentId(Long relatedAssignmentId) {
        this.relatedAssignmentId = relatedAssignmentId;
    }

    public Long getRelatedUserId() { return relatedUserId; }
    public void setRelatedUserId(Long relatedUserId) {
        this.relatedUserId = relatedUserId;
    }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }

    // Helper methods
    public void markAsRead() {
        this.status = NotificationStatus.READ;
        this.readAt = LocalDateTime.now();
    }

    public void markAsArchived() {
        this.status = NotificationStatus.ARCHIVED;
    }

    public boolean isUnread() {
        return this.status == NotificationStatus.UNREAD;
    }

    // Get icon based on type
    public String getIcon() {
        switch (this.type) {
            case ASSIGNMENT_SUBMITTED: return "bi-journal-plus";
            case ASSIGNMENT_APPROVED: return "bi-check-circle";
            case ASSIGNMENT_REJECTED: return "bi-x-circle";
            case SOLUTION_DELIVERED: return "bi-envelope-check";
            case REVISION_REQUESTED: return "bi-arrow-repeat";
            case REVISION_COMPLETED: return "bi-check2-all";
            case REVISION_REJECTED: return "bi-x-octagon";
            case PAYMENT_RECEIVED: return "bi-cash-coin";
            case SYSTEM: return "bi-megaphone";
            case ADMIN: return "bi-shield-check";
            case FEEDBACK_RECEIVED: return "bi-chat-left-text";
            default: return "bi-bell";
        }
    }

    // Get Bootstrap color class based on type
    public String getColorClass() {
        switch (this.type) {
            case ASSIGNMENT_SUBMITTED: return "primary";
            case ASSIGNMENT_APPROVED: return "success";
            case ASSIGNMENT_REJECTED: return "danger";
            case SOLUTION_DELIVERED: return "info";
            case REVISION_REQUESTED: return "warning";
            case REVISION_COMPLETED: return "success";
            case REVISION_REJECTED: return "danger";
            case PAYMENT_RECEIVED: return "success";
            case SYSTEM: return "warning";
            case ADMIN: return "dark";
            case FEEDBACK_RECEIVED: return "info";
            default: return "secondary";
        }
    }
}