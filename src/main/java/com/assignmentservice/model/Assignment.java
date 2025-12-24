package com.assignmentservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

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

    // Add these fields for file uploads
    @Column(name = "description_files", columnDefinition = "TEXT")
    private String descriptionFiles; // Store file paths as comma-separated string

    @Column(name = "requirements_files", columnDefinition = "TEXT")
    private String requirementsFiles; // Store file paths as comma-separated string

    // NEW FIELDS FOR SOLUTION DELIVERY
    @Column(name = "solution_files", columnDefinition = "TEXT")
    private String solutionFiles; // Store solution file paths as comma-separated string

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    private LocalDateTime deliveredAt;

    private Double finalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status = AssignmentStatus.PENDING;

    private Double price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Transient fields for file upload (won't be stored in database)
    @Transient
    private List<MultipartFile> descriptionFileList;

    @Transient
    private List<MultipartFile> requirementsFileList;

    // NEW: Transient field for solution files
    @Transient
    private List<MultipartFile> solutionFileList;

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

    // UPDATED: Added new statuses for solution delivery
    public enum AssignmentStatus {
        PENDING, APPROVED, REJECTED, IN_PROGRESS,
        READY_FOR_DELIVERY, COMPLETED, DELIVERED, PAID
    }

    // Constructors
    public Assignment() {}

    public Assignment(String title, String description, AssignmentType type, String subject, String deadline, User user) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.subject = subject;
        this.deadline = deadline;
        this.user = user;
    }

    // Getters and Setters
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
    public void setAdditionalRequirements(String additionalRequirements) { this.additionalRequirements = additionalRequirements; }

    // File upload getters and setters
    public String getDescriptionFiles() { return descriptionFiles; }
    public void setDescriptionFiles(String descriptionFiles) { this.descriptionFiles = descriptionFiles; }

    public String getRequirementsFiles() { return requirementsFiles; }
    public void setRequirementsFiles(String requirementsFiles) { this.requirementsFiles = requirementsFiles; }

    // NEW: Solution delivery getters and setters
    public String getSolutionFiles() { return solutionFiles; }
    public void setSolutionFiles(String solutionFiles) { this.solutionFiles = solutionFiles; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public Double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(Double finalPrice) { this.finalPrice = finalPrice; }

    public List<MultipartFile> getSolutionFileList() { return solutionFileList; }
    public void setSolutionFileList(List<MultipartFile> solutionFileList) { this.solutionFileList = solutionFileList; }

    public List<MultipartFile> getDescriptionFileList() { return descriptionFileList; }
    public void setDescriptionFileList(List<MultipartFile> descriptionFileList) { this.descriptionFileList = descriptionFileList; }

    public List<MultipartFile> getRequirementsFileList() { return requirementsFileList; }
    public void setRequirementsFileList(List<MultipartFile> requirementsFileList) { this.requirementsFileList = requirementsFileList; }

    public AssignmentStatus getStatus() { return status; }
    public void setStatus(AssignmentStatus status) { this.status = status; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}