package com.assignmentservice.controller;

import com.assignmentservice.model.Feedback;
import com.assignmentservice.model.User;
import com.assignmentservice.service.FeedbackService;
import com.assignmentservice.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private UserService userService;

    private static final DateTimeFormatter DISPLAY_FORMAT =
            DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a");

    @GetMapping("/submit")
    public String showFeedbackForm(Model model, HttpSession session) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            session.setAttribute("user", user);

            // Add recent feedbacks and average rating to model
            model.addAttribute("feedback", new Feedback());

            // ✅ FIXED: Changed "recentFeedbacks" to "pastFeedbacks"
            List<Feedback> recentFeedbacks = feedbackService.getRecentFeedbacks();
            model.addAttribute("pastFeedbacks", recentFeedbacks);

            model.addAttribute("averageRating", feedbackService.getAverageRating());

            // DEBUG - Remove after testing
            System.out.println("✅ Loaded " + recentFeedbacks.size() + " feedbacks for display");

            return "submit-feedback";
        }

        return "redirect:/login?redirect=/feedback/submit";
    }

    @PostMapping("/submit")
    public String submitFeedback(@Valid @ModelAttribute Feedback feedback,
                                 BindingResult result,
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

                if (result.hasErrors()) {
                    // ✅ ALSO ADD HERE: Re-populate feedbacks on validation error
                    model.addAttribute("pastFeedbacks", feedbackService.getRecentFeedbacks());
                    return "submit-feedback";
                }

                feedbackService.createFeedback(feedback, user);
                // Also set user in session for consistency
                session.setAttribute("user", user);
                return "redirect:/dashboard?success=Thank you for your feedback!";
            }
        }

        return "redirect:/login";
    }

    @GetMapping("/all")
    public String viewAllFeedbacks(Model model) {
        model.addAttribute("feedbacks", feedbackService.getAllFeedbacks());
        model.addAttribute("averageRating", feedbackService.getAverageRating());
        return "all-feedbacks";
    }

    // ============================================
    // JSON API METHODS — for the React frontend
    // ============================================

    /**
     * JSON version of the recent-feedbacks list shown on the submit-feedback
     * page. Lives at GET /feedback/api/recent (this controller's class-level
     * @RequestMapping("/feedback") applies, so the real path is
     * /feedback/api/recent — the React frontend should call that exact path).
     */
    @GetMapping("/api/recent")
    @ResponseBody
    public ResponseEntity<?> getRecentFeedbacksApi() {
        List<Feedback> recentFeedbacks = feedbackService.getRecentFeedbacks();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Feedback fb : recentFeedbacks) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", fb.getId());
            item.put("rating", fb.getRating());
            item.put("message", fb.getMessage());
            item.put("createdAt", formatDate(fb.getCreatedAt()));

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("fullName", fb.getUser() != null ? fb.getUser().getFullName() : "Anonymous");
            item.put("user", userMap);

            result.add(item);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("feedbacks", result);
        response.put("averageRating", feedbackService.getAverageRating());

        return ResponseEntity.ok(response);
    }

    public static class FeedbackSubmitRequest {
        public int rating;
        public String message;
    }

    /**
     * JSON version of submitFeedback() above, for the React frontend.
     * Lives at POST /feedback/api/submit (same class-level prefix note as
     * above — the real path is /feedback/api/submit).
     */
    @PostMapping("/api/submit")
    @ResponseBody
    public ResponseEntity<?> submitFeedbackApi(@RequestBody FeedbackSubmitRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }
        User user = userOptional.get();

        if (request.rating < 1 || request.rating > 5) {
            return ResponseEntity.badRequest().body(Map.of("error", "Rating must be between 1 and 5"));
        }
        if (request.message == null || request.message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please share a message with your feedback"));
        }

        try {
            Feedback feedback = new Feedback();
            feedback.setRating(request.rating);
            feedback.setMessage(request.message.trim());

            feedbackService.createFeedback(feedback, user);

            return ResponseEntity.ok(Map.of("success", true, "message", "Thank you for your feedback!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to submit feedback: " + e.getMessage()));
        }
    }

    private String formatDate(Object dateValue) {
        if (dateValue == null) return null;
        try {
            if (dateValue instanceof LocalDateTime ldt) {
                return ldt.format(DISPLAY_FORMAT);
            }
            // Fall back to parsing if it's stored/returned as a String
            return LocalDateTime.parse(dateValue.toString()).format(DISPLAY_FORMAT);
        } catch (Exception e) {
            return dateValue.toString();
        }
    }
}