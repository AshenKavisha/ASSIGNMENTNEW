package com.assignmentservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity class to track revision requests made by users for delivered assignments
 */
@Entity
@Table(name = "revision_requests")
public class RevisionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason; // What changes the user wants

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RevisionStatus status = RevisionStatus.PENDING;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes; // Admin can add notes about the revision

    // Enum for revision status
    public enum RevisionStatus {
        PENDING,        // User submitted, waiting for admin review
        IN_PROGRESS,    // Admin is working on revisions
        COMPLETED,      // Revisions completed and re-delivered
        REJECTED        // Admin rejected the revision request
    }

    // Constructors
    public RevisionRequest() {}

    public RevisionRequest(Assignment assignment, String reason) {
        this.assignment = assignment;
        this.reason = reason;
        this.status = RevisionStatus.PENDING;
        this.requestedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public RevisionStatus getStatus() {
        return status;
    }

    public void setStatus(RevisionStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

}