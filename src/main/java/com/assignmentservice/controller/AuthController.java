package com.assignmentservice.controller;

import com.assignmentservice.model.User;
import com.assignmentservice.service.AssignmentService;
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

import java.util.Optional;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AssignmentService assignmentService;

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute User user,
                               BindingResult result,
                               Model model) {
        if (result.hasErrors()) {
            return "register";
        }

        try {
            userService.registerUser(user);
            return "redirect:/login?registered=true";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }

    @GetMapping("/login")
    public String showLoginForm(@RequestParam(value = "error", required = false) String error,
                                @RequestParam(value = "logout", required = false) String logout,
                                @RequestParam(value = "registered", required = false) String registered,
                                @RequestParam(value = "redirect", required = false) String redirect,
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
                model.addAttribute("user", user);
                // Also set user in session for compatibility
                session.setAttribute("user", user);

                // Add admin statistics if user is admin
                if ("ADMIN".equals(user.getRole())) {
                    try {
                        int pendingAssignmentsCount = assignmentService.getPendingAssignments().size();
                        long totalAssignments = assignmentService.getAllAssignments().size();

                        model.addAttribute("pendingAssignmentsCount", pendingAssignmentsCount);
                        model.addAttribute("totalAssignments", totalAssignments);
                    } catch (Exception e) {
                        // If assignment service methods are not available yet, set default values
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
        // Spring Security logout
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, null, auth);
        }
        return "redirect:/login?logout=true";
    }
}