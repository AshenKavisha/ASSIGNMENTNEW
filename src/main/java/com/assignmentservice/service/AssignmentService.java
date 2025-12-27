package com.assignmentservice.service;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.RevisionRequest;
import com.assignmentservice.model.User;
import com.assignmentservice.repository.AssignmentRepository;
import com.assignmentservice.repository.RevisionRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Transactional
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private EmailService emailService;

    // NEW: Revision repository
    @Autowired
    private RevisionRequestRepository revisionRequestRepository;

    // ============================================
    // EXISTING METHODS (Your original code)
    // ============================================

    public Assignment createAssignment(Assignment assignment) {
        Assignment savedAssignment = assignmentRepository.save(assignment);
        emailService.sendAssignmentNotificationToAdmin(savedAssignment);
        return savedAssignment;
    }

    public Assignment saveAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getUserAssignments(User user) {
        return assignmentRepository.findByUser(user);
    }

    public List<Assignment> getPendingAssignments() {
        return assignmentRepository.findByStatus(Assignment.AssignmentStatus.PENDING);
    }

    public List<Assignment> getPendingAssignmentsByAdminSpecialization(User admin) {
        List<Assignment> allPending = assignmentRepository.findByStatus(Assignment.AssignmentStatus.PENDING);
        return filterAssignmentsBySpecialization(allPending, admin);
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Optional<Assignment> getAssignmentByIdForAdmin(Long id, User admin) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);

        if (assignmentOpt.isEmpty()) {
            return Optional.empty();
        }

        Assignment assignment = assignmentOpt.get();

        if (canAdminAccessAssignment(admin, assignment)) {
            return Optional.of(assignment);
        }

        return Optional.empty();
    }

    public Assignment updateAssignmentStatus(Long id, Assignment.AssignmentStatus status) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
        if (assignmentOpt.isPresent()) {
            Assignment assignment = assignmentOpt.get();
            assignment.setStatus(status);
            return assignmentRepository.save(assignment);
        }
        return null;
    }

    public Assignment updateAssignmentStatusForAdmin(Long id, Assignment.AssignmentStatus status, User admin) {
        Optional<Assignment> assignmentOpt = getAssignmentByIdForAdmin(id, admin);
        if (assignmentOpt.isPresent()) {
            Assignment assignment = assignmentOpt.get();
            assignment.setStatus(status);
            return assignmentRepository.save(assignment);
        }
        return null;
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public List<Assignment> getAllAssignmentsByAdminSpecialization(User admin) {
        List<Assignment> allAssignments = assignmentRepository.findAll();
        return filterAssignmentsBySpecialization(allAssignments, admin);
    }

    public long getTotalAssignmentsCount() {
        return assignmentRepository.count();
    }

    public long getTotalAssignmentsCountForAdmin(User admin) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return assignmentRepository.count();
        } else if (admin.getSpecialization() == User.Specialization.IT) {
            return assignmentRepository.countByType(Assignment.AssignmentType.IT);
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return assignmentRepository.countByType(Assignment.AssignmentType.QUANTITY_SURVEYING);
        }
        return 0;
    }

    public long getPendingAssignmentsCount() {
        return assignmentRepository.countByStatus(Assignment.AssignmentStatus.PENDING);
    }

    public long getPendingAssignmentsCountForAdmin(User admin) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return assignmentRepository.countByStatus(Assignment.AssignmentStatus.PENDING);
        } else if (admin.getSpecialization() == User.Specialization.IT) {
            return assignmentRepository.countByTypeAndStatus(Assignment.AssignmentType.IT, Assignment.AssignmentStatus.PENDING);
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return assignmentRepository.countByTypeAndStatus(Assignment.AssignmentType.QUANTITY_SURVEYING, Assignment.AssignmentStatus.PENDING);
        }
        return 0;
    }

    public List<Assignment> getAssignmentsByStatus(Assignment.AssignmentStatus status) {
        return assignmentRepository.findByStatus(status);
    }

    public List<Assignment> getAssignmentsByStatusForAdmin(Assignment.AssignmentStatus status, User admin) {
        List<Assignment> assignments = assignmentRepository.findByStatus(status);
        return filterAssignmentsBySpecialization(assignments, admin);
    }

    public boolean deleteAssignment(Long id) {
        if (assignmentRepository.existsById(id)) {
            assignmentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean deleteAssignmentForAdmin(Long id, User admin) {
        Optional<Assignment> assignmentOpt = getAssignmentByIdForAdmin(id, admin);
        if (assignmentOpt.isPresent()) {
            assignmentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Page<Assignment> getCompletedAssignments(Pageable pageable) {
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);
        return assignmentRepository.findByStatusNotIn(excludedStatuses, pageable);
    }

    public Page<Assignment> getCompletedAssignmentsByType(Assignment.AssignmentType type, Pageable pageable) {
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);
        return assignmentRepository.findByTypeAndStatusNotIn(type, excludedStatuses, pageable);
    }

    public Page<Assignment> getCompletedAssignmentsForAdmin(Pageable pageable, User admin) {
        if (!canAdminAccessAssignmentType(admin, null)) {
            return Page.empty(pageable);
        }

        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return getCompletedAssignments(pageable);
        }

        Assignment.AssignmentType adminType = getAdminAssignmentType(admin);
        if (adminType == null) {
            return Page.empty(pageable);
        }

        return getCompletedAssignmentsByType(adminType, pageable);
    }

    public Page<Assignment> getCompletedAssignmentsByTypeForAdmin(
            Assignment.AssignmentType type, Pageable pageable, User admin) {

        if (!canAdminAccessAssignmentType(admin, type)) {
            return Page.empty(pageable);
        }

        return getCompletedAssignmentsByType(type, pageable);
    }

    public long countCompletedAssignmentsByType(Assignment.AssignmentType type) {
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);
        return assignmentRepository.countByTypeAndStatusNotIn(type, excludedStatuses);
    }

    public Map<String, Object> getAssignmentStatistics(LocalDateTime startDate) {
        Map<String, Object> stats = new HashMap<>();

        long totalAssignments = assignmentRepository.countByCreatedAtAfter(startDate);

        long completedCount = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.COMPLETED, startDate);
        long deliveredCount = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.DELIVERED, startDate);
        long completed = completedCount + deliveredCount;

        long pending = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.PENDING, startDate);
        long inProgress = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.IN_PROGRESS, startDate);

        stats.put("totalAssignments", totalAssignments);
        stats.put("completed", completed);
        stats.put("pending", pending);
        stats.put("inProgress", inProgress);

        double completionRate = totalAssignments > 0 ? (completed * 100.0) / totalAssignments : 0;
        stats.put("completionRate", String.format("%.1f%%", completionRate));

        double avgResponseTime = 24.0;
        stats.put("avgResponseTime", String.format("%.1f hours", avgResponseTime));

        return stats;
    }

    public Map<String, Object> getAssignmentStatisticsForAdmin(LocalDateTime startDate, User admin) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return getAssignmentStatistics(startDate);
        }

        Map<String, Object> stats = new HashMap<>();
        Assignment.AssignmentType adminType = getAdminAssignmentType(admin);

        if (adminType == null) {
            return stats;
        }

        long totalAssignments = assignmentRepository.countByTypeAndCreatedAtAfter(adminType, startDate);

        long completedCount = assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                adminType, Assignment.AssignmentStatus.COMPLETED, startDate);
        long deliveredCount = assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                adminType, Assignment.AssignmentStatus.DELIVERED, startDate);
        long completed = completedCount + deliveredCount;

        long pending = assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                adminType, Assignment.AssignmentStatus.PENDING, startDate);
        long inProgress = assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                adminType, Assignment.AssignmentStatus.IN_PROGRESS, startDate);

        stats.put("totalAssignments", totalAssignments);
        stats.put("completed", completed);
        stats.put("pending", pending);
        stats.put("inProgress", inProgress);

        double completionRate = totalAssignments > 0 ? (completed * 100.0) / totalAssignments : 0;
        stats.put("completionRate", String.format("%.1f%%", completionRate));
        stats.put("avgResponseTime", "24.0 hours");

        return stats;
    }

    public Map<String, Object> getRevenueData(LocalDateTime startDate) {
        Map<String, Object> revenue = new HashMap<>();

        Double totalRevenue = assignmentRepository.sumPriceByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.COMPLETED, startDate);
        Double itRevenue = assignmentRepository.sumPriceByTypeStatusAndCreatedAtAfter(
                Assignment.AssignmentType.IT,
                Assignment.AssignmentStatus.COMPLETED,
                startDate
        );
        Double qsRevenue = assignmentRepository.sumPriceByTypeStatusAndCreatedAtAfter(
                Assignment.AssignmentType.QUANTITY_SURVEYING,
                Assignment.AssignmentStatus.COMPLETED,
                startDate
        );

        revenue.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        revenue.put("itRevenue", itRevenue != null ? itRevenue : 0.0);
        revenue.put("qsRevenue", qsRevenue != null ? qsRevenue : 0.0);
        revenue.put("avgSatisfaction", "4.2/5.0");

        return revenue;
    }

    public List<Assignment> getAssignmentsByUserId(Long userId) {
        return assignmentRepository.findByUserId(userId);
    }

    // ============================================
    // NEW METHODS FOR REVISION FEATURE
    // ============================================

    /**
     * Create a revision request for an assignment
     */
    public RevisionRequest createRevisionRequest(Long assignmentId, String reason) {
        Assignment assignment = getAssignmentById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));

        // Validate revision availability
        if (!assignment.canRequestRevision()) {
            throw new RuntimeException("Cannot request revision for this assignment. " +
                    "Either revisions are exhausted or assignment status is not DELIVERED.");
        }

        RevisionRequest revisionRequest = new RevisionRequest(assignment, reason);
        return revisionRequestRepository.save(revisionRequest);
    }

    /**
     * Get revision request by ID
     */
    public RevisionRequest getRevisionRequestById(Long id) {
        return revisionRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Revision request not found with id: " + id));
    }

    /**
     * Update revision request
     */
    public RevisionRequest updateRevisionRequest(RevisionRequest revisionRequest) {
        return revisionRequestRepository.save(revisionRequest);
    }

    /**
     * Get all revision requests for an assignment
     */
    public List<RevisionRequest> getRevisionRequestsByAssignment(Long assignmentId) {
        return revisionRequestRepository.findByAssignmentIdOrderByRequestedAtDesc(assignmentId);
    }

    /**
     * Get all pending revision requests (for admin dashboard)
     */
    public List<RevisionRequest> getPendingRevisionRequests() {
        return revisionRequestRepository.findByStatusOrderByRequestedAtAsc(
                RevisionRequest.RevisionStatus.PENDING);
    }

    /**
     * Check if assignment has pending revision
     */
    public boolean hasPendingRevision(Long assignmentId) {
        return revisionRequestRepository.existsByAssignmentIdAndStatus(
                assignmentId, RevisionRequest.RevisionStatus.PENDING);
    }

    /**
     * Get revision statistics for admin dashboard
     */
    public Map<String, Long> getRevisionStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("pending", revisionRequestRepository.countByStatus(
                RevisionRequest.RevisionStatus.PENDING));
        stats.put("in_progress", revisionRequestRepository.countByStatus(
                RevisionRequest.RevisionStatus.IN_PROGRESS));
        stats.put("completed", revisionRequestRepository.countByStatus(
                RevisionRequest.RevisionStatus.COMPLETED));
        stats.put("rejected", revisionRequestRepository.countByStatus(
                RevisionRequest.RevisionStatus.REJECTED));
        return stats;
    }

    /**
     * Count assignments with status REVISION_REQUESTED
     */
    public long getRevisionRequestedCount() {
        return assignmentRepository.countByStatus(Assignment.AssignmentStatus.REVISION_REQUESTED);
    }

    /**
     * Count revision requests by status for admin
     */
    public long getRevisionRequestedCountForAdmin(User admin) {
        List<Assignment> revisionRequests = getAssignmentsByStatusForAdmin(
                Assignment.AssignmentStatus.REVISION_REQUESTED, admin);
        return revisionRequests.size();
    }

    // ============================================
    // HELPER METHODS FOR ACCESS CONTROL
    // ============================================

    public boolean canAdminAccessAssignment(User admin, Assignment assignment) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return true;
        } else if (admin.getSpecialization() == User.Specialization.IT) {
            return assignment.getType() == Assignment.AssignmentType.IT;
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return assignment.getType() == Assignment.AssignmentType.QUANTITY_SURVEYING;
        }
        return false;
    }

    public boolean canAdminAccessAssignmentType(User admin, Assignment.AssignmentType type) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return true;
        } else if (admin.getSpecialization() == User.Specialization.IT) {
            return type == Assignment.AssignmentType.IT;
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return type == Assignment.AssignmentType.QUANTITY_SURVEYING;
        }
        return false;
    }

    private List<Assignment> filterAssignmentsBySpecialization(List<Assignment> assignments, User admin) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return assignments;
        } else if (admin.getSpecialization() == User.Specialization.IT) {
            return assignments.stream()
                    .filter(a -> a.getType() == Assignment.AssignmentType.IT)
                    .collect(Collectors.toList());
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return assignments.stream()
                    .filter(a -> a.getType() == Assignment.AssignmentType.QUANTITY_SURVEYING)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    private Assignment.AssignmentType getAdminAssignmentType(User admin) {
        if (admin.getSpecialization() == User.Specialization.IT) {
            return Assignment.AssignmentType.IT;
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return Assignment.AssignmentType.QUANTITY_SURVEYING;
        }
        return null;
    }

    public boolean isSuperAdmin(User admin) {
        return admin.getSpecialization() == User.Specialization.BOTH;
    }
}