package com.assignmentservice.controller;

import com.assignmentservice.model.Feedback;
import com.assignmentservice.model.User;
import com.assignmentservice.service.FeedbackService;
import com.assignmentservice.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private UserService userService;

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
}