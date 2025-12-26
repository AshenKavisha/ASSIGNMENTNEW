package com.assignmentservice.repository;

import com.assignmentservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Basic CRUD operations
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Role-based queries
    List<User> findByRole(String role);
    List<User> findByRoleAndSpecialization(String role, User.Specialization specialization);

    // Profile and status queries
    List<User> findByEmailVerified(boolean verified);
    List<User> findByFullNameContainingIgnoreCase(String name);

    // Date-based queries
    long countByCreatedAtAfter(LocalDateTime date);
    long countByRoleAndCreatedAtAfter(String role, LocalDateTime date);

    // Online users query
    @Query("SELECT u FROM User u WHERE u.lastLogin >= :since")
    List<User> findOnlineUsers(@Param("since") LocalDateTime since);

    // Active users query (based on last login)
    @Query("SELECT u FROM User u WHERE u.lastLogin IS NOT NULL ORDER BY u.lastLogin DESC")
    List<User> findTopActiveUsers();

    // Admin statistics
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'ADMIN'")
    long countAdmins();

    // Customer statistics
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'USER'")
    long countCustomers();

    // New users in timeframe
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
    long countNewUsersBetween(@Param("startDate") LocalDateTime startDate,
                              @Param("endDate") LocalDateTime endDate);

    // Users with profile pictures
    @Query("SELECT u FROM User u WHERE u.profilePicture IS NOT NULL")
    List<User> findUsersWithProfilePictures();

    // Search users by multiple criteria
    @Query("SELECT u FROM User u WHERE " +
            "(:name IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
            "(:role IS NULL OR u.role = :role)")
    List<User> searchUsers(@Param("name") String name,
                           @Param("email") String email,
                           @Param("role") String role);

    // Get users by specialization
    @Query("SELECT u FROM User u WHERE u.specialization = :specialization")
    List<User> findBySpecialization(@Param("specialization") User.Specialization specialization);

    // Get users with assignments in a specific status
    @Query("SELECT DISTINCT u FROM User u JOIN u.assignments a WHERE a.status = :status")
    List<User> findUsersWithAssignmentStatus(@Param("status") String status);

    // Count users by role and verification status
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.emailVerified = :verified")
    long countByRoleAndEmailVerified(@Param("role") String role,
                                     @Param("verified") boolean verified);

    // Find users who have not logged in for a while
    @Query("SELECT u FROM User u WHERE u.lastLogin < :cutoffDate OR u.lastLogin IS NULL")
    List<User> findInactiveUsers(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Get users sorted by assignment count
    @Query("SELECT u FROM User u LEFT JOIN u.assignments a GROUP BY u.id ORDER BY COUNT(a.id) DESC")
    List<User> findAllOrderByAssignmentCount();

    // Find users by location
    @Query("SELECT u FROM User u WHERE u.location IS NOT NULL AND LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<User> findByLocationContainingIgnoreCase(@Param("location") String location);

    // Get users with recent activity (login or assignment creation)
    @Query("SELECT u FROM User u WHERE u.lastLogin >= :recent OR " +
            "EXISTS (SELECT a FROM Assignment a WHERE a.user = u AND a.createdAt >= :recent)")
    List<User> findUsersWithRecentActivity(@Param("recent") LocalDateTime recent);
}