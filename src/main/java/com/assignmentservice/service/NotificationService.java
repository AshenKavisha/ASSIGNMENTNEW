// File: NotificationService.java
package com.assignmentservice.service;

import com.assignmentservice.model.*;
import com.assignmentservice.repository.NotificationRepository;
import com.assignmentservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;  // Properly autowired

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new notification
     */
    public Notification createNotification(User user, String title, String message,
                                           Notification.NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        return notificationRepository.save(notification);
    }

    /**
     * Create notification with assignment context
     */
    public Notification createAssignmentNotification(User user, Assignment assignment,
                                                     String title, String message,
                                                     Notification.NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        notification.setRelatedAssignmentId(assignment.getId());
        notification.setActionUrl("/assignments/" + assignment.getId());

        return notificationRepository.save(notification);
    }

    /**
     * Notify admin when user submits assignment
     */
    public void notifyAdminAssignmentSubmitted(Assignment assignment) {
        // Get all admins with appropriate specialization
        List<User> admins = getAdminsForAssignment(assignment);

        String title = "📋 New Assignment Submitted";
        String message = "User " + assignment.getUser().getFullName() +
                " submitted a new assignment: " + assignment.getTitle();

        for (User admin : admins) {
            Notification notification = createAssignmentNotification(
                    admin, assignment, title, message,
                    Notification.NotificationType.ASSIGNMENT_SUBMITTED
            );
            notification.setImportant(true);
            notificationRepository.save(notification);

            // Also send email to admin
            // emailService.sendAssignmentNotificationToAdmin(assignment); // Already exists
        }
    }

    /**
     * Notify user when admin approves assignment
     */
    public void notifyUserAssignmentApproved(Assignment assignment) {
        User user = assignment.getUser();
        String title = "✅ Assignment Approved";
        String message = "Your assignment '" + assignment.getTitle() +
                "' has been approved. Price: $" + assignment.getPrice();

        createAssignmentNotification(user, assignment, title, message,
                Notification.NotificationType.ASSIGNMENT_APPROVED);
    }

    /**
     * Notify user when admin rejects assignment
     */
    public void notifyUserAssignmentRejected(Assignment assignment) {
        User user = assignment.getUser();
        String title = "❌ Assignment Rejected";
        String message = "Your assignment '" + assignment.getTitle() +
                "' has been rejected. Please review the requirements and resubmit.";

        createAssignmentNotification(user, assignment, title, message,
                Notification.NotificationType.ASSIGNMENT_REJECTED);
    }

    /**
     * Notify user when admin delivers solution
     */
    public void notifyUserSolutionDelivered(Assignment assignment, User admin) {
        User user = assignment.getUser();
        String title = "📨 Solution Delivered";
        String message = "Your solution for '" + assignment.getTitle() +
                "' has been delivered by " + admin.getFullName() +
                ". Check your email for attachments.";

        Notification notification = createAssignmentNotification(
                user, assignment, title, message,
                Notification.NotificationType.SOLUTION_DELIVERED
        );
        notification.setRelatedUserId(admin.getId());
        notificationRepository.save(notification);

        // Notify admin that solution was delivered
        notifyAdminSolutionDelivered(assignment, admin);
    }

    /**
     * Notify admin when solution is delivered (for tracking)
     */
    public void notifyAdminSolutionDelivered(Assignment assignment, User admin) {
        String title = "📤 Solution Sent to User";
        String message = "You delivered solution for assignment: " + assignment.getTitle() +
                " to " + assignment.getUser().getFullName();

        createAssignmentNotification(admin, assignment, title, message,
                Notification.NotificationType.SOLUTION_DELIVERED);
    }

    /**
     * Notify admin when user requests revision
     */
    public void notifyAdminRevisionRequested(Assignment assignment, RevisionRequest revisionRequest) {
        // Get appropriate admin(s)
        List<User> admins = getAdminsForAssignment(assignment);

        String title = "🔄 Revision Requested";
        String message = assignment.getUser().getFullName() +
                " requested revisions for: " + assignment.getTitle() +
                ". Reason: " + revisionRequest.getReason();

        for (User admin : admins) {
            Notification notification = createAssignmentNotification(
                    admin, assignment, title, message,
                    Notification.NotificationType.REVISION_REQUESTED
            );
            notification.setImportant(true);
            notificationRepository.save(notification);
        }
    }

    /**
     * Notify user when revision is completed
     */
    public void notifyUserRevisionCompleted(Assignment assignment) {
        User user = assignment.getUser();
        String title = "✨ Revision Completed";
        String message = "Your revision for '" + assignment.getTitle() +
                "' has been completed. Please check the updated solution.";

        createAssignmentNotification(user, assignment, title, message,
                Notification.NotificationType.REVISION_COMPLETED);
    }

    /**
     * Notify user when revision is rejected
     */
    public void notifyUserRevisionRejected(Assignment assignment, String rejectionReason) {
        User user = assignment.getUser();
        String title = "⛔ Revision Rejected";
        String message = "Your revision request for '" + assignment.getTitle() +
                "' has been rejected. Reason: " + rejectionReason;

        createAssignmentNotification(user, assignment, title, message,
                Notification.NotificationType.REVISION_REJECTED);
    }

    /**
     * Get notifications for a user
     */
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndStatusOrderByCreatedAtDesc(
                user, Notification.NotificationStatus.UNREAD);
    }

    /**
     * Get unread notification count for a user
     */
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndStatus(
                user, Notification.NotificationStatus.UNREAD);
    }

    /**
     * Mark notification as read
     */
    public Notification markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Check if notification belongs to user
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to access this notification");
        }

        notification.markAsRead();
        return notificationRepository.save(notification);
    }

    /**
     * Mark all notifications as read for user
     */
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsRead(user, LocalDateTime.now());
    }

    /**
     * Archive notification
     */
    public void archiveNotification(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Check if notification belongs to user
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to access this notification");
        }

        notification.markAsArchived();
        notificationRepository.save(notification);
    }

    /**
     * Delete notification
     */
    public void deleteNotification(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Check if notification belongs to user
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to access this notification");
        }

        notificationRepository.delete(notification);
    }

    /**
     * Get admins appropriate for assignment type
     */
    private List<User> getAdminsForAssignment(Assignment assignment) {
        if (assignment.getType() == Assignment.AssignmentType.IT) {
            return userService.getAdminsBySpecialization(User.Specialization.IT);
        } else if (assignment.getType() == Assignment.AssignmentType.QUANTITY_SURVEYING) {
            return userService.getAdminsBySpecialization(User.Specialization.QUANTITY_SURVEYING);
        } else {
            return userService.getAllAdmins();
        }
    }

    /**
     * Get notification delivery status for admin
     */
    public List<Notification> getDeliveryStatusForAdmin(User admin, Long assignmentId) {
        return notificationRepository.findAssignmentNotifications(assignmentId,
                Arrays.asList(
                        Notification.NotificationType.SOLUTION_DELIVERED,
                        Notification.NotificationType.REVISION_COMPLETED
                ));
    }

    /**
     * Get recent notifications for dashboard - FIXED METHOD
     */
    public List<Notification> getRecentNotifications(User user, int limit) {
        // Use the alternative method that works with Spring Data JPA
        return notificationRepository.findTop5ByUserOrderByCreatedAtDesc(user);
    }

    /**
     * Create system notification for all users
     */
    public void createSystemNotification(String title, String message) {
        List<User> allUsers = userService.getAllUsers();
        for (User user : allUsers) {
            Notification notification = new Notification(user, title, message,
                    Notification.NotificationType.SYSTEM);
            notification.setImportant(true);
            notificationRepository.save(notification);
        }
    }

    /**
     * Create admin-only notification
     */
    public void createAdminNotification(String title, String message) {
        List<User> admins = userService.getAllAdmins();
        for (User admin : admins) {
            Notification notification = new Notification(admin, title, message,
                    Notification.NotificationType.ADMIN);
            notification.setImportant(true);
            notificationRepository.save(notification);
        }
    }
    /**
     * Notify user assignment approved with payment required
     */
    public void notifyUserAssignmentApprovedWithPayment(Assignment assignment, Payment payment) {
        String currencySymbol = payment.getCurrency().getSymbol();
        String amount = String.format("%.2f", payment.getAmount());

        Notification notification = new Notification();
        notification.setUser(assignment.getUser());
        notification.setType(Notification.NotificationType.PAYMENT_REQUIRED);
        notification.setTitle("💳 Payment Required - Assignment Approved");
        notification.setMessage(
                "Your assignment '" + assignment.getTitle() + "' has been approved! " +
                        "Complete payment of " + currencySymbol + " " + amount + " to start processing."
        );
        notification.setRelatedAssignmentId(assignment.getId());
        notification.setImportant(true);
        notification.setStatus(Notification.NotificationStatus.UNREAD);
        notification.setCreatedAt(java.time.LocalDateTime.now());

        notificationRepository.save(notification);
    }

    /**
     * Notify user payment received
     */
    public void notifyUserPaymentReceived(Payment payment) {
        String currencySymbol = payment.getCurrency().getSymbol();
        String amount = String.format("%.2f", payment.getAmount());

        Notification notification = new Notification();
        notification.setUser(payment.getUser());
        notification.setType(Notification.NotificationType.PAYMENT_CONFIRMED);
        notification.setTitle("✅ Payment Received!");
        notification.setMessage(
                "Payment of " + currencySymbol + " " + amount + " received for '" +
                        payment.getAssignment().getTitle() + "'. Admin will start working now!"
        );
        notification.setRelatedAssignmentId(payment.getAssignment().getId());
        notification.setImportant(true);
        notification.setStatus(Notification.NotificationStatus.UNREAD);
        notification.setCreatedAt(java.time.LocalDateTime.now());

        notificationRepository.save(notification);
    }

    /**
     * Notify admin payment received
     */
    public void notifyAdminPaymentReceived(Payment payment) {
        List<User> admins;
        Assignment assignment = payment.getAssignment();

        if (assignment.getType() == Assignment.AssignmentType.IT) {
            admins = userRepository.findByRoleAndSpecialization("ADMIN", User.Specialization.IT);
        } else if (assignment.getType() == Assignment.AssignmentType.QUANTITY_SURVEYING) {
            admins = userRepository.findByRoleAndSpecialization("ADMIN", User.Specialization.QUANTITY_SURVEYING);
        } else {
            admins = userRepository.findByRole("ADMIN");
        }

        List<User> bothAdmins = userRepository.findByRoleAndSpecialization("ADMIN", User.Specialization.BOTH);
        admins.addAll(bothAdmins);

        String currencySymbol = payment.getCurrency().getSymbol();
        String amount = String.format("%.2f", payment.getAmount());

        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setUser(admin);
            notification.setType(Notification.NotificationType.PAYMENT_RECEIVED);
            notification.setTitle("💰 Payment Received - Start Working");
            notification.setMessage(
                    "Payment of " + currencySymbol + " " + amount + " received for '" +
                            assignment.getTitle() + "'. You can start working now!"
            );
            notification.setRelatedAssignmentId(assignment.getId());
            notification.setImportant(true);
            notification.setStatus(Notification.NotificationStatus.UNREAD);
            notification.setCreatedAt(java.time.LocalDateTime.now());

            notificationRepository.save(notification);
        }
    }

}