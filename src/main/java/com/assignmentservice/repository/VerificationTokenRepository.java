package com.assignmentservice.repository;

import com.assignmentservice.model.User;
import com.assignmentservice.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);

    Optional<VerificationToken> findByUser(User user);

    @Modifying
    @Query("DELETE FROM VerificationToken t WHERE t.expiryDate <= ?1")
    void deleteAllExpiredTokens(LocalDateTime now);

    @Modifying
    @Query("DELETE FROM VerificationToken t WHERE t.user = ?1")
    void deleteByUser(User user);
}