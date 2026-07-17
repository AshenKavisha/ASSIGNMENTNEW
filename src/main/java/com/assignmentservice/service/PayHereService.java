package com.assignmentservice.service;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Payment;
import com.assignmentservice.model.User;
import com.assignmentservice.repository.PaymentRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PayHereService {

    private static final Logger log = LoggerFactory.getLogger(PayHereService.class);

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    @Value("${payhere.return.url}")
    private String returnUrl;

    @Value("${payhere.cancel.url}")
    private String cancelUrl;

    @Value("${payhere.notify.url}")
    private String notifyUrl;

    @Value("${app.url:http://localhost:8080}")
    private String appUrl;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AssignmentService assignmentService;

    public Payment createPayment(Assignment assignment, Double amount, Payment.Currency currency) {
        Optional<Payment> existingPayment = paymentRepository.findByAssignment(assignment);
        if (existingPayment.isPresent() &&
                existingPayment.get().getStatus() == Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Payment already completed for this assignment");
        }

        Payment payment = new Payment(assignment, assignment.getUser(), amount, currency);
        String token = UUID.randomUUID().toString().replace("-", "");
        payment.setPaymentToken(token);
        payment.setTokenExpiresAt(LocalDateTime.now().plusDays(7));

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Created payment: Order ID = {}, Amount = {} {}",
                savedPayment.getOrderId(), amount, currency);

        return savedPayment;
    }

    public String generatePaymentHash(String orderId, Double amount, String currency) {
        try {
            String merchantSecretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
            String hashString = merchantId + orderId + String.format("%.2f", amount) +
                    currency + merchantSecretHash;
            String hash = DigestUtils.md5Hex(hashString).toUpperCase();
            log.debug("Generated PayHere hash for order: {}", orderId);
            return hash;
        } catch (Exception e) {
            log.error("Error generating PayHere hash", e);
            throw new RuntimeException("Error generating payment hash", e);
        }
    }

    public boolean verifyPaymentNotification(String orderId, String paymentId,
                                             String amount, String statusCode, String receivedHash) {
        try {
            String merchantSecretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
            String hashString = merchantId + orderId + amount + statusCode + merchantSecretHash;
            String calculatedHash = DigestUtils.md5Hex(hashString).toUpperCase();

            boolean isValid = calculatedHash.equals(receivedHash);
            if (isValid) {
                log.info("Payment verification successful for order: {}", orderId);
            } else {
                log.warn("Payment verification failed for order: {}. Hash mismatch!", orderId);
            }
            return isValid;
        } catch (Exception e) {
            log.error("Error verifying payment notification", e);
            return false;
        }
    }

    @Transactional
    public void processPaymentSuccess(String orderId, String paymentId, String statusCode,
                                      String paymentMethod, String cardHolderName, String cardNumber) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
            if (paymentOpt.isEmpty()) {
                log.error("Payment not found for order ID: {}", orderId);
                return;
            }

            Payment payment = paymentOpt.get();
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setPayherePaymentId(paymentId);
            payment.setStatusCode(statusCode);
            payment.setPaymentMethod(paymentMethod);
            payment.setCardHolderName(cardHolderName);
            payment.setCardNumber(cardNumber);
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);

            Assignment assignment = payment.getAssignment();
            assignment.setStatus(Assignment.AssignmentStatus.PAID);
            assignment.setFinalPrice(payment.getAmount());
            assignmentService.saveAssignment(assignment);

            try {
                emailService.sendPaymentConfirmationEmail(payment);
            } catch (Exception e) {
                log.error("Failed to send payment confirmation email", e);
            }

            try {
                notificationService.notifyUserPaymentReceived(payment);
            } catch (Exception e) {
                log.error("Failed to send payment notification", e);
            }

            try {
                notificationService.notifyAdminPaymentReceived(payment);
            } catch (Exception e) {
                log.error("Failed to send admin notification", e);
            }

            log.info("Payment processed successfully: Order ID = {}, Payment ID = {}",
                    orderId, paymentId);
        } catch (Exception e) {
            log.error("Error processing payment success", e);
            throw new RuntimeException("Error processing payment", e);
        }
    }

    @Transactional
    public void processPaymentFailure(String orderId, String statusCode) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
            if (paymentOpt.isEmpty()) {
                log.error("Payment not found for order ID: {}", orderId);
                return;
            }

            Payment payment = paymentOpt.get();
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setStatusCode(statusCode);
            paymentRepository.save(payment);

            log.info("Payment failed: Order ID = {}, Status Code = {}", orderId, statusCode);
        } catch (Exception e) {
            log.error("Error processing payment failure", e);
        }
    }

    @Transactional
    public void processPaymentCancellation(String orderId) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
            if (paymentOpt.isEmpty()) {
                log.error("Payment not found for order ID: {}", orderId);
                return;
            }

            Payment payment = paymentOpt.get();
            payment.setStatus(Payment.PaymentStatus.CANCELLED);
            paymentRepository.save(payment);

            log.info("Payment cancelled: Order ID = {}", orderId);
        } catch (Exception e) {
            log.error("Error processing payment cancellation", e);
        }
    }

    public Optional<Payment> getPaymentByToken(String token) {
        return paymentRepository.findByPaymentToken(token);
    }

    public Optional<Payment> getPaymentByAssignment(Assignment assignment) {
        return paymentRepository.findByAssignment(assignment);
    }

    public List<Payment> getUserPayments(User user) {
        return paymentRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public String getMerchantId() { return merchantId; }
    public String getReturnUrl() { return returnUrl; }
    public String getCancelUrl() { return cancelUrl; }
    public String getNotifyUrl() { return notifyUrl; }
}