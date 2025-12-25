package com.assignmentservice.repository;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    // Find assignments by user
    List<Assignment> findByUser(User user);

    // Find assignments by status
    List<Assignment> findByStatus(Assignment.AssignmentStatus status);

    // Find assignments by status with pagination
    Page<Assignment> findByStatus(Assignment.AssignmentStatus status, Pageable pageable);

    // Find assignments by type
    List<Assignment> findByType(Assignment.AssignmentType type);

    // Find assignments by type and status with pagination
    Page<Assignment> findByTypeAndStatus(Assignment.AssignmentType type,
                                         Assignment.AssignmentStatus status,
                                         Pageable pageable);

    // Find all assignments ordered by creation date (newest first)
    List<Assignment> findAllByOrderByCreatedAtDesc();

    // Count assignments by status (for statistics)
    long countByStatus(Assignment.AssignmentStatus status);

    // Count assignments by type
    long countByType(Assignment.AssignmentType type);

    // Count assignments by type and status
    long countByTypeAndStatus(Assignment.AssignmentType type,
                              Assignment.AssignmentStatus status);

    // Find assignments by user and status
    List<Assignment> findByUserAndStatus(User user, Assignment.AssignmentStatus status);

    // Find assignments by user ordered by creation date
    List<Assignment> findByUserOrderByCreatedAtDesc(User user);

    // Find pending assignments ordered by creation date (for admin dashboard)
    List<Assignment> findByStatusOrderByCreatedAtDesc(Assignment.AssignmentStatus status);

    // Find assignments by user ID
    List<Assignment> findByUserId(Long userId);

    // Statistics methods with date filters
    long countByCreatedAtAfter(LocalDateTime startDate);

    long countByStatusAndCreatedAtAfter(Assignment.AssignmentStatus status,
                                        LocalDateTime startDate);

    // NEW: Count by type and date
    long countByTypeAndCreatedAtAfter(Assignment.AssignmentType type,
                                      LocalDateTime startDate);

    // NEW: Count by type, status and date
    long countByTypeAndStatusAndCreatedAtAfter(Assignment.AssignmentType type,
                                               Assignment.AssignmentStatus status,
                                               LocalDateTime startDate);

    // Revenue queries
    @Query("SELECT SUM(a.price) FROM Assignment a WHERE a.status = :status AND a.createdAt >= :startDate")
    Double sumPriceByStatusAndCreatedAtAfter(@Param("status") Assignment.AssignmentStatus status,
                                             @Param("startDate") LocalDateTime startDate);

    @Query("SELECT SUM(a.price) FROM Assignment a WHERE a.type = :type AND a.status = :status AND a.createdAt >= :startDate")
    Double sumPriceByTypeStatusAndCreatedAtAfter(@Param("type") Assignment.AssignmentType type,
                                                 @Param("status") Assignment.AssignmentStatus status,
                                                 @Param("startDate") LocalDateTime startDate);

    // ============ NEW METHODS FOR FETCHING ASSIGNMENTS BY EXCLUDING STATUSES ============
    // These methods allow querying for assignments excluding certain statuses
    // Useful for showing all "active" assignments (excluding PENDING and REJECTED)

    /**
     * Find all assignments whose status is NOT in the provided list
     * Example: Fetch all assignments except PENDING and REJECTED
     */
    Page<Assignment> findByStatusNotIn(List<Assignment.AssignmentStatus> statuses, Pageable pageable);

    /**
     * Find assignments by type, excluding certain statuses
     * Example: Fetch all IT assignments except PENDING and REJECTED
     */
    Page<Assignment> findByTypeAndStatusNotIn(Assignment.AssignmentType type,
                                              List<Assignment.AssignmentStatus> statuses,
                                              Pageable pageable);

    /**
     * Count assignments by type, excluding certain statuses
     * Example: Count all QS assignments except PENDING and REJECTED
     */
    long countByTypeAndStatusNotIn(Assignment.AssignmentType type,
                                   List<Assignment.AssignmentStatus> statuses);
}