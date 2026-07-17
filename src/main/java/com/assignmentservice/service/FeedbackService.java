package com.assignmentservice.service;

import com.assignmentservice.model.Feedback;
import com.assignmentservice.model.User;
import com.assignmentservice.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback createFeedback(Feedback feedback, User user) {
        feedback.setUser(user);
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAllWithUserOrderByCreatedAtDesc();
    }

    public List<Feedback> getRecentFeedbacks() {
        List<Feedback> allFeedbacks = getAllFeedbacks();
        return allFeedbacks.size() > 5 ? allFeedbacks.subList(0, 5) : allFeedbacks;
    }

    public double getAverageRating() {
        List<Feedback> feedbacks = getAllFeedbacks();
        if (feedbacks.isEmpty()) {
            return 0.0;
        }

        double sum = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .sum();
        return sum / feedbacks.size();
    }
}
