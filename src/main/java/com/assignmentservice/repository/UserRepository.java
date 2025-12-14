package com.assignmentservice.repository;

import com.assignmentservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // New methods for admin management
    List<User> findByRole(String role);
    List<User> findByRoleAndSpecialization(String role, User.Specialization specialization);

    // Methods for reports
    long countByCreatedAtAfter(LocalDateTime date);
    long countByRoleAndCreatedAtAfter(String role, LocalDateTime date);

    @Query("SELECT u FROM User u WHERE u.lastLogin IS NOT NULL ORDER BY u.lastLogin DESC")
    List<User> findTopActiveUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'ADMIN'")
    long countAdmins();
}