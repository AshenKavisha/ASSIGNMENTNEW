package com.assignmentservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    private boolean used = false;

    // Constructors
    public VerificationToken() {
        this.createdDate = LocalDateTime.now();
    }

    public VerificationToken(String token, User user) {
        this.token = token;
        this.user = user;
        this.createdDate = LocalDateTime.now();
        this.expiryDate = calculateExpiryDate(24); // 24 hours
    }

    public VerificationToken(String token, User user, int expiryTimeInHours) {
        this.token = token;
        this.user = user;
        this.createdDate = LocalDateTime.now();
        this.expiryDate = calculateExpiryDate(expiryTimeInHours);
    }

    private LocalDateTime calculateExpiryDate(int expiryTimeInHours) {
        return LocalDateTime.now().plusHours(expiryTimeInHours);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }
}