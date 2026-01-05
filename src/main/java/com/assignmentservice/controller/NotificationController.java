// File: NotificationController.java
package com.assignmentservice.controller;

import com.assignmentservice.model.Notification;
import com.assignmentservice.model.User;
import com.assignmentservice.service.NotificationService;
import com.assignmentservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    /**
     * View all notifications - handles both /notifications and /notifications/inbox
     */
    @GetMapping({"", "/", "/inbox"})
    public String viewNotifications(Model model) {
        User user = getCurrentUser();
        if (user == null) {
            return "redirect:/login";
        }

        List<Notification> notifications = notificationService.getUserNotifications(user);
        long unreadCount = notificationService.getUnreadCount(user);

        model.addAttribute("notifications", notifications);
        model.addAttribute("unreadCount", unreadCount);
        model.addAttribute("user", user);

        return "notifications/inbox";
    }

    /**
     * View unread notifications
     */
    @GetMapping("/unread")
    public String viewUnreadNotifications(Model model) {
        User user = getCurrentUser();
        if (user == null) {
            return "redirect:/login";
        }

        List<Notification> notifications = notificationService.getUnreadNotifications(user);
        long unreadCount = notificationService.getUnreadCount(user);

        model.addAttribute("notifications", notifications);
        model.addAttribute("unreadCount", unreadCount);
        model.addAttribute("user", user);
        model.addAttribute("filter", "unread");

        return "notifications/inbox";
    }

    /**
     * Mark notification as read - FIXED: Now supports both GET and POST
     */
    @GetMapping("/{id}/read")
    public String markAsReadGet(@PathVariable Long id,
                                @RequestParam(required = false) String redirectUrl,
                                RedirectAttributes redirectAttributes) {
        return markAsReadInternal(id, redirectUrl, redirectAttributes);
    }

    @PostMapping("/{id}/read")
    public String markAsReadPost(@PathVariable Long id,
                                 @RequestParam(required = false) String redirectUrl,
                                 RedirectAttributes redirectAttributes) {
        return markAsReadInternal(id, redirectUrl, redirectAttributes);
    }

    /**
     * Internal method to mark notification as read
     */
    private String markAsReadInternal(Long id, String redirectUrl, RedirectAttributes redirectAttributes) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return "redirect:/login";
            }

            notificationService.markAsRead(id, user);
            redirectAttributes.addFlashAttribute("success", "Notification marked as read");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
        }

        // If redirectUrl is provided, redirect to it
        if (redirectUrl != null && !redirectUrl.isEmpty()) {
            return "redirect:" + redirectUrl;
        }
        return "redirect:/notifications";
    }

    /**
     * Mark all notifications as read
     */
    @PostMapping("/mark-all-read")
    public String markAllAsRead(RedirectAttributes redirectAttributes) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return "redirect:/login";
            }

            notificationService.markAllAsRead(user);
            redirectAttributes.addFlashAttribute("success", "All notifications marked as read");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
        }

        return "redirect:/notifications";
    }

    /**
     * Archive notification
     */
    @PostMapping("/{id}/archive")
    public String archiveNotification(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return "redirect:/login";
            }

            notificationService.archiveNotification(id, user);
            redirectAttributes.addFlashAttribute("success", "Notification archived");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
        }

        return "redirect:/notifications";
    }

    /**
     * Delete notification
     */
    @PostMapping("/{id}/delete")
    public String deleteNotification(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return "redirect:/login";
            }

            notificationService.deleteNotification(id, user);
            redirectAttributes.addFlashAttribute("success", "Notification deleted");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
        }

        return "redirect:/notifications";
    }

    /**
     * Get unread count (for AJAX)
     */
    @GetMapping("/unread-count")
    @ResponseBody
    public long getUnreadCount() {
        User user = getCurrentUser();
        if (user == null) {
            return 0;
        }
        return notificationService.getUnreadCount(user);
    }

    /**
     * Get latest notifications (for AJAX)
     */
    @GetMapping("/latest")
    @ResponseBody
    public List<Notification> getLatestNotifications() {
        User user = getCurrentUser();
        if (user == null) {
            return List.of();
        }
        return notificationService.getUnreadNotifications(user);
    }

    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);
        return userOptional.orElse(null);
    }
}