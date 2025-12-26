package com.assignmentservice.service;

import com.assignmentservice.dto.AdminPerformanceDto;
import com.assignmentservice.model.PasswordResetToken;
import com.assignmentservice.model.User;
import com.assignmentservice.model.VerificationToken;
import com.assignmentservice.repository.PasswordResetTokenRepository;
import com.assignmentservice.repository.UserRepository;
import com.assignmentservice.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Register a new user and send verification email
     */
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setRole("USER");
        user.setSpecialization(User.Specialization.NONE);
        user.setEmailVerified(false);
        user.setVerificationSentAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Create verification token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, savedUser, 24);
        verificationTokenRepository.save(verificationToken);

        // Send verification email
        try {
            emailService.sendVerificationEmail(
                    savedUser.getEmail(),
                    savedUser.getFullName(),
                    token
            );
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
            // Continue registration even if email fails
        }

        return savedUser;
    }

    /**
     * Verify user email with token
     */
    @Transactional
    public boolean verifyEmail(String token) {
        Optional<VerificationToken> tokenOptional = verificationTokenRepository.findByToken(token);

        if (tokenOptional.isEmpty()) {
            return false;
        }

        VerificationToken verificationToken = tokenOptional.get();

        // Check if token is expired
        if (verificationToken.isExpired()) {
            return false;
        }

        // Check if token is already used
        if (verificationToken.isUsed()) {
            return false;
        }

        // Mark token as used
        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        // Verify user email
        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        return true;
    }

    /**
     * Create password reset token and send email
     */
    @Transactional
    public boolean createPasswordResetToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            // Don't reveal if email exists (security best practice)
            return true;
        }

        User user = userOptional.get();

        // Delete any existing reset tokens for this user
        passwordResetTokenRepository.deleteByUser(user);

        // Create new reset token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user, 1); // 1 hour expiry
        passwordResetTokenRepository.save(resetToken);

        // Send reset email
        try {
            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    user.getFullName(),
                    token
            );
            return true;
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
            return false;
        }
    }

    /**
     * Validate password reset token
     */
    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenRepository.findByToken(token);

        if (tokenOptional.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = tokenOptional.get();

        return !resetToken.isExpired() && !resetToken.isUsed();
    }

    /**
     * Reset password using token
     */
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenRepository.findByToken(token);

        if (tokenOptional.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = tokenOptional.get();

        // Validate token
        if (resetToken.isExpired() || resetToken.isUsed()) {
            return false;
        }

        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return true;
    }

    /**
     * Resend verification email
     */
    @Transactional
    public boolean resendVerificationEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        if (user.isEmailVerified()) {
            return false; // Already verified
        }

        // Delete old verification tokens
        verificationTokenRepository.deleteByUser(user);

        // Create new token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user, 24);
        verificationTokenRepository.save(verificationToken);

        // Update sent time
        user.setVerificationSentAt(LocalDateTime.now());
        userRepository.save(user);

        // Send email
        try {
            emailService.sendVerificationEmail(
                    user.getEmail(),
                    user.getFullName(),
                    token
            );
            return true;
        } catch (Exception e) {
            System.err.println("Failed to resend verification email: " + e.getMessage());
            return false;
        }
    }

    /**
     * Authenticate user - only if email is verified
     */
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Check if email is verified
            if (!user.isEmailVerified()) {
                throw new RuntimeException("Please verify your email before logging in");
            }

            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    /**
     * Clean up expired tokens (should be run periodically)
     */
    @Transactional
    public void cleanupExpiredTokens() {
        verificationTokenRepository.deleteAllExpiredTokens(LocalDateTime.now());
        passwordResetTokenRepository.deleteAllExpiredTokens(LocalDateTime.now());
    }

    // EXISTING METHODS BELOW (unchanged)

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllAdmins() {
        return userRepository.findByRole("ADMIN");
    }

    public List<User> getAllCustomers() {
        return userRepository.findByRole("USER");
    }

    public List<User> getAdminsBySpecialization(User.Specialization specialization) {
        return userRepository.findByRoleAndSpecialization("ADMIN", specialization);
    }

    @Transactional
    public User createAdmin(User user, User.Specialization specialization) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setRole("ADMIN");
        user.setSpecialization(specialization);
        user.setEmailVerified(true); // Admins are auto-verified

        return userRepository.save(user);
    }

    public Map<String, Object> getUserStatistics(LocalDateTime startDate) {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.countByCreatedAtAfter(startDate);
        long totalAdmins = userRepository.countByRoleAndCreatedAtAfter("ADMIN", startDate);

        List<User> activeUsersList = userRepository.findTopActiveUsers();
        long activeUsers = activeUsersList.size();

        stats.put("totalUsers", totalUsers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("activeUsers", activeUsers);
        stats.put("newUsers", totalUsers);

        return stats;
    }

    public List<AdminPerformanceDto> getAdminPerformance(LocalDateTime startDate) {
        List<User> admins = getAllAdmins();
        List<AdminPerformanceDto> performanceList = new ArrayList<>();

        for (User admin : admins) {
            AdminPerformanceDto dto = new AdminPerformanceDto();
            dto.setFullName(admin.getFullName());
            dto.setEmail(admin.getEmail());

            if (admin.getSpecialization() != null) {
                dto.setSpecialization(admin.getSpecialization().name());
            } else {
                dto.setSpecialization("NONE");
            }

            if (admin.getAssignments() != null) {
                dto.setAssignedCount(admin.getAssignments().size());

                long completed = admin.getAssignments().stream()
                        .filter(a -> a.getStatus() != null && a.getStatus().name().equals("COMPLETED"))
                        .count();
                dto.setCompletedCount((int) completed);

                long pending = admin.getAssignments().stream()
                        .filter(a -> a.getStatus() != null && a.getStatus().name().equals("PENDING"))
                        .count();
                dto.setPendingCount((int) pending);
            } else {
                dto.setAssignedCount(0);
                dto.setCompletedCount(0);
                dto.setPendingCount(0);
            }

            dto.setAvgTime(24.5);
            dto.setRating(4.5);

            performanceList.add(dto);
        }

        return performanceList;
    }

    public List<User> getTopActiveUsers(int limit) {
        List<User> activeUsers = userRepository.findTopActiveUsers();
        return activeUsers.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public long getTotalAdminCount() {
        return userRepository.countAdmins();
    }
}