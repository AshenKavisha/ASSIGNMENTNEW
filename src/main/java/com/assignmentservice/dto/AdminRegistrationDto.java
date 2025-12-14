package com.assignmentservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminRegistrationDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Please confirm password")
    private String confirmPassword;

    private boolean canApprove = true;
    private boolean canReject = true;
    private boolean canManageUsers = false;

    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public boolean isCanApprove() { return canApprove; }
    public void setCanApprove(boolean canApprove) { this.canApprove = canApprove; }

    public boolean isCanReject() { return canReject; }
    public void setCanReject(boolean canReject) { this.canReject = canReject; }

    public boolean isCanManageUsers() { return canManageUsers; }
    public void setCanManageUsers(boolean canManageUsers) { this.canManageUsers = canManageUsers; }
}