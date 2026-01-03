package com.assignmentservice.repository;

import com.assignmentservice.model.Payment;
import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(String orderId);
    Optional<Payment> findByAssignment(Assignment assignment);
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
    Optional<Payment> findByPaymentToken(String token);
    Optional<Payment> findByPayherePaymentId(String payherePaymentId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    List<Payment> findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus status);
    List<Payment> findByUserAndStatus(User user, Payment.PaymentStatus status);
    long countByStatus(Payment.PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' AND p.tokenExpiresAt < :now")
    List<Payment> findExpiredPendingPayments(@Param("now") LocalDateTime now);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.currency = :currency")
    Double getTotalRevenueByCurrency(@Param("currency") Payment.Currency currency);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'COMPLETED'")
    long countSuccessfulPayments();

    @Query("SELECT p FROM Payment p WHERE p.status = 'COMPLETED' ORDER BY p.paidAt DESC")
    List<Payment> findRecentCompletedPayments();

    boolean existsByAssignment(Assignment assignment);

    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate ORDER BY p.createdAt DESC")
    List<Payment> findPaymentsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);
}