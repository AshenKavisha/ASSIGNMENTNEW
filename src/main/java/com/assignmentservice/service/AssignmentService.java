package com.assignmentservice.service;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.User;
import com.assignmentservice.repository.AssignmentRepository;
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

    /**
     * Get pending assignments filtered by admin specialization
     * @param admin The admin user requesting the assignments
     * @return List of pending assignments the admin can access
     */
    public List<Assignment> getPendingAssignmentsByAdminSpecialization(User admin) {
        List<Assignment> allPending = assignmentRepository.findByStatus(Assignment.AssignmentStatus.PENDING);
        return filterAssignmentsBySpecialization(allPending, admin);
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    /**
     * Get assignment by ID only if the admin has permission to access it
     * @param id Assignment ID
     * @param admin Admin user
     * @return Assignment if admin has permission, empty otherwise
     */
    public Optional<Assignment> getAssignmentByIdForAdmin(Long id, User admin) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);

        if (assignmentOpt.isEmpty()) {
            return Optional.empty();
        }

        Assignment assignment = assignmentOpt.get();

        // Check if admin has permission to access this assignment
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

    /**
     * Update assignment status only if admin has permission
     */
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

    /**
     * Get all assignments filtered by admin specialization
     */
    public List<Assignment> getAllAssignmentsByAdminSpecialization(User admin) {
        List<Assignment> allAssignments = assignmentRepository.findAll();
        return filterAssignmentsBySpecialization(allAssignments, admin);
    }

    public long getTotalAssignmentsCount() {
        return assignmentRepository.count();
    }

    /**
     * Get total assignments count for admin based on specialization
     */
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

    /**
     * Get pending assignments count for admin based on specialization
     */
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

    /**
     * Get assignments by status filtered by admin specialization
     */
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

    /**
     * Delete assignment only if admin has permission
     */
    public boolean deleteAssignmentForAdmin(Long id, User admin) {
        Optional<Assignment> assignmentOpt = getAssignmentByIdForAdmin(id, admin);
        if (assignmentOpt.isPresent()) {
            assignmentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // NEW METHODS FOR COMPLETED ASSIGNMENTS
    // These methods now return all "active" assignments (not just COMPLETED status)
    // This includes: APPROVED, IN_PROGRESS, COMPLETED, DELIVERED, PAID

    public Page<Assignment> getCompletedAssignments(Pageable pageable) {
        // Return all assignments that are not PENDING or REJECTED
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);
        return assignmentRepository.findByStatusNotIn(excludedStatuses, pageable);
    }

    /**
     * Get completed assignments filtered by admin specialization
     */
    public Page<Assignment> getCompletedAssignmentsForAdmin(User admin, Pageable pageable) {
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);

        if (admin.getSpecialization() == User.Specialization.BOTH) {
            // Super admin can see all
            return assignmentRepository.findByStatusNotIn(excludedStatuses, pageable);
        } else if (admin.getSpecialization() == User.Specialization.IT) {
            // IT admin sees only IT assignments
            return assignmentRepository.findByTypeAndStatusNotIn(Assignment.AssignmentType.IT, excludedStatuses, pageable);
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            // QS admin sees only QS assignments
            return assignmentRepository.findByTypeAndStatusNotIn(Assignment.AssignmentType.QUANTITY_SURVEYING, excludedStatuses, pageable);
        }

        // NONE specialization - no access
        return Page.empty(pageable);
    }

    public Page<Assignment> getCompletedAssignmentsByType(Assignment.AssignmentType type, Pageable pageable) {
        // Return all assignments of a specific type that are not PENDING or REJECTED
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);
        return assignmentRepository.findByTypeAndStatusNotIn(type, excludedStatuses, pageable);
    }

    /**
     * Get completed assignments by type, but only if admin has permission
     */
    public Page<Assignment> getCompletedAssignmentsByTypeForAdmin(Assignment.AssignmentType type, User admin, Pageable pageable) {
        // Check if admin can access this type
        if (!canAdminAccessAssignmentType(admin, type)) {
            return Page.empty(pageable);
        }

        return getCompletedAssignmentsByType(type, pageable);
    }

    public long countCompletedAssignmentsByType(Assignment.AssignmentType type) {
        // Count assignments that are not PENDING or REJECTED
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);
        return assignmentRepository.countByTypeAndStatusNotIn(type, excludedStatuses);
    }

    // REPORT METHODS

    public Map<String, Object> getAssignmentStatistics(LocalDateTime startDate) {
        Map<String, Object> stats = new HashMap<>();

        long totalAssignments = assignmentRepository.countByCreatedAtAfter(startDate);

        // ✅ UPDATED: Count both COMPLETED and DELIVERED as completed
        long completedCount = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.COMPLETED, startDate);
        long deliveredCount = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.DELIVERED, startDate);
        long completed = completedCount + deliveredCount;  // Combine both!

        long pending = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.PENDING, startDate);
        long inProgress = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.IN_PROGRESS, startDate);

        stats.put("totalAssignments", totalAssignments);
        stats.put("completed", completed);  // Now includes DELIVERED!
        stats.put("pending", pending);
        stats.put("inProgress", inProgress);

        double completionRate = totalAssignments > 0 ? (completed * 100.0) / totalAssignments : 0;
        stats.put("completionRate", String.format("%.1f%%", completionRate));

        double avgResponseTime = 24.0;
        stats.put("avgResponseTime", String.format("%.1f hours", avgResponseTime));

        return stats;
    }

    /**
     * Get statistics filtered by admin specialization
     */
    public Map<String, Object> getAssignmentStatisticsForAdmin(LocalDateTime startDate, User admin) {
        // If super admin, return all statistics
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return getAssignmentStatistics(startDate);
        }

        // Filter by admin's specialization
        Map<String, Object> stats = new HashMap<>();
        Assignment.AssignmentType adminType = getAdminAssignmentType(admin);

        if (adminType == null) {
            return stats; // No access
        }

        // Get filtered statistics
        long totalAssignments = assignmentRepository.countByTypeAndCreatedAtAfter(adminType, startDate);

        // ✅ UPDATED: Count both COMPLETED and DELIVERED as completed
        long completedCount = assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                adminType, Assignment.AssignmentStatus.COMPLETED, startDate);
        long deliveredCount = assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                adminType, Assignment.AssignmentStatus.DELIVERED, startDate);
        long completed = completedCount + deliveredCount;  // Combine both!

        long pending = assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                adminType, Assignment.AssignmentStatus.PENDING, startDate);
        long inProgress = assignmentRepository.countByTypeAndStatusAndCreatedAtAfter(
                adminType, Assignment.AssignmentStatus.IN_PROGRESS, startDate);

        stats.put("totalAssignments", totalAssignments);
        stats.put("completed", completed);  // Now includes DELIVERED!
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

        // Calculate average satisfaction (simplified)
        revenue.put("avgSatisfaction", "4.2/5.0");

        return revenue;
    }

    public List<Assignment> getAssignmentsByUserId(Long userId) {
        return assignmentRepository.findByUserId(userId);
    }

    // ============ HELPER METHODS FOR ACCESS CONTROL ============

    /**
     * Check if admin can access a specific assignment based on specialization
     */
    public boolean canAdminAccessAssignment(User admin, Assignment assignment) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return true; // Super admin can access everything
        } else if (admin.getSpecialization() == User.Specialization.IT) {
            return assignment.getType() == Assignment.AssignmentType.IT;
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return assignment.getType() == Assignment.AssignmentType.QUANTITY_SURVEYING;
        }
        return false; // NONE specialization - no access
    }

    /**
     * Check if admin can access a specific assignment type
     */
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

    /**
     * Filter assignments based on admin specialization
     */
    private List<Assignment> filterAssignmentsBySpecialization(List<Assignment> assignments, User admin) {
        if (admin.getSpecialization() == User.Specialization.BOTH) {
            return assignments; // Super admin sees all
        } else if (admin.getSpecialization() == User.Specialization.IT) {
            return assignments.stream()
                    .filter(a -> a.getType() == Assignment.AssignmentType.IT)
                    .collect(Collectors.toList());
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return assignments.stream()
                    .filter(a -> a.getType() == Assignment.AssignmentType.QUANTITY_SURVEYING)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>(); // NONE specialization - no access
    }

    /**
     * Get assignment type for admin (for filtering queries)
     */
    private Assignment.AssignmentType getAdminAssignmentType(User admin) {
        if (admin.getSpecialization() == User.Specialization.IT) {
            return Assignment.AssignmentType.IT;
        } else if (admin.getSpecialization() == User.Specialization.QUANTITY_SURVEYING) {
            return Assignment.AssignmentType.QUANTITY_SURVEYING;
        }
        return null; // BOTH or NONE
    }

    /**
     * Check if user is a super admin (has BOTH specialization)
     */
    public boolean isSuperAdmin(User admin) {
        return admin.getSpecialization() == User.Specialization.BOTH;
    }
}