package com.assignmentservice.controller;

import com.assignmentservice.model.Notification;
import com.assignmentservice.model.User;
import com.assignmentservice.service.AssignmentService;
import com.assignmentservice.service.NotificationService;
import com.assignmentservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private NotificationService notificationService; // ADDED

    // ==========================================
    // REGISTRATION ENDPOINTS (Updated with Email Verification)
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
            // Check if user already exists
            if (userService.getUserByEmail(user.getEmail()).isPresent()) {
                model.addAttribute("error", "Email already registered");
                return "register";
            }

            // Register user (will send verification email automatically)
            userService.registerUser(user);

            // Redirect to verification sent page
            redirectAttributes.addFlashAttribute("email", user.getEmail());
            redirectAttributes.addFlashAttribute("message",
                    "Registration successful! Please check your email to verify your account.");

            return "redirect:/verification-sent";

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
                redirectAttributes.addFlashAttribute("message",
                        "Email verified successfully! You can now login.");
                return "redirect:/login";
            } else {
                redirectAttributes.addFlashAttribute("error",
                        "Invalid or expired verification link. Please request a new one.");
                return "redirect:/resend-verification";
            }

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "Verification failed: " + e.getMessage());
            return "redirect:/login";
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
                redirectAttributes.addFlashAttribute("email", email);
                redirectAttributes.addFlashAttribute("message",
                        "Verification email sent! Please check your inbox.");
                return "redirect:/verification-sent";
            } else {
                redirectAttributes.addFlashAttribute("error",
                        "Could not send verification email. Email may already be verified or not found.");
                return "redirect:/resend-verification";
            }

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "Error: " + e.getMessage());
            return "redirect:/resend-verification";
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

            redirectAttributes.addFlashAttribute("message",
                    "If an account exists with that email, you will receive password reset instructions.");

            return "redirect:/forgot-password";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "An error occurred. Please try again.");
            return "redirect:/forgot-password";
        }
    }

    @GetMapping("/reset-password")
    public String showResetPasswordForm(@RequestParam("token") String token,
                                        Model model,
                                        RedirectAttributes redirectAttributes) {
        try {
            boolean isValid = userService.validatePasswordResetToken(token);

            if (!isValid) {
                redirectAttributes.addFlashAttribute("error",
                        "Invalid or expired password reset link. Please request a new one.");
                return "redirect:/forgot-password";
            }

            model.addAttribute("token", token);
            return "reset-password";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "An error occurred. Please try again.");
            return "redirect:/forgot-password";
        }
    }

    @PostMapping("/reset-password")
    public String processResetPassword(@RequestParam("token") String token,
                                       @RequestParam("password") String password,
                                       @RequestParam("confirmPassword") String confirmPassword,
                                       RedirectAttributes redirectAttributes) {
        try {
            if (!password.equals(confirmPassword)) {
                redirectAttributes.addFlashAttribute("error", "Passwords do not match");
                redirectAttributes.addFlashAttribute("token", token);
                return "redirect:/reset-password?token=" + token;
            }

            if (password.length() < 6) {
                redirectAttributes.addFlashAttribute("error",
                        "Password must be at least 6 characters long");
                redirectAttributes.addFlashAttribute("token", token);
                return "redirect:/reset-password?token=" + token;
            }

            boolean success = userService.resetPassword(token, password);

            if (success) {
                redirectAttributes.addFlashAttribute("message",
                        "Password reset successfully! You can now login with your new password.");
                return "redirect:/login";
            } else {
                redirectAttributes.addFlashAttribute("error",
                        "Invalid or expired reset link. Please request a new one.");
                return "redirect:/forgot-password";
            }

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "An error occurred: " + e.getMessage());
            return "redirect:/forgot-password";
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
        // Get the authenticated user from Spring Security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
                && !authentication.getPrincipal().equals("anonymousUser")) {
            String email = authentication.getName();

            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Check if email is verified
                if (!user.isEmailVerified()) {
                    return "redirect:/login?unverified=true";
                }

                // *** FIXED: Load notifications explicitly ***
                List<Notification> notifications = notificationService.getUserNotifications(user);
                user.setNotifications(notifications);

                model.addAttribute("user", user);
                session.setAttribute("user", user);

                // Add admin statistics if user is admin
                if ("ADMIN".equals(user.getRole())) {
                    try {
                        int pendingAssignmentsCount = assignmentService.getPendingAssignments().size();
                        long totalAssignments = assignmentService.getAllAssignments().size();

                        model.addAttribute("pendingAssignmentsCount", pendingAssignmentsCount);
                        model.addAttribute("totalAssignments", totalAssignments);
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

        return "redirect:/login";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, null, auth);
        }
        return "redirect:/login?logout=true";
    }
}