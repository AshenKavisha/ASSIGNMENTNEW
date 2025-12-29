package com.assignmentservice.service;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.RevisionRequest;
import com.assignmentservice.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.url:http://localhost:8080}")
    private String appUrl;

    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${app.admin.email:admin@assignmentservice.com}")
    private String adminEmail;

    // ==========================================
    // EXISTING METHODS - Keep all your current methods
    // ==========================================

    public void sendAssignmentNotificationToAdmin(Assignment assignment) {
        // Your existing implementation - keep as is
    }

    public void sendAssignmentApprovalToUser(String userEmail, Assignment assignment) {
        // Your existing implementation - keep as is
    }

    /**
     * Send admin invitation email with login credentials
     */
    public void sendAdminInvitation(String email, String password) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String subject = "Welcome to Assignment Service - Admin Account Created";
        String content = createAdminInvitationContent(email, password);

        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content, true);

        emailSender.send(message);
    }

    /**
     /**
     * Send solution files to user via email with attachments
     */
    public void sendSolutionToUser(User user, Assignment assignment, List<MultipartFile> solutionFiles)
            throws MessagingException, IOException {

        System.out.println("========================================");
        System.out.println("SENDING EMAIL WITH ATTACHMENTS");
        System.out.println("========================================");
        System.out.println("Recipient: " + user.getEmail());
        System.out.println("Assignment: " + assignment.getTitle());
        System.out.println("Number of files: " + solutionFiles.size());

        long totalSize = 0;
        for (MultipartFile file : solutionFiles) {
            if (!file.isEmpty()) {
                long fileSize = file.getSize();
                totalSize += fileSize;
                System.out.println("File: " + file.getOriginalFilename() +
                        " | Size: " + (fileSize / 1024) + " KB" +
                        " | Type: " + file.getContentType());
            }
        }
        System.out.println("Total attachment size: " + (totalSize / 1024) + " KB (" + (totalSize / (1024 * 1024)) + " MB)");

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String subject = "Your Assignment Solution is Ready - " + assignment.getTitle();
        String content = createSolutionEmailContent(user, assignment);

        helper.setTo(user.getEmail());
        helper.setSubject(subject);
        helper.setText(content, true);

        // Attach solution files
        int attachmentCount = 0;
        for (MultipartFile file : solutionFiles) {
            if (!file.isEmpty()) {
                try {
                    System.out.println("Attaching file: " + file.getOriginalFilename());
                    helper.addAttachment(
                            file.getOriginalFilename(),
                            new ByteArrayResource(file.getBytes()),
                            file.getContentType()
                    );
                    attachmentCount++;
                    System.out.println("✓ Successfully attached: " + file.getOriginalFilename());
                } catch (Exception e) {
                    System.err.println("✗ Failed to attach file: " + file.getOriginalFilename());
                    System.err.println("Error: " + e.getMessage());
                    throw e;
                }
            }
        }

        System.out.println("Total attachments added: " + attachmentCount);
        System.out.println("Sending email...");

        emailSender.send(message);

        System.out.println("✓ EMAIL SENT SUCCESSFULLY!");
        System.out.println("========================================");
    }

    /**
     * Send notification to user that solution is ready for download
     */
    public void sendSolutionNotificationToUser(User user, Assignment assignment) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String subject = "Your Assignment Solution is Ready for Download - " + assignment.getTitle();
        String content = createSolutionNotificationContent(user, assignment);

        helper.setTo(user.getEmail());
        helper.setSubject(subject);
        helper.setText(content, true);

        emailSender.send(message);
    }

    /**
     * Send verification email to new user
     */
    public void sendVerificationEmail(String toEmail, String fullName, String verificationToken) {
        if (!emailEnabled) {
            System.out.println("Email is disabled. Verification link: " + appUrl + "/verify?token=" + verificationToken);
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Email - Assignment Service");

            String verificationUrl = appUrl + "/verify?token=" + verificationToken;
            String htmlContent = buildVerificationEmail(fullName, verificationUrl);
            helper.setText(htmlContent, true);

            emailSender.send(message);
            System.out.println("Verification email sent to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String fullName, String resetToken) {
        if (!emailEnabled) {
            System.out.println("Email is disabled. Reset link: " + appUrl + "/reset-password?token=" + resetToken);
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset Your Password - Assignment Service");

            String resetUrl = appUrl + "/reset-password?token=" + resetToken;
            String htmlContent = buildPasswordResetEmail(fullName, resetUrl);
            helper.setText(htmlContent, true);

            emailSender.send(message);
            System.out.println("Password reset email sent to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    // ==========================================
    // NEW METHODS FOR REVISION FEATURE
    // ==========================================

    /**
     * Send revision request notification to admin
     */
    public void sendRevisionRequestNotificationToAdmin(Assignment assignment, RevisionRequest revisionRequest) {
        if (!emailEnabled) {
            System.out.println("Email disabled. Revision request for assignment #" + assignment.getId());
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("🔄 New Revision Request - Assignment #" + assignment.getId());
            helper.setText(buildAdminRevisionNotificationEmail(assignment, revisionRequest), true);

            emailSender.send(message);
            System.out.println("Revision request notification sent to admin for assignment #" + assignment.getId());

        } catch (MessagingException e) {
            System.err.println("Failed to send revision notification to admin: " + e.getMessage());
            // Don't throw exception - log and continue
        }
    }

    /**
     * Send revision request confirmation to user
     */
    public void sendRevisionRequestConfirmationToUser(Assignment assignment, RevisionRequest revisionRequest) {
        if (!emailEnabled) {
            System.out.println("Email disabled. Revision confirmation for user: " + assignment.getUser().getEmail());
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(assignment.getUser().getEmail());
            helper.setSubject("✅ Revision Request Received - " + assignment.getTitle());
            helper.setText(buildUserRevisionConfirmationEmail(assignment, revisionRequest), true);

            emailSender.send(message);
            System.out.println("Revision confirmation sent to user: " + assignment.getUser().getEmail());

        } catch (MessagingException e) {
            System.err.println("Failed to send revision confirmation: " + e.getMessage());
            // Don't throw exception - log and continue
        }
    }

    /**
     * Send revised solution notification to user
     */
    public void sendRevisedSolutionEmail(Assignment assignment) {
        if (!emailEnabled) {
            System.out.println("Email disabled. Revised solution ready for: " + assignment.getUser().getEmail());
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(assignment.getUser().getEmail());
            helper.setSubject("✨ Revised Solution Ready - " + assignment.getTitle());
            helper.setText(buildRevisedSolutionEmail(assignment), true);

            emailSender.send(message);
            System.out.println("Revised solution notification sent to: " + assignment.getUser().getEmail());

        } catch (MessagingException e) {
            System.err.println("Failed to send revised solution email: " + e.getMessage());
            // Don't throw exception - log and continue
        }
    }

    /**
     * Send revision rejection notification to user
     */
    public void sendRevisionRejectionEmail(Assignment assignment, String reason) {
        if (!emailEnabled) {
            System.out.println("Email disabled. Revision rejected for: " + assignment.getUser().getEmail());
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(assignment.getUser().getEmail());
            helper.setSubject("ℹ️ Revision Request Update - " + assignment.getTitle());
            helper.setText(buildRevisionRejectionEmail(assignment, reason), true);

            emailSender.send(message);
            System.out.println("Revision rejection sent to: " + assignment.getUser().getEmail());

        } catch (MessagingException e) {
            System.err.println("Failed to send revision rejection: " + e.getMessage());
            // Don't throw exception - log and continue
        }
    }

    // ==========================================
    // EXISTING EMAIL TEMPLATE BUILDERS
    // Keep all your existing template methods
    // ==========================================

    private String createAdminInvitationContent(String email, String password) {
        // Your existing implementation - keep as is
        return ""; // Replace with your actual implementation
    }

    // REPLACE THE EMPTY createSolutionEmailContent METHOD WITH THIS:

    private String createSolutionEmailContent(User user, Assignment assignment) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        String deliveryDate = assignment.getDeliveredAt() != null
                ? assignment.getDeliveredAt().format(formatter)
                : LocalDateTime.now().format(formatter);
        String dashboardLink = appUrl + "/assignments/my-assignments";

        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden;'>" +

                "<!-- Header -->" +
                "<tr><td style='background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 40px 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 28px;'>🎉 Your Solution is Ready!</h1>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 30px;'>" +
                "<p style='color: #333; font-size: 16px;'>Dear <strong>" + user.getFullName() + "</strong>,</p>" +

                "<p style='color: #333; font-size: 16px;'>We're pleased to inform you that your assignment solution for <strong>" + assignment.getTitle() + "</strong> is now complete!</p>" +

                "<div style='background: #f8f9fa; padding: 20px; border-left: 4px solid #4CAF50; margin: 25px 0;'>" +
                "<h3 style='color: #333; margin-top: 0;'>📋 Assignment Details:</h3>" +
                "<p style='margin: 5px 0;'><strong>Title:</strong> " + assignment.getTitle() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Subject:</strong> " + assignment.getSubject() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Type:</strong> " + assignment.getType() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Delivery Date:</strong> " + deliveryDate + "</p>" +
                (assignment.getPrice() != null ? "<p style='margin: 5px 0;'><strong>Price:</strong> $" + assignment.getPrice() + "</p>" : "") +
                "</div>" +

                "<div style='background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;'>" +
                "<h4 style='color: #1976D2; margin-top: 0;'>📎 Attached Files:</h4>" +
                "<p style='color: #333;'>Your solution files are attached to this email. Please download them for review.</p>" +
                "</div>" +

                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + dashboardLink + "' style='background: #4CAF50; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>View Dashboard</a>" +
                "</div>" +

                "<div style='background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;'>" +
                "<h4 style='color: #856404; margin-top: 0;'>📋 Important Notes:</h4>" +
                "<ul style='color: #856404; margin: 10px 0; padding-left: 20px;'>" +
                "<li>Please review all files carefully</li>" +
                "<li>You have " + assignment.getRemainingRevisions() + " revision(s) remaining</li>" +
                "<li>Submit revision requests through your dashboard if needed</li>" +
                "<li>Contact support for any questions</li>" +
                "</ul>" +
                "</div>" +

                "<p style='color: #333; font-size: 16px;'>Thank you for choosing our service!</p>" +
                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;'>" +
                "<p style='color: #666; margin: 0; font-size: 14px;'><strong>Best regards,</strong><br>Assignment Service Team</p>" +
                "<p style='color: #999; font-size: 12px; margin: 10px 0 0;'>This is an automated message. Please do not reply to this email.<br>For questions, contact support@assignmentservice.com</p>" +
                "</td></tr>" +

                "</table></td></tr></table>" +
                "</body></html>";
    }

    private String createSolutionNotificationContent(User user, Assignment assignment) {
        // Your existing implementation - keep as is
        return ""; // Replace with your actual implementation
    }

    private String buildVerificationEmail(String fullName, String verificationUrl) {
        // Your existing implementation - keep as is
        return ""; // Replace with your actual implementation
    }

    private String buildPasswordResetEmail(String fullName, String resetUrl) {
        // Your existing implementation - keep as is
        return ""; // Replace with your actual implementation
    }

    // ==========================================
    // NEW EMAIL TEMPLATE BUILDERS FOR REVISIONS
    // ==========================================

    private String buildAdminRevisionNotificationEmail(Assignment assignment, RevisionRequest revisionRequest) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head><meta charset='UTF-8'><title>Revision Request</title></head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden;'>" +

                "<!-- Header -->" +
                "<tr><td style='background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 24px;'>🔄 New Revision Request</h1>" +
                "<p style='color: #ffffff; margin: 5px 0 0;'>A user has requested revisions</p>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 30px;'>" +
                "<h2 style='color: #333; margin-top: 0;'>Assignment Details</h2>" +

                "<div style='background: #f8f9fa; padding: 15px; border-left: 4px solid #f093fb; margin: 15px 0; border-radius: 5px;'>" +
                "<p style='margin: 5px 0;'><strong>Assignment ID:</strong> #" + assignment.getId() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Title:</strong> " + assignment.getTitle() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Student:</strong> " + assignment.getUser().getFullName() +
                " (" + assignment.getUser().getEmail() + ")</p>" +
                "<p style='margin: 5px 0;'><strong>Subject:</strong> " + assignment.getSubject() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Revisions Used:</strong> " + assignment.getRevisionsUsed() +
                " / " + assignment.getMaxRevisions() + "</p>" +
                "</div>" +

                "<h3 style='color: #333;'>Revision Request</h3>" +
                "<div style='background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; border-radius: 5px;'>" +
                "<p style='margin: 5px 0;'><strong>Requested:</strong> " +
                revisionRequest.getRequestedAt().format(formatter) + "</p>" +
                "<p style='margin: 10px 0 5px;'><strong>Changes Requested:</strong></p>" +
                "<p style='margin: 5px 0; color: #856404;'>" + revisionRequest.getReason() + "</p>" +
                "</div>" +

                "<div style='text-align: center; margin: 25px 0;'>" +
                "<a href='" + appUrl + "/admin/assignments/" + assignment.getId() + "' " +
                "style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; " +
                "padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>" +
                "Review Assignment</a>" +
                "</div>" +

                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 20px; text-align: center;'>" +
                "<p style='color: #999; margin: 0; font-size: 12px;'>Assignment Service - Admin Notification</p>" +
                "</td></tr>" +

                "</table></td></tr></table>" +
                "</body></html>";
    }

    private String buildUserRevisionConfirmationEmail(Assignment assignment, RevisionRequest revisionRequest) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head><meta charset='UTF-8'><title>Revision Request Received</title></head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden;'>" +

                "<!-- Header -->" +
                "<tr><td style='background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 24px;'>✅ Revision Request Received</h1>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 30px;'>" +
                "<div style='background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;'>" +
                "<p style='color: #155724; margin: 0; font-weight: bold;'>Your revision request has been successfully submitted!</p>" +
                "</div>" +

                "<h2 style='color: #333; margin-top: 0;'>What Happens Next?</h2>" +
                "<div style='background: #f8f9fa; padding: 15px; border-left: 4px solid #11998e; margin: 15px 0; border-radius: 5px;'>" +
                "<p style='margin: 8px 0;'>1️⃣ Our team will review your revision request</p>" +
                "<p style='margin: 8px 0;'>2️⃣ We'll work on the requested changes</p>" +
                "<p style='margin: 8px 0;'>3️⃣ You'll receive the revised solution via email</p>" +
                "<p style='margin: 8px 0;'>4️⃣ You can download it from your dashboard</p>" +
                "</div>" +

                "<h3 style='color: #333;'>Your Revision Request</h3>" +
                "<div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;'>" +
                "<p style='margin: 5px 0;'><strong>Assignment:</strong> " + assignment.getTitle() + "</p>" +
                "<p style='margin: 10px 0 5px;'><strong>Requested Changes:</strong></p>" +
                "<p style='margin: 5px 0; color: #666;'>" + revisionRequest.getReason() + "</p>" +
                "<p style='margin: 10px 0 5px;'><strong>Remaining Revisions:</strong> " +
                assignment.getRemainingRevisions() + "</p>" +
                "</div>" +

                "<div style='background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;'>" +
                "<p style='color: #856404; margin: 0; font-size: 14px;'>" +
                "<strong>⏱️ Processing Time:</strong> We aim to process revision requests within 24-48 hours. " +
                "You'll be notified via email once the revisions are complete." +
                "</p>" +
                "</div>" +

                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 20px; text-align: center;'>" +
                "<p style='color: #999; margin: 0; font-size: 12px;'>Thank you for using Assignment Service!</p>" +
                "</td></tr>" +

                "</table></td></tr></table>" +
                "</body></html>";
    }

    private String buildRevisedSolutionEmail(Assignment assignment) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head><meta charset='UTF-8'><title>Revised Solution Ready</title></head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden;'>" +

                "<!-- Header -->" +
                "<tr><td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 24px;'>✨ Revised Solution Ready!</h1>" +
                "<p style='color: #ffffff; margin: 5px 0 0;'>Your requested revisions are complete</p>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 30px;'>" +
                "<h2 style='color: #333; margin-top: 0;'>Good News, " + assignment.getUser().getFullName() + "!</h2>" +

                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "We've completed the revisions you requested for <strong>" + assignment.getTitle() + "</strong>." +
                "</p>" +

                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "The revised solution is now available for download from your dashboard." +
                "</p>" +

                "<div style='text-align: center; margin: 25px 0;'>" +
                "<a href='" + appUrl + "/assignments/my-assignments' " +
                "style='background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; " +
                "padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>" +
                "Download Revised Solution</a>" +
                "</div>" +

                "<div style='background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px;'>" +
                "<p style='color: #1565C0; margin: 0; font-size: 14px;'>" +
                "<strong>💡 What's Next?</strong><br>" +
                "If you're satisfied with the revisions, great! If you need further changes and have remaining revisions, " +
                "you can request them from your dashboard." +
                "</p>" +
                "</div>" +

                "<p style='margin: 15px 0; color: #666;'>" +
                "<strong>Remaining Revisions:</strong> " + assignment.getRemainingRevisions() +
                "</p>" +

                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 20px; text-align: center;'>" +
                "<p style='color: #999; margin: 0; font-size: 12px;'>© 2024 Assignment Service. All rights reserved.</p>" +
                "</td></tr>" +

                "</table></td></tr></table>" +
                "</body></html>";
    }

    private String buildRevisionRejectionEmail(Assignment assignment, String reason) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head><meta charset='UTF-8'><title>Revision Request Update</title></head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden;'>" +

                "<!-- Header -->" +
                "<tr><td style='background: #6c757d; padding: 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 24px;'>ℹ️ Revision Request Update</h1>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 30px;'>" +
                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "Dear " + assignment.getUser().getFullName() + "," +
                "</p>" +

                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "We've reviewed your revision request for <strong>" + assignment.getTitle() + "</strong>." +
                "</p>" +

                "<div style='background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;'>" +
                "<p style='color: #856404; margin: 0 0 10px; font-weight: bold;'>Admin Response:</p>" +
                "<p style='color: #856404; margin: 0;'>" + reason + "</p>" +
                "</div>" +

                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "Your revision count has been restored. If you have any questions, please contact our support team." +
                "</p>" +

                "<div style='background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px;'>" +
                "<p style='color: #1565C0; margin: 0; font-size: 14px;'>" +
                "<strong>Available Revisions:</strong> " + assignment.getRemainingRevisions() +
                "</p>" +
                "</div>" +

                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 20px; text-align: center;'>" +
                "<p style='color: #999; margin: 0; font-size: 12px;'>© 2024 Assignment Service. All rights reserved.</p>" +
                "</td></tr>" +

                "</table></td></tr></table>" +
                "</body></html>";
    }
}