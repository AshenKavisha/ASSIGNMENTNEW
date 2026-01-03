package com.assignmentservice.controller;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Payment;
import com.assignmentservice.model.User;
import com.assignmentservice.repository.PaymentRepository;
import com.assignmentservice.service.AssignmentService;
import com.assignmentservice.service.EmailService;
import com.assignmentservice.service.PayHereService;
import com.assignmentservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/payment")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PayHereService payHereService;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EmailService emailService;

    @Value("${payhere.api.url}")
    private String payhereApiUrl;

    @GetMapping("/pay/{token}")
    public String paymentPage(@PathVariable String token, Model model, RedirectAttributes redirectAttributes) {
        try {
            Optional<Payment> paymentOpt = payHereService.getPaymentByToken(token);

            if (paymentOpt.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Invalid payment link");
                return "redirect:/dashboard";
            }

            Payment payment = paymentOpt.get();

            if (!payment.isTokenValid()) {
                redirectAttributes.addFlashAttribute("error", "Payment link has expired. Please contact admin.");
                return "redirect:/dashboard";
            }

            if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
                redirectAttributes.addFlashAttribute("info", "This assignment has already been paid");
                return "redirect:/dashboard";
            }

            Assignment assignment = payment.getAssignment();
            User user = payment.getUser();

            String hash = payHereService.generatePaymentHash(
                    payment.getOrderId(),
                    payment.getAmount(),
                    payment.getCurrency().name()
            );

            model.addAttribute("payment", payment);
            model.addAttribute("assignment", assignment);
            model.addAttribute("user", user);
            model.addAttribute("merchantId", payHereService.getMerchantId());
            model.addAttribute("orderId", payment.getOrderId());
            model.addAttribute("amount", String.format("%.2f", payment.getAmount()));
            model.addAttribute("currency", payment.getCurrency().name());
            model.addAttribute("hash", hash);
            model.addAttribute("payhereApiUrl", payhereApiUrl);
            model.addAttribute("returnUrl", payHereService.getReturnUrl());
            model.addAttribute("cancelUrl", payHereService.getCancelUrl());
            model.addAttribute("notifyUrl", payHereService.getNotifyUrl());

            log.info("Payment page loaded for order: {}", payment.getOrderId());
            return "payment/checkout";

        } catch (Exception e) {
            log.error("Error loading payment page", e);
            redirectAttributes.addFlashAttribute("error", "Error loading payment page: " + e.getMessage());
            return "redirect:/dashboard";
        }
    }

    @PostMapping("/notify")
    @ResponseBody
    public String handlePaymentNotification(@RequestParam Map<String, String> params) {
        try {
            log.info("Received PayHere notification: {}", params);

            String orderId = params.get("order_id");
            String paymentId = params.get("payment_id");
            String amount = params.get("payhere_amount");
            String currency = params.get("payhere_currency");
            String statusCode = params.get("status_code");
            String hash = params.get("md5sig");
            String paymentMethod = params.get("method");
            String cardHolderName = params.get("card_holder_name");
            String cardNumber = params.get("card_no");

            if (!payHereService.verifyPaymentNotification(orderId, paymentId, amount, statusCode, hash)) {
                log.error("Invalid hash for payment notification: Order ID = {}", orderId);
                return "INVALID_HASH";
            }

            switch (statusCode) {
                case "2": // Success
                    payHereService.processPaymentSuccess(orderId, paymentId, statusCode,
                            paymentMethod, cardHolderName, cardNumber);
                    break;
                case "-1": // Cancelled
                    payHereService.processPaymentCancellation(orderId);
                    break;
                case "-2": // Failed
                case "-3": // Chargedback
                    payHereService.processPaymentFailure(orderId, statusCode);
                    break;
                default:
                    log.warn("Unknown status code: {} for order: {}", statusCode, orderId);
                    break;
            }

            return "OK";
        } catch (Exception e) {
            log.error("Error processing payment notification", e);
            return "ERROR";
        }
    }

    @GetMapping("/return")
    public String paymentReturn(
            @RequestParam(required = false) String order_id,
            @RequestParam(required = false) String payment_id,
            @RequestParam(required = false) String status_code,
            Model model,
            RedirectAttributes redirectAttributes) {

        try {
            log.info("Payment return: order_id={}, payment_id={}, status_code={}",
                    order_id, payment_id, status_code);

            if (order_id == null) {
                redirectAttributes.addFlashAttribute("error", "Invalid payment response");
                return "redirect:/dashboard";
            }

            Optional<Payment> paymentOpt = paymentRepository.findByOrderId(order_id);
            if (paymentOpt.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Payment record not found");
                return "redirect:/dashboard";
            }

            Payment payment = paymentOpt.get();
            Assignment assignment = payment.getAssignment();

            model.addAttribute("payment", payment);
            model.addAttribute("assignment", assignment);
            model.addAttribute("statusCode", status_code);

            if ("2".equals(status_code)) {
                model.addAttribute("success", true);
                model.addAttribute("message", "Payment successful! Admin will start working on your assignment soon.");
            } else if ("0".equals(status_code)) {
                model.addAttribute("pending", true);
                model.addAttribute("message", "Payment is being processed. You will be notified once confirmed.");
            } else {
                model.addAttribute("failed", true);
                model.addAttribute("message", "Payment was not completed. Please try again or contact support.");
            }

            return "payment/result";
        } catch (Exception e) {
            log.error("Error processing payment return", e);
            redirectAttributes.addFlashAttribute("error", "Error processing payment: " + e.getMessage());
            return "redirect:/dashboard";
        }
    }

    @GetMapping("/cancel")
    public String paymentCancel(@RequestParam(required = false) String order_id,
                                Model model) {
        log.info("Payment cancelled: order_id={}", order_id);

        if (order_id != null) {
            payHereService.processPaymentCancellation(order_id);
        }

        model.addAttribute("cancelled", true);
        model.addAttribute("message", "Payment was cancelled. You can try again anytime from your dashboard.");
        return "payment/result";
    }

    @PostMapping("/resend/{assignmentId}")
    public String resendPaymentLink(@PathVariable Long assignmentId, RedirectAttributes redirectAttributes) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return "redirect:/login";
            }

            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(assignmentId);
            if (assignmentOpt.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Assignment not found");
                return "redirect:/dashboard";
            }

            Assignment assignment = assignmentOpt.get();
            if (!assignment.getUser().getId().equals(currentUser.getId())) {
                redirectAttributes.addFlashAttribute("error", "Unauthorized access");
                return "redirect:/dashboard";
            }

            Optional<Payment> paymentOpt = payHereService.getPaymentByAssignment(assignment);
            if (paymentOpt.isEmpty() || paymentOpt.get().getStatus() != Payment.PaymentStatus.PENDING) {
                redirectAttributes.addFlashAttribute("error", "No pending payment found for this assignment");
                return "redirect:/dashboard";
            }

            emailService.sendPaymentLinkEmail(paymentOpt.get());
            redirectAttributes.addFlashAttribute("success", "Payment link has been resent to your email");
            return "redirect:/dashboard";

        } catch (Exception e) {
            log.error("Error resending payment link", e);
            redirectAttributes.addFlashAttribute("error", "Error resending payment link");
            return "redirect:/dashboard";
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String email = authentication.getName();
        Optional<User> userOpt = userService.getUserByEmail(email);
        return userOpt.orElse(null);
    }
}