package com.assignmentservice.controller;

import com.assignmentservice.model.Feedback;
import com.assignmentservice.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/")
    public String home(Model model) {
        List<Feedback> recentFeedbacks = feedbackService.getRecentFeedbacks();
        model.addAttribute("feedbacks", recentFeedbacks);
        return "index";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }

    @GetMapping("/contact")
    public String contact() {
        return "contact";
    }
}