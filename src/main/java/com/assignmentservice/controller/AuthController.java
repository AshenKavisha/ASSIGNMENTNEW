package com.assignmentservice.controller;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Notification;
import com.assignmentservice.model.User;
import com.assignmentservice.service.AssignmentService;
import com.assignmentservice.service.NotificationService;
import com.assignmentservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private NotificationService notificationService;

    // ==========================================
    // REGISTRATION ENDPOINTS
    // ==========================================

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute User user,
                               BindingResult result,
                               Model model,
                               RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "register";
        }

        try {
            if (userService.getUserByEmail(user.getEmail()).isPresent()) {
                model.addAttribute("error", "Email already registered");
                return "register";
            }

            userService.registerUser(user);

            return "redirect:http://localhost:5173/verification-sent";

        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }

    // ==========================================
    // EMAIL VERIFICATION ENDPOINTS
    // ==========================================

    @GetMapping("/verification-sent")
    public String showVerificationSent(Model model) {
        return "verification-sent";
    }

    @GetMapping("/verify")
    public String verifyEmail(@RequestParam("token") String token,
                              RedirectAttributes redirectAttributes) {
        try {
            boolean verified = userService.verifyEmail(token);

            if (verified) {
                return "redirect:http://localhost:5173/login?message=Email verified successfully! You can now login.";
            } else {
                return "redirect:http://localhost:5173/resend-verification?error=Invalid or expired verification link. Please request a new one.";
            }

        } catch (Exception e) {
            return "redirect:http://localhost:5173/login?error=Verification failed";
        }
    }

    @GetMapping("/resend-verification")
    public String showResendVerification() {
        return "resend-verification";
    }

    @PostMapping("/resend-verification")
    public String resendVerification(@RequestParam("email") String email,
                                     RedirectAttributes redirectAttributes) {
        try {
            boolean sent = userService.resendVerificationEmail(email);

            if (sent) {
                return "redirect:http://localhost:5173/verification-sent?message=Verification email sent! Please check your inbox.";
            } else {
                return "redirect:http://localhost:5173/resend-verification?error=Could not send verification email.";
            }

        } catch (Exception e) {
            return "redirect:http://localhost:5173/resend-verification?error=An error occurred. Please try again.";
        }
    }

    // ==========================================
    // PASSWORD RESET ENDPOINTS
    // ==========================================

    @GetMapping("/forgot-password")
    public String showForgotPasswordForm() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String processForgotPassword(@RequestParam("email") String email,
                                        RedirectAttributes redirectAttributes) {
        try {
            userService.createPasswordResetToken(email);
            return "redirect:http://localhost:5173/forgot-password?message=If an account exists with that email, you will receive password reset instructions.";
        } catch (Exception e) {
            return "redirect:http://localhost:5173/forgot-password?error=An error occurred. Please try again.";
        }
    }

    @GetMapping("/reset-password")
    public String showResetPasswordForm(@RequestParam("token") String token,
                                        Model model,
                                        RedirectAttributes redirectAttributes) {
        try {
            boolean isValid = userService.validatePasswordResetToken(token);

            if (!isValid) {
                return "redirect:http://localhost:5173/forgot-password?error=Invalid or expired password reset link. Please request a new one.";
            }

            return "redirect:http://localhost:5173/reset-password?token=" + token;

        } catch (Exception e) {
            return "redirect:http://localhost:5173/forgot-password?error=An error occurred. Please try again.";
        }
    }

    @PostMapping("/reset-password")
    public String processResetPassword(@RequestParam("token") String token,
                                       @RequestParam("password") String password,
                                       @RequestParam("confirmPassword") String confirmPassword,
                                       RedirectAttributes redirectAttributes) {
        try {
            if (!password.equals(confirmPassword)) {
                return "redirect:http://localhost:5173/reset-password?token=" + token + "&error=Passwords do not match";
            }

            if (password.length() < 6) {
                return "redirect:http://localhost:5173/reset-password?token=" + token + "&error=Password must be at least 6 characters long";
            }

            boolean success = userService.resetPassword(token, password);

            if (success) {
                return "redirect:http://localhost:5173/login?message=Password reset successfully! You can now login with your new password.";
            } else {
                return "redirect:http://localhost:5173/forgot-password?error=Invalid or expired reset link. Please request a new one.";
            }

        } catch (Exception e) {
            return "redirect:http://localhost:5173/forgot-password?error=An error occurred. Please try again.";
        }
    }

    // ==========================================
    // LOGIN & LOGOUT ENDPOINTS
    // ==========================================

    @GetMapping("/login")
    public String showLoginForm(@RequestParam(value = "error", required = false) String error,
                                @RequestParam(value = "logout", required = false) String logout,
                                @RequestParam(value = "registered", required = false) String registered,
                                @RequestParam(value = "redirect", required = false) String redirect,
                                @RequestParam(value = "unverified", required = false) String unverified,
                                Model model) {
        if (error != null) {
            model.addAttribute("error", "Invalid email or password!");
        }
        if (logout != null) {
            model.addAttribute("message", "You have been logged out successfully.");
        }
        if (registered != null) {
            model.addAttribute("message", "Registration successful! Please login.");
        }
        if (unverified != null) {
            model.addAttribute("error", "Please verify your email before logging in.");
        }
        if (redirect != null) {
            model.addAttribute("redirectUrl", redirect);
        }
        return "login";
    }

    @GetMapping("/dashboard")
    public String dashboard(@RequestParam(value = "success", required = false) String success,
                            @RequestParam(value = "error", required = false) String error,
                            HttpSession session,
                            Model model) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()
                    && !authentication.getPrincipal().equals("anonymousUser")) {
                String email = authentication.getName();

                Optional<User> userOptional = userService.getUserByEmail(email);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();

                    if (!user.isEmailVerified()) {
                        return "redirect:http://localhost:5173/login?unverified=true";
                    }

                    model.addAttribute("user", user);
                    session.setAttribute("user", user);

                    List<Notification> notifications = notificationService.getRecentNotificationsByUserId(user.getId(), 10);
                    long unreadCount = notifications.stream()
                            .filter(n -> "UNREAD".equals(n.getStatus().name()))
                            .count();

                    model.addAttribute("notifications", notifications);
                    model.addAttribute("notificationCount", unreadCount);

                    List<Assignment> userAssignments = assignmentService.getByUserId(user.getId());
                    long deliveredCount = userAssignments.stream()
                            .filter(a -> "DELIVERED".equals(a.getStatus().name()))
                            .count();

                    model.addAttribute("deliveredCount", deliveredCount);

                    if ("ADMIN".equals(user.getRole())) {
                        try {
                            long totalAssignments = assignmentService.countAll();
                            long pendingCount = assignmentService.countByStatus("PENDING");

                            model.addAttribute("totalAssignments", totalAssignments);
                            model.addAttribute("pendingAssignmentsCount", pendingCount);
                        } catch (Exception e) {
                            model.addAttribute("pendingAssignmentsCount", 0);
                            model.addAttribute("totalAssignments", 0);
                        }
                    }

                    if (success != null) {
                        model.addAttribute("success", success);
                    }
                    if (error != null) {
                        model.addAttribute("error", error);
                    }

                    return "dashboard";
                }
            }

            return "redirect:http://localhost:5173/login";

        } catch (Exception e) {
            System.err.println("Dashboard Error: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("error", "Error loading dashboard: " + e.getMessage());
            return "dashboard";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, null, auth);
        }
        return "redirect:http://localhost:5173/login?logout=true";
    }

    // ==========================================
    // REST API ENDPOINTS FOR REACT FRONTEND
    // ==========================================

    @GetMapping("/api/auth/me")
    @ResponseBody
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Optional<User> userOpt = userService.getUserByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("name", user.getFullName());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(404).build();
    }

    @GetMapping("/api/admin/stats")
    @ResponseBody
    public ResponseEntity<?> getAdminStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAssignments", assignmentService.countAll());
        stats.put("pendingCount", assignmentService.countByStatus("PENDING"));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/api/admin/assignments")
    @ResponseBody
    public ResponseEntity<?> getAdminAssignmentsApi(
            @RequestParam(required = false) String status) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Optional<User> currentAdminOpt = userService.getUserByEmail(email);

        if (!currentAdminOpt.isPresent()) {
            return ResponseEntity.status(401).build();
        }

        User currentAdmin = currentAdminOpt.get();
        List<Assignment> allAssignments = assignmentService.getAllAssignmentsByAdminSpecialization(currentAdmin);

        if (status != null && !status.isEmpty()) {
            allAssignments = allAssignments.stream()
                    .filter(a -> a.getStatus().name().equals(status))
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> result = allAssignments.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("title", a.getTitle());
            map.put("subject", a.getSubject());
            map.put("type", a.getType());
            map.put("status", a.getStatus());
            map.put("price", a.getPrice());
            map.put("deadline", a.getDeadline() != null ? a.getDeadline().toString() : null);
            map.put("description", a.getDescription());
            map.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);
            map.put("revisionsUsed", a.getRevisionRequests() != null ? a.getRevisionRequests().size() : 0);
            map.put("maxRevisions", 2);

            Map<String, Object> user = new HashMap<>();
            user.put("fullName", a.getUser() != null ? a.getUser().getFullName() : "");
            user.put("email", a.getUser() != null ? a.getUser().getEmail() : "");
            map.put("user", user);

            if (a.getAssignedAdmin() != null) {
                Map<String, Object> admin = new HashMap<>();
                admin.put("id", a.getAssignedAdmin().getId());
                admin.put("fullName", a.getAssignedAdmin().getFullName());
                map.put("assignedAdmin", admin);
            }

            if (a.getRevisionRequests() != null && !a.getRevisionRequests().isEmpty()) {
                var latestRevision = a.getRevisionRequests().get(0);
                Map<String, Object> rev = new HashMap<>();
                rev.put("id", latestRevision.getId());
                rev.put("reason", latestRevision.getReason());
                rev.put("requestedAt", latestRevision.getRequestedAt().toString());
                rev.put("status", latestRevision.getStatus());
                map.put("latestRevision", rev);
            }

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/admin/assignments/{id}")
    @ResponseBody
    public ResponseEntity<?> getAssignmentById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Optional<User> currentAdminOpt = userService.getUserByEmail(email);
        if (!currentAdminOpt.isPresent()) return ResponseEntity.status(401).build();

        User currentAdmin = currentAdminOpt.get();
        Optional<Assignment> assignmentOpt = assignmentService.getAssignmentByIdForAdmin(id, currentAdmin);

        if (!assignmentOpt.isPresent()) return ResponseEntity.status(404).build();

        Assignment a = assignmentOpt.get();
        Map<String, Object> map = new HashMap<>();
        map.put("id", a.getId());
        map.put("title", a.getTitle());
        map.put("subject", a.getSubject());
        map.put("type", a.getType());
        map.put("status", a.getStatus());
        map.put("price", a.getPrice());
        map.put("deadline", a.getDeadline());
        map.put("description", a.getDescription());
        map.put("additionalRequirements", a.getAdditionalRequirements());
        map.put("adminNotes", a.getAdminNotes());
        map.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);

        Map<String, Object> user = new HashMap<>();
        user.put("fullName", a.getUser() != null ? a.getUser().getFullName() : "");
        user.put("email", a.getUser() != null ? a.getUser().getEmail() : "");
        map.put("user", user);

        if (a.getAssignedAdmin() != null) {
            Map<String, Object> admin = new HashMap<>();
            admin.put("fullName", a.getAssignedAdmin().getFullName());
            map.put("assignedAdmin", admin);
        }

        if (a.getRevisionRequests() != null) {
            List<Map<String, Object>> revisions = a.getRevisionRequests().stream().map(r -> {
                Map<String, Object> rev = new HashMap<>();
                rev.put("reason", r.getReason());
                rev.put("requestedAt", r.getRequestedAt() != null ? r.getRequestedAt().toString() : "");
                rev.put("status", r.getStatus());
                return rev;
            }).collect(Collectors.toList());
            map.put("revisionRequests", revisions);
        }

        return ResponseEntity.ok(map);
    }

    // ==========================================
    // NEW: APPROVE / REJECT / HANDOVER ENDPOINTS
    // Called by PendingAssignments.jsx
    // ==========================================

    /**
     * Approve a pending assignment (no handover).
     * Sets status → APPROVED, saves the price, sends email payment link to the student.
     *
     * POST /api/admin/assignments/{id}/approve
     * Body: { "price": 1500.00, "currency": "LKR" }
     */
    @PostMapping("/api/admin/assignments/{id}/approve")
    @ResponseBody
    public ResponseEntity<?> approveAssignment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser"))
            return ResponseEntity.status(401).build();

        String email = authentication.getName();
        Optional<User> adminOpt = userService.getUserByEmail(email);
        if (!adminOpt.isPresent()) return ResponseEntity.status(401).build();

        User currentAdmin = adminOpt.get();

        try {
            double price    = Double.parseDouble(body.getOrDefault("price", 0).toString());
            String currency = body.getOrDefault("currency", "LKR").toString();

            Assignment approved = assignmentService.approveAssignment(id, price, currency, currentAdmin);
            if (approved == null) return ResponseEntity.status(404).body("Assignment not found or access denied.");

            Map<String, Object> response = new HashMap<>();
            response.put("id", approved.getId());
            response.put("status", approved.getStatus());
            response.put("price", approved.getPrice());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to approve assignment: " + e.getMessage());
        }
    }

    /**
     * Reject a pending assignment.
     * Sets status → REJECTED, notifies the student.
     *
     * POST /api/admin/assignments/{id}/reject
     * Body: (optional) { "reason": "Does not meet requirements" }
     */
    @PostMapping("/api/admin/assignments/{id}/reject")
    @ResponseBody
    public ResponseEntity<?> rejectAssignment(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser"))
            return ResponseEntity.status(401).build();

        String email = authentication.getName();
        Optional<User> adminOpt = userService.getUserByEmail(email);
        if (!adminOpt.isPresent()) return ResponseEntity.status(401).build();

        User currentAdmin = adminOpt.get();
        String reason = (body != null) ? body.getOrDefault("reason", "").toString() : "";

        try {
            Assignment rejected = assignmentService.rejectAssignment(id, reason, currentAdmin);
            if (rejected == null) return ResponseEntity.status(404).body("Assignment not found or access denied.");

            Map<String, Object> response = new HashMap<>();
            response.put("id", rejected.getId());
            response.put("status", rejected.getStatus());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to reject assignment: " + e.getMessage());
        }
    }

    /**
     * Approve a pending assignment AND hand it over to a specific admin.
     * Sets status → IN_PROGRESS, saves price, assigns the chosen admin, notifies both parties.
     *
     * POST /api/admin/assignments/{id}/handover
     * Body: { "price": 1500.00, "currency": "LKR", "adminId": 3 }
     */
    @PostMapping("/api/admin/assignments/{id}/handover")
    @ResponseBody
    public ResponseEntity<?> handoverAssignment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser"))
            return ResponseEntity.status(401).build();

        String email = authentication.getName();
        Optional<User> adminOpt = userService.getUserByEmail(email);
        if (!adminOpt.isPresent()) return ResponseEntity.status(401).build();

        User currentAdmin = adminOpt.get();

        try {
            double price    = Double.parseDouble(body.getOrDefault("price", 0).toString());
            String currency = body.getOrDefault("currency", "LKR").toString();
            Long   assignedAdminId = Long.parseLong(body.getOrDefault("adminId", 0).toString());

            Optional<User> assignedAdminOpt = userService.getUserById(assignedAdminId);
            if (!assignedAdminOpt.isPresent())
                return ResponseEntity.status(404).body("Target admin not found.");

            User assignedAdmin = assignedAdminOpt.get();

            Assignment handed = assignmentService.handoverAssignment(id, price, currency, assignedAdmin, currentAdmin);
            if (handed == null) return ResponseEntity.status(404).body("Assignment not found or access denied.");

            Map<String, Object> response = new HashMap<>();
            response.put("id", handed.getId());
            response.put("status", handed.getStatus());
            response.put("price", handed.getPrice());
            response.put("assignedAdmin", assignedAdmin.getFullName());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to handover assignment: " + e.getMessage());
        }
    }

    // ==========================================
    // CUSTOMER & ADMIN LIST ENDPOINTS
    // ==========================================

    @GetMapping("/api/admin/customers")
    @ResponseBody
    public ResponseEntity<?> getCustomers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser"))
            return ResponseEntity.status(401).build();

        String email = authentication.getName();
        Optional<User> currentAdminOpt = userService.getUserByEmail(email);
        if (!currentAdminOpt.isPresent()) return ResponseEntity.status(401).build();

        List<User> allCustomers = userService.getAllCustomers();

        List<Map<String, Object>> customerList = allCustomers.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("fullName", c.getFullName());
            map.put("email", c.getEmail());
            map.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);

            List<Map<String, Object>> assignments = assignmentService.getByUserId(c.getId())
                    .stream().map(a -> {
                        Map<String, Object> am = new HashMap<>();
                        am.put("id", a.getId());
                        am.put("type", a.getType());
                        am.put("status", a.getStatus());
                        am.put("price", a.getPrice());
                        return am;
                    }).collect(Collectors.toList());
            map.put("assignments", assignments);
            return map;
        }).collect(Collectors.toList());

        long itCount = allCustomers.stream()
                .filter(c -> assignmentService.getByUserId(c.getId()).stream()
                        .anyMatch(a -> "IT".equals(String.valueOf(a.getType()))))
                .count();
        long qsCount = allCustomers.stream()
                .filter(c -> assignmentService.getByUserId(c.getId()).stream()
                        .anyMatch(a -> "QUANTITY_SURVEYING".equals(String.valueOf(a.getType()))))
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("customers", customerList);
        response.put("totalCustomers", allCustomers.size());
        response.put("itCustomerCount", itCount);
        response.put("qsCustomerCount", qsCount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/admin/customers/{id}")
    @ResponseBody
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser"))
            return ResponseEntity.status(401).build();

        Optional<User> customerOpt = userService.getUserById(id);
        if (!customerOpt.isPresent()) return ResponseEntity.status(404).build();

        User c = customerOpt.get();
        Map<String, Object> map = new HashMap<>();
        map.put("id", c.getId());
        map.put("fullName", c.getFullName());
        map.put("email", c.getEmail());
        map.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
        map.put("lastLogin", c.getLastLogin() != null ? c.getLastLogin().toString() : null);

        List<Map<String, Object>> assignments = assignmentService.getByUserId(c.getId())
                .stream().map(a -> {
                    Map<String, Object> am = new HashMap<>();
                    am.put("id", a.getId());
                    am.put("title", a.getTitle());
                    am.put("type", a.getType());
                    am.put("status", a.getStatus());
                    am.put("price", a.getPrice());
                    am.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);
                    return am;
                }).collect(Collectors.toList());
        map.put("assignments", assignments);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/api/admin/admins")
    @ResponseBody
    public ResponseEntity<?> getAllAdmins() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser"))
            return ResponseEntity.status(401).build();

        List<User> allAdmins = userService.getAllAdmins();

        List<Map<String, Object>> result = allAdmins.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("fullName", a.getFullName());
            map.put("email", a.getEmail());
            map.put("specialization", a.getSpecialization());
            map.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);

            List<Assignment> assignments = assignmentService.getAssignmentsByAssignedAdmin(a);
            long itCount = assignments.stream().filter(x -> "IT".equals(String.valueOf(x.getType()))).count();
            long qsCount = assignments.stream().filter(x -> "QUANTITY_SURVEYING".equals(String.valueOf(x.getType()))).count();
            map.put("itCount", itCount);
            map.put("qsCount", qsCount);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/user/profile")
    @ResponseBody
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser"))
            return ResponseEntity.status(401).build();

        String email = authentication.getName();
        Optional<User> userOpt = userService.getUserByEmail(email);
        if (!userOpt.isPresent()) return ResponseEntity.status(404).build();

        User user = userOpt.get();
        Map<String, Object> map = new HashMap<>();
        map.put("fullName", user.getFullName());
        map.put("email", user.getEmail());
        map.put("phoneNumber", user.getPhoneNumber());
        map.put("birthDate", user.getBirthDate());
        map.put("bio", user.getBio());
        map.put("workExperience", user.getWorkExperience());
        map.put("education", user.getEducation());
        map.put("skills", user.getSkills());
        map.put("location", user.getLocation());
        map.put("website", user.getWebsite());
        map.put("profilePicture", user.getProfilePicture());

        // Real assignments
        List<Map<String, Object>> assignments = assignmentService.getByUserId(user.getId())
                .stream().map(a -> {
                    Map<String, Object> am = new HashMap<>();
                    am.put("id", a.getId());
                    am.put("title", a.getTitle());
                    am.put("description", a.getDescription());
                    am.put("status", a.getStatus());
                    am.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toLocalDate().toString() : "");
                    return am;
                }).collect(Collectors.toList());
        map.put("assignments", assignments);
        map.put("feedbacks", List.of()); // Add feedback service call if available

        return ResponseEntity.ok(map);
    }

}