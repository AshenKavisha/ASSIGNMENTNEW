package com.assignmentservice.service;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Payment;
import com.assignmentservice.model.RevisionRequest;
import com.assignmentservice.model.User;
import com.assignmentservice.repository.AssignmentRepository;
import com.assignmentservice.repository.PaymentRepository;
import com.assignmentservice.repository.RevisionRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    private RevisionRequestRepository revisionRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PaymentRepository paymentRepository;

    // ============================================
    // EXISTING METHODS WITH NOTIFICATION INTEGRATION
    // ============================================

    public Assignment createAssignment(Assignment assignment) {
        Assignment savedAssignment = assignmentRepository.save(assignment);
        emailService.sendAssignmentNotificationToAdmin(savedAssignment);

        // ADDED: Send in-app notification to admin
        notificationService.notifyAdminAssignmentSubmitted(savedAssignment);

        return savedAssignment;
    }

    /**
     * Create assignment and send email with attached files
     */
    public Assignment createAssignmentWithFiles(Assignment assignment,
                                                List<MultipartFile> descriptionFiles,
                                                List<MultipartFile> requirementFiles) {
        Assignment savedAssignment = assignmentRepository.save(assignment);

        System.out.println("✅ Assignment saved to database with ID: " + savedAssignment.getId());

        try {
            emailService.sendAssignmentNotificationToAdminWithFiles(
                    savedAssignment,
                    descriptionFiles,
                    requirementFiles
            );
            System.out.println("✅ Email with files sent to admin successfully");
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            notificationService.notifyAdminAssignmentSubmitted(savedAssignment);
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send notification: " + e.getMessage());
        }

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

    /**
     * Update assignment status with notifications
     * UPDATED: Added User admin parameter for notification tracking
     */
    public Assignment updateAssignmentStatus(Long id, Assignment.AssignmentStatus status, User admin) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
        if (assignmentOpt.isPresent()) {
            Assignment assignment = assignmentOpt.get();
            Assignment.AssignmentStatus oldStatus = assignment.getStatus();
            assignment.setStatus(status);
            Assignment savedAssignment = assignmentRepository.save(assignment);

            // ADDED: Send notifications based on status change
            if (status == Assignment.AssignmentStatus.APPROVED && oldStatus != status) {
                notificationService.notifyUserAssignmentApproved(savedAssignment);
            } else if (status == Assignment.AssignmentStatus.REJECTED && oldStatus != status) {
                notificationService.notifyUserAssignmentRejected(savedAssignment);
            } else if (status == Assignment.AssignmentStatus.DELIVERED && oldStatus != status) {
                notificationService.notifyUserSolutionDelivered(savedAssignment, admin);
            }

            return savedAssignment;
        }
        return null;
    }

    /**
     * Overloaded method for backward compatibility
     * @deprecated Use updateAssignmentStatus(Long, AssignmentStatus, User) instead
     */
    @Deprecated
    public Assignment updateAssignmentStatus(Long id, Assignment.AssignmentStatus status) {
        // For backward compatibility, call without notification
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
            Assignment.AssignmentStatus oldStatus = assignment.getStatus();
            assignment.setStatus(status);
            Assignment savedAssignment = assignmentRepository.save(assignment);

            // ADDED: Send notifications based on status change
            if (status == Assignment.AssignmentStatus.APPROVED && oldStatus != status) {
                notificationService.notifyUserAssignmentApproved(savedAssignment);
            } else if (status == Assignment.AssignmentStatus.REJECTED && oldStatus != status) {
                notificationService.notifyUserAssignmentRejected(savedAssignment);
            } else if (status == Assignment.AssignmentStatus.DELIVERED && oldStatus != status) {
                notificationService.notifyUserSolutionDelivered(savedAssignment, admin);
            }

            return savedAssignment;
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

    public Page<Assignment> getAssignmentsPaginated(Pageable pageable) {
        return assignmentRepository.findAll(pageable);
    }

    public Page<Assignment> getAssignmentsPaginatedForAdmin(Pageable pageable, User admin) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return assignmentRepository.findAll(pageable);
        }

        Assignment.AssignmentType adminType = getAdminAssignmentType(admin);
        if (adminType != null) {
            return assignmentRepository.findByType(adminType, pageable);
        }

        return Page.empty(pageable);
    }

    public Map<String, Long> getAssignmentStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", assignmentRepository.count());
        stats.put("pending", assignmentRepository.countByStatus(Assignment.AssignmentStatus.PENDING));
        stats.put("approved", assignmentRepository.countByStatus(Assignment.AssignmentStatus.APPROVED));
        stats.put("inProgress", assignmentRepository.countByStatus(Assignment.AssignmentStatus.IN_PROGRESS));
        stats.put("delivered", assignmentRepository.countByStatus(Assignment.AssignmentStatus.DELIVERED));
        stats.put("rejected", assignmentRepository.countByStatus(Assignment.AssignmentStatus.REJECTED));
        return stats;
    }

    public Map<String, Long> getAssignmentStatisticsByType(Assignment.AssignmentType type) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", assignmentRepository.countByType(type));
        stats.put("pending", assignmentRepository.countByTypeAndStatus(type, Assignment.AssignmentStatus.PENDING));
        stats.put("approved", assignmentRepository.countByTypeAndStatus(type, Assignment.AssignmentStatus.APPROVED));
        stats.put("inProgress", assignmentRepository.countByTypeAndStatus(type, Assignment.AssignmentStatus.IN_PROGRESS));
        stats.put("delivered", assignmentRepository.countByTypeAndStatus(type, Assignment.AssignmentStatus.DELIVERED));
        stats.put("rejected", assignmentRepository.countByTypeAndStatus(type, Assignment.AssignmentStatus.REJECTED));
        return stats;
    }

    public Map<String, Object> getPerformanceMetrics(LocalDateTime startDate, User admin) {
        Map<String, Object> stats = new HashMap<>();

        Assignment.AssignmentType adminType = getAdminAssignmentType(admin);
        if (adminType == null && admin.getSpecialization() != User.Specialization.BOTH) {
            return stats;
        }

        long totalAssignments = adminType != null ?
                assignmentRepository.countByTypeAndCreatedAtAfter(adminType, startDate) :
                assignmentRepository.countByCreatedAtAfter(startDate);

        long completed = adminType != null ?
                assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                        adminType, Assignment.AssignmentStatus.APPROVED, startDate) :
                assignmentRepository.countByStatusAndCreatedAtAfter(
                        Assignment.AssignmentStatus.APPROVED, startDate);

        long pending = adminType != null ?
                assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                        adminType, Assignment.AssignmentStatus.PENDING, startDate) :
                assignmentRepository.countByStatusAndCreatedAtAfter(
                        Assignment.AssignmentStatus.PENDING, startDate);

        long inProgress = adminType != null ?
                assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                        adminType, Assignment.AssignmentStatus.IN_PROGRESS, startDate) :
                assignmentRepository.countByStatusAndCreatedAtAfter(
                        Assignment.AssignmentStatus.IN_PROGRESS, startDate);

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
                Assignment.AssignmentStatus.APPROVED, startDate);
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
    // REVISION METHODS WITH NOTIFICATION INTEGRATION
    // ============================================

    /**
     * Create a revision request for an assignment
     * UPDATED: Added notification to admin
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
        RevisionRequest savedRequest = revisionRequestRepository.save(revisionRequest);

        // ADDED: Update assignment status
        assignment.setStatus(Assignment.AssignmentStatus.REVISION_REQUESTED);
        assignmentRepository.save(assignment);

        // ADDED: Send notification to admin
        notificationService.notifyAdminRevisionRequested(assignment, savedRequest);

        return savedRequest;
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
     * UPDATED: Added notification logic for status changes
     */
    public RevisionRequest updateRevisionRequest(RevisionRequest revisionRequest) {
        RevisionRequest.RevisionStatus oldStatus = null;

        // Get old status if exists
        if (revisionRequest.getId() != null) {
            Optional<RevisionRequest> existing = revisionRequestRepository.findById(revisionRequest.getId());
            if (existing.isPresent()) {
                oldStatus = existing.get().getStatus();
            }
        }

        RevisionRequest savedRequest = revisionRequestRepository.save(revisionRequest);

        // ADDED: Send notifications based on status change
        if (oldStatus != null && oldStatus != savedRequest.getStatus()) {
            Assignment assignment = savedRequest.getAssignment();

            if (savedRequest.getStatus() == RevisionRequest.RevisionStatus.COMPLETED) {
                notificationService.notifyUserRevisionCompleted(assignment);
            } else if (savedRequest.getStatus() == RevisionRequest.RevisionStatus.REJECTED) {
                String reason = savedRequest.getAdminNotes() != null ?
                        savedRequest.getAdminNotes() : "No reason provided";
                notificationService.notifyUserRevisionRejected(assignment, reason);
            }
        }

        return savedRequest;
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

    public long countCompletedAssignmentsByType(Assignment.AssignmentType type) {
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);
        return assignmentRepository.countByTypeAndStatusNotIn(type, excludedStatuses);
    }

    public Page<Assignment> getCompletedAssignmentsByTypeForAdmin(
            Assignment.AssignmentType type, Pageable pageable, User admin) {

        if (!canAdminAccessAssignmentType(admin, type)) {
            return Page.empty(pageable);
        }

        return getCompletedAssignmentsByType(type, pageable);
    }

    public Map<String, Object> getAssignmentStatisticsForAdmin(LocalDateTime startDate, User admin) {
        return getPerformanceMetrics(startDate, admin);
    }

    // In AssignmentService.java, add:
    public Payment getPaymentByAssignment(Assignment assignment) {
        return paymentRepository.findByAssignment(assignment).orElse(null);
    }

    /**
     * Count all assignments
     */
    public Long countAll() {
        return assignmentRepository.count();
    }

    /**
     * Count assignments by status
     */
    public Long countByStatus(String status) {
        try {
            Assignment.AssignmentStatus statusEnum = Assignment.AssignmentStatus.valueOf(status);
            return assignmentRepository.countByStatus(statusEnum);
        } catch (IllegalArgumentException e) {
            return 0L;
        }
    }

    /**
     * Get assignments by user ID
     */
    public List<Assignment> getByUserId(Long userId) {
        return assignmentRepository.findByUserId(userId);
    }

    public List<Assignment> getAssignmentsByAssignedAdmin(User admin) {
        return assignmentRepository.findAll().stream()
                .filter(assignment -> assignment.getAssignedAdmin() != null &&
                        assignment.getAssignedAdmin().getId().equals(admin.getId()))
                .collect(Collectors.toList());
    }

    public List<Assignment> getAssignmentsByStatusAndAssignedAdmin(
            Assignment.AssignmentStatus status, User admin) {
        return assignmentRepository.findAll().stream()
                .filter(assignment -> assignment.getStatus() == status &&
                        assignment.getAssignedAdmin() != null &&
                        assignment.getAssignedAdmin().getId().equals(admin.getId()))
                .collect(Collectors.toList());
    }

}