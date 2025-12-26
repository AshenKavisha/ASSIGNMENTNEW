package com.assignmentservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String fullName;

    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "USER";

    @Enumerated(EnumType.STRING)
    private Specialization specialization = Specialization.NONE;

    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    // Email verification fields
    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(name = "verification_sent_at")
    private LocalDateTime verificationSentAt;

    // Profile picture (stored as Base64 string)
    @Column(columnDefinition = "TEXT")
    private String profilePicture;

    // Additional profile fields
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;

    @Past(message = "Birth date must be in the past")
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Size(max = 1000, message = "Bio cannot exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String bio;

    @Size(max = 2000, message = "Work experience cannot exceed 2000 characters")
    @Column(name = "work_experience", columnDefinition = "TEXT")
    private String workExperience;

    @Size(max = 1000, message = "Skills cannot exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String skills;

    @Size(max = 1000, message = "Education cannot exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String education;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @Size(max = 200, message = "Website URL cannot exceed 200 characters")
    private String website;

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Assignment> assignments = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> feedbacks = new ArrayList<>();

    public enum Specialization {
        IT,
        QUANTITY_SURVEYING,
        BOTH,
        NONE
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public User() {}

    public User(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.emailVerified = false;
    }

    public User(String fullName, String email, String password, String role) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.emailVerified = role.equals("ADMIN");
    }

    // Helper method for Spring Security
    public String getSpringSecurityRole() {
        return "ROLE_" + role;
    }

    // Helper method to check if user is online (within last 5 minutes)
    public boolean isOnline() {
        if (lastLogin == null) return false;
        return lastLogin.isAfter(LocalDateTime.now().minusMinutes(5));
    }

    // Helper method to get formatted profile picture URL
    public String getProfilePictureUrl() {
        if (profilePicture != null && !profilePicture.isEmpty()) {
            return "data:image/jpeg;base64," + profilePicture;
        }
        return null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Specialization getSpecialization() { return specialization; }
    public void setSpecialization(Specialization specialization) {
        this.specialization = specialization;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public LocalDateTime getVerificationSentAt() { return verificationSentAt; }
    public void setVerificationSentAt(LocalDateTime verificationSentAt) {
        this.verificationSentAt = verificationSentAt;
    }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getBio() { return bio; }
    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getWorkExperience() { return workExperience; }
    public void setWorkExperience(String workExperience) {
        this.workExperience = workExperience;
    }

    public String getSkills() { return skills; }
    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getEducation() { return education; }
    public void setEducation(String education) {
        this.education = education;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() { return website; }
    public void setWebsite(String website) {
        this.website = website;
    }

    public List<Assignment> getAssignments() { return assignments; }
    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }

    public List<Feedback> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(List<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", emailVerified=" + emailVerified +
                ", lastLogin=" + lastLogin +
                '}';
    }

    public boolean online() {
        if (lastLogin == null) {
            return false;
        }
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        return lastLogin.isAfter(fiveMinutesAgo);
    }
}