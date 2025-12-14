package com.assignmentservice.service;

import com.assignmentservice.dto.AdminPerformanceDto;
import com.assignmentservice.model.User;
import com.assignmentservice.repository.UserRepository;
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

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setRole("USER");
        user.setSpecialization(User.Specialization.NONE);

        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // NEW METHODS FOR ADMIN MANAGEMENT

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllAdmins() {
        return userRepository.findByRole("ADMIN");
    }

    // ADD THIS METHOD - Get all customers (users with role USER)
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

        return userRepository.save(user);
    }

    // REPORT METHODS

    public Map<String, Object> getUserStatistics(LocalDateTime startDate) {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.countByCreatedAtAfter(startDate);
        long totalAdmins = userRepository.countByRoleAndCreatedAtAfter("ADMIN", startDate);

        // Get active users (those who have logged in)
        List<User> activeUsersList = userRepository.findTopActiveUsers();
        long activeUsers = activeUsersList.size();

        stats.put("totalUsers", totalUsers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("activeUsers", activeUsers);
        stats.put("newUsers", totalUsers); // For simplicity

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

            // Get assignment counts
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

            // Calculate average time and rating (simplified for now)
            dto.setAvgTime(24.5); // Example value
            dto.setRating(4.5); // Example value

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