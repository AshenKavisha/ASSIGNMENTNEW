package com.assignmentservice.dto;

public class AdminPerformanceDto {
    private String fullName;
    private String email;
    private String specialization;
    private int assignedCount;
    private int completedCount;
    private int pendingCount;
    private double avgTime;
    private double rating;

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public int getAssignedCount() { return assignedCount; }
    public void setAssignedCount(int assignedCount) { this.assignedCount = assignedCount; }

    public int getCompletedCount() { return completedCount; }
    public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }

    public int getPendingCount() { return pendingCount; }
    public void setPendingCount(int pendingCount) { this.pendingCount = pendingCount; }

    public double getAvgTime() { return avgTime; }
    public void setAvgTime(double avgTime) { this.avgTime = avgTime; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
}