package com.assignmentservice.service;

import com.assignmentservice.model.Feedback;
import com.assignmentservice.model.User;
import com.assignmentservice.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    /**
     * Used by the public homepage testimonials carousel. Only shows 4-5 star
     * reviews so a stray 1-star submission doesn't end up as marketing copy.
     * getRecentFeedbacks() above is left untouched since /feedback/submit and
     * /feedback/all rely on it showing everything regardless of rating.
     */
    public List<Feedback> getTopRecentFeedbacks() {
        List<Feedback> filtered = getAllFeedbacks().stream()
                .filter(f -> f.getRating() != null && f.getRating() >= 4)
                .collect(Collectors.toList());
        return filtered.size() > 5 ? filtered.subList(0, 5) : filtered;
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