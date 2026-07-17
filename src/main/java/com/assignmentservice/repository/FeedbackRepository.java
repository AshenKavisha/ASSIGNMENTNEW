package com.assignmentservice.repository;

import com.assignmentservice.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findAllByOrderByCreatedAtDesc();

    @Query("SELECT f FROM Feedback f JOIN FETCH f.user ORDER BY f.createdAt DESC")
    List<Feedback> findAllWithUserOrderByCreatedAtDesc();
}


