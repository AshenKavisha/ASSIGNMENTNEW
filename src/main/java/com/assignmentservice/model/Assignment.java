package com.assignmentservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Transient;

@Entity
@Table(name = "assignments")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Assignment type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentType type;

    @NotBlank(message = "Subject is required")
    @Column(nullable = false)
    private String subject;

    @NotBlank(message = "Deadline is required")
    private String deadline;

    @Column(columnDefinition = "TEXT")
    private String additionalRequirements;

    // File upload fields
    @Column(name = "description_files", columnDefinition = "TEXT")
    private String descriptionFiles;

    @Column(name = "requirements_files", columnDefinition = "TEXT")
    private String requirementsFiles;

    // Solution delivery fields
    @Column(name = "solution_files", columnDefinition = "TEXT")
    private String solutionFiles;

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    private LocalDateTime deliveredAt;
    private Double finalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status = AssignmentStatus.PENDING;

    private Double price;

    // NEW: Currency field
    @Column(name = "currency")
    private String currency;

    // NEW: Approved at timestamp
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ========================================
    // NEW FIELDS FOR REVISION FEATURE
    // ========================================

    @Column(name = "max_revisions", nullable = false)
    private Integer maxRevisions = 2; // Default: 2 free revisions

    @Column(name = "revisions_used", nullable = false)
    private Integer revisionsUsed = 0; // Counter for used revisions

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("requestedAt DESC")
    private List<RevisionRequest> revisionRequests = new ArrayList<>();

    // ========================================
    // Transient fields for file upload
    // ========================================

    @Transient
    private List<MultipartFile> descriptionFileList;

    @Transient
    private List<MultipartFile> requirementsFileList;

    @Transient
    private List<MultipartFile> solutionFileList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_admin_id")
    private User assignedAdmin;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AssignmentType {
        IT, QUANTITY_SURVEYING
    }

    // UPDATED: Added REVISION_REQUESTED status
    public enum AssignmentStatus {
        PENDING,
        APPROVED,
        REJECTED,
        IN_PROGRESS,
        READY_FOR_DELIVERY,
        COMPLETED,
        DELIVERED,
        REVISION_REQUESTED,  // NEW STATUS for revision requests
        PAID
    }

    @Transient
    private Payment payment;

    // ========================================
    // REVISION HELPER METHODS
    // ========================================

    /**
     * Check if user can request a revision for this assignment
     */
    public boolean canRequestRevision() {
        return this.status == AssignmentStatus.DELIVERED
                && this.revisionsUsed < this.maxRevisions;
    }

    /**
     * Get remaining revision count
     */
    public int getRemainingRevisions() {
        return this.maxRevisions - this.revisionsUsed;
    }

    /**
     * Increment the revision counter
     */
    public void incrementRevisionsUsed() {
        this.revisionsUsed++;
    }

    /**
     * Decrement the revision counter (used when rejecting a revision request)
     */
    public void decrementRevisionsUsed() {
        if (this.revisionsUsed > 0) {
            this.revisionsUsed--;
        }
    }

    /**
     * Check if all revisions have been exhausted
     */
    public boolean hasExhaustedRevisions() {
        return this.revisionsUsed >= this.maxRevisions;
    }

    // ========================================
    // CONSTRUCTORS
    // ========================================

    public Assignment() {}

    public Assignment(String title, String description, AssignmentType type, String subject, String deadline, User user) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.subject = subject;
        this.deadline = deadline;
        this.user = user;
    }

    // ========================================
    // GETTERS AND SETTERS
    // ========================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AssignmentType getType() { return type; }
    public void setType(AssignmentType type) { this.type = type; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getAdditionalRequirements() { return additionalRequirements; }
    public void setAdditionalRequirements(String additionalRequirements) {
        this.additionalRequirements = additionalRequirements;
    }

    public String getDescriptionFiles() { return descriptionFiles; }
    public void setDescriptionFiles(String descriptionFiles) {
        this.descriptionFiles = descriptionFiles;
    }

    public String getRequirementsFiles() { return requirementsFiles; }
    public void setRequirementsFiles(String requirementsFiles) {
        this.requirementsFiles = requirementsFiles;
    }

    public String getSolutionFiles() { return solutionFiles; }
    public void setSolutionFiles(String solutionFiles) {
        this.solutionFiles = solutionFiles;
    }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public Double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public List<MultipartFile> getSolutionFileList() { return solutionFileList; }
    public void setSolutionFileList(List<MultipartFile> solutionFileList) {
        this.solutionFileList = solutionFileList;
    }

    public List<MultipartFile> getDescriptionFileList() { return descriptionFileList; }
    public void setDescriptionFileList(List<MultipartFile> descriptionFileList) {
        this.descriptionFileList = descriptionFileList;
    }

    public List<MultipartFile> getRequirementsFileList() { return requirementsFileList; }
    public void setRequirementsFileList(List<MultipartFile> requirementsFileList) {
        this.requirementsFileList = requirementsFileList;
    }

    public AssignmentStatus getStatus() { return status; }
    public void setStatus(AssignmentStatus status) {
        this.status = status;
    }

    public Double getPrice() { return price; }
    public void setPrice(Double price) {
        this.price = price; }

    // NEW: Currency getter and setter
    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    // NEW: ApprovedAt getter and setter
    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() { return user; }
    public void setUser(User user) {
        this.user = user;
    }

    // NEW: Revision-related getters and setters
    public Integer getMaxRevisions() { return maxRevisions; }
    public void setMaxRevisions(Integer maxRevisions) {
        this.maxRevisions = maxRevisions;
    }

    public Integer getRevisionsUsed() { return revisionsUsed; }
    public void setRevisionsUsed(Integer revisionsUsed) {
        this.revisionsUsed = revisionsUsed;
    }

    public List<RevisionRequest> getRevisionRequests() { return revisionRequests; }
    public void setRevisionRequests(List<RevisionRequest> revisionRequests) {
        this.revisionRequests = revisionRequests;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public User getAssignedAdmin() {
        return assignedAdmin;
    }

    public void setAssignedAdmin(User assignedAdmin) {
        this.assignedAdmin = assignedAdmin;
    }
}