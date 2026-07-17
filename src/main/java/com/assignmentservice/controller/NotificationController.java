package com.assignmentservice.controller;

import com.assignmentservice.model.Notification;
import com.assignmentservice.model.User;
import com.assignmentservice.service.NotificationService;
import com.assignmentservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    // -------------------------------------------------------------------------
    // Shared helper: resolve current authenticated user
    // -------------------------------------------------------------------------

    private Optional<User> currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return Optional.empty();
        }
        return userService.getUserByEmail(auth.getName());
    }

    // -------------------------------------------------------------------------
    // MVC Views  (/notifications/**)
    // -------------------------------------------------------------------------

    /**
     * View all notifications — handles /notifications, /notifications/, /notifications/inbox
     */
    @GetMapping({"/notifications", "/notifications/", "/notifications/inbox"})
    public String viewNotifications(Model model) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return "redirect:/login";

        List<Notification> notifications = notificationService.getUserNotifications(userOpt.get());
        long unreadCount = notificationService.getUnreadCount(userOpt.get());

        model.addAttribute("notifications", notifications);
        model.addAttribute("unreadCount", unreadCount);
        model.addAttribute("user", userOpt.get());

        return "notifications/inbox";
    }

    /**
     * View unread notifications — /notifications/unread
     */
    @GetMapping("/notifications/unread")
    public String viewUnreadNotifications(Model model) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return "redirect:/login";

        List<Notification> notifications = notificationService.getUnreadNotifications(userOpt.get());
        long unreadCount = notificationService.getUnreadCount(userOpt.get());

        model.addAttribute("notifications", notifications);
        model.addAttribute("unreadCount", unreadCount);
        model.addAttribute("user", userOpt.get());
        model.addAttribute("filter", "unread");

        return "notifications/inbox";
    }

    /**
     * Mark as read via GET (MVC) — /notifications/{id}/read
     */
    @GetMapping("/notifications/{id}/read")
    public String markAsReadGet(@PathVariable Long id,
                                @RequestParam(required = false) String redirectUrl,
                                RedirectAttributes redirectAttributes) {
        return markAsReadMvc(id, redirectUrl, redirectAttributes);
    }

    /**
     * Mark as read via POST (MVC) — /notifications/{id}/read
     */
    @PostMapping("/notifications/{id}/read")
    public String markAsReadPost(@PathVariable Long id,
                                 @RequestParam(required = false) String redirectUrl,
                                 RedirectAttributes redirectAttributes) {
        return markAsReadMvc(id, redirectUrl, redirectAttributes);
    }

    private String markAsReadMvc(Long id, String redirectUrl, RedirectAttributes redirectAttributes) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return "redirect:/login";

        try {
            notificationService.markAsRead(id, userOpt.get());
            redirectAttributes.addFlashAttribute("success", "Notification marked as read");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
        }

        if (redirectUrl != null && !redirectUrl.isEmpty()) {
            return "redirect:" + redirectUrl;
        }
        return "redirect:/notifications";
    }

    /**
     * Mark all as read (MVC) — POST /notifications/mark-all-read
     */
    @PostMapping("/notifications/mark-all-read")
    public String markAllAsReadMvc(RedirectAttributes redirectAttributes) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return "redirect:/login";

        try {
            notificationService.markAllAsRead(userOpt.get());
            redirectAttributes.addFlashAttribute("success", "All notifications marked as read");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
        }

        return "redirect:/notifications";
    }

    /**
     * Archive notification (MVC) — POST /notifications/{id}/archive
     */
    @PostMapping("/notifications/{id}/archive")
    public String archiveNotificationMvc(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return "redirect:/login";

        try {
            notificationService.archiveNotification(id, userOpt.get());
            redirectAttributes.addFlashAttribute("success", "Notification archived");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
        }

        return "redirect:/notifications";
    }

    /**
     * Delete notification (MVC) — POST /notifications/{id}/delete
     */
    @PostMapping("/notifications/{id}/delete")
    public String deleteNotificationMvc(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return "redirect:/login";

        try {
            notificationService.deleteNotification(id, userOpt.get());
            redirectAttributes.addFlashAttribute("success", "Notification deleted");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
        }

        return "redirect:/notifications";
    }

    // -------------------------------------------------------------------------
    // REST API  (/api/notifications/**)
    // -------------------------------------------------------------------------

    /**
     * GET /api/notifications — returns full notification list as JSON
     */
    @GetMapping("/api/notifications")
    @ResponseBody
    public ResponseEntity<?> getNotifications() {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        List<Map<String, Object>> result = notificationService
                .getUserNotifications(userOpt.get())
                .stream()
                .map(n -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", n.getId());
                    map.put("title", n.getTitle());
                    map.put("message", n.getMessage());
                    map.put("type", n.getType());
                    map.put("status", n.getStatus());
                    map.put("important", n.isImportant());
                    map.put("actionUrl", n.getActionUrl());
                    map.put("icon", n.getIcon());
                    map.put("colorClass", n.getColorClass());
                    map.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().toString() : null);
                    map.put("unread", n.isUnread());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/notifications/unread-count — returns unread count as JSON
     */
    @GetMapping("/api/notifications/unread-count")
    @ResponseBody
    public ResponseEntity<?> getUnreadCount() {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        Map<String, Object> response = new HashMap<>();
        response.put("count", notificationService.getUnreadCount(userOpt.get()));
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/notifications/latest — returns unread notifications as JSON (AJAX)
     */
    @GetMapping("/api/notifications/latest")
    @ResponseBody
    public ResponseEntity<?> getLatestNotifications() {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(notificationService.getUnreadNotifications(userOpt.get()));
    }

    /**
     * POST /api/notifications/{id}/read — mark single notification as read (REST)
     */
    @PostMapping("/api/notifications/{id}/read")
    @ResponseBody
    public ResponseEntity<?> markAsReadApi(@PathVariable Long id) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        try {
            notificationService.markAsRead(id, userOpt.get());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * POST /api/notifications/mark-all-read — mark all as read (REST)
     */
    @PostMapping("/api/notifications/mark-all-read")
    @ResponseBody
    public ResponseEntity<?> markAllAsReadApi() {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        notificationService.markAllAsRead(userOpt.get());
        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/notifications/{id}/archive — archive notification (REST)
     */
    @PostMapping("/api/notifications/{id}/archive")
    @ResponseBody
    public ResponseEntity<?> archiveApi(@PathVariable Long id) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        try {
            notificationService.archiveNotification(id, userOpt.get());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * DELETE /api/notifications/{id} — delete notification (REST)
     */
    @DeleteMapping("/api/notifications/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteApi(@PathVariable Long id) {
        Optional<User> userOpt = currentUser();
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        try {
            notificationService.deleteNotification(id, userOpt.get());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}