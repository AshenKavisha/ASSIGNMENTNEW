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

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
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

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public long getTotalAssignmentsCount() {
        return assignmentRepository.count();
    }

    public long getPendingAssignmentsCount() {
        return assignmentRepository.countByStatus(Assignment.AssignmentStatus.PENDING);
    }

    public List<Assignment> getAssignmentsByStatus(Assignment.AssignmentStatus status) {
        return assignmentRepository.findByStatus(status);
    }

    public boolean deleteAssignment(Long id) {
        if (assignmentRepository.existsById(id)) {
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

    public Page<Assignment> getCompletedAssignmentsByType(Assignment.AssignmentType type, Pageable pageable) {
        // Return all assignments of a specific type that are not PENDING or REJECTED
        List<Assignment.AssignmentStatus> excludedStatuses = new ArrayList<>();
        excludedStatuses.add(Assignment.AssignmentStatus.PENDING);
        excludedStatuses.add(Assignment.AssignmentStatus.REJECTED);
        return assignmentRepository.findByTypeAndStatusNotIn(type, excludedStatuses, pageable);
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
        long completed = assignmentRepository.countByStatusAndCreatedAtAfter(
                Assignment.AssignmentStatus.COMPLETED, startDate);
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

        // Calculate average response time (simplified)
        double avgResponseTime = 24.0; // Example value in hours
        stats.put("avgResponseTime", String.format("%.1f hours", avgResponseTime));

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
}