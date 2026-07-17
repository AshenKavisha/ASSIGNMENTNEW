package com.assignmentservice.repository;

import com.assignmentservice.model.RevisionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for RevisionRequest entity
 */
@Repository
public interface RevisionRequestRepository extends JpaRepository<RevisionRequest, Long> {

    /**
     * Find all revision requests for a specific assignment ordered by request date
     */
    List<RevisionRequest> findByAssignmentIdOrderByRequestedAtDesc(Long assignmentId);

    /**
     * Find all revision requests by status
     */
    List<RevisionRequest> findByStatusOrderByRequestedAtAsc(RevisionRequest.RevisionStatus status);

    /**
     * Count revision requests by status
     */
    long countByStatus(RevisionRequest.RevisionStatus status);

    /**
     * Check if an assignment has a pending revision request
     */
    boolean existsByAssignmentIdAndStatus(Long assignmentId, RevisionRequest.RevisionStatus status);

    /**
     * Find latest revision request for an assignment
     */
    RevisionRequest findFirstByAssignmentIdOrderByRequestedAtDesc(Long assignmentId);
}