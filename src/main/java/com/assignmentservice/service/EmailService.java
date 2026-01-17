package com.assignmentservice.service;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Payment;
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
        String loginUrl = appUrl + "/login";

        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head><meta charset='UTF-8'><title>Admin Invitation</title></head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +

                "<!-- Header -->" +
                "<tr><td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 28px;'>🎉 Welcome to the Admin Team!</h1>" +
                "<p style='color: #ffffff; margin: 10px 0 0; font-size: 16px;'>Your administrator account has been created</p>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 40px 30px;'>" +
                "<h2 style='color: #333; margin-top: 0; font-size: 24px;'>Welcome Aboard!</h2>" +

                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "You have been granted administrator access to the Assignment Service platform. " +
                "Use the credentials below to log in and start managing assignments." +
                "</p>" +

                "<!-- Credentials Box -->" +
                "<div style='background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;'>" +
                "<h3 style='color: #333; margin-top: 0; font-size: 18px;'>🔐 Your Login Credentials</h3>" +
                "<p style='margin: 10px 0;'><strong style='color: #555;'>Email:</strong> <span style='color: #667eea;'>" + email + "</span></p>" +
                "<p style='margin: 10px 0;'><strong style='color: #555;'>Temporary Password:</strong> <span style='color: #667eea; font-family: monospace;'>" + password + "</span></p>" +
                "</div>" +

                "<!-- Login Button -->" +
                "<div style='text-align: center; margin: 35px 0;'>" +
                "<a href='" + loginUrl + "' " +
                "style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; " +
                "padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; " +
                "font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +
                "🚀 Access Admin Portal" +
                "</a>" +
                "</div>" +

                "<!-- Important Security Notice -->" +
                "<div style='background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 5px;'>" +
                "<h4 style='color: #856404; margin-top: 0; font-size: 16px;'>🔒 Important Security Notice</h4>" +
                "<ul style='color: #856404; margin: 10px 0; padding-left: 20px; line-height: 1.8;'>" +
                "<li>Please change your password immediately after your first login</li>" +
                "<li>Keep your credentials confidential</li>" +
                "<li>Never share your admin access with anyone</li>" +
                "<li>Log out when you're done working</li>" +
                "</ul>" +
                "</div>" +

                "<!-- Admin Responsibilities -->" +
                "<div style='background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 25px 0;'>" +
                "<h4 style='color: #1976D2; margin-top: 0; font-size: 16px;'>📋 Your Admin Responsibilities</h4>" +
                "<ul style='color: #1565C0; margin: 10px 0; padding-left: 20px; line-height: 1.8;'>" +
                "<li>Review and approve assignment submissions</li>" +
                "<li>Manage user requests and inquiries</li>" +
                "<li>Upload and deliver assignment solutions</li>" +
                "<li>Monitor system performance and reports</li>" +
                "</ul>" +
                "</div>" +

                "<!-- Alternative Link -->" +
                "<div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 25px 0;'>" +
                "<p style='color: #666; margin: 0 0 10px; font-size: 14px;'>" +
                "<strong>Button not working?</strong> Copy and paste this link:" +
                "</p>" +
                "<p style='color: #667eea; margin: 0; font-size: 14px; word-break: break-all;'>" +
                loginUrl +
                "</p>" +
                "</div>" +

                "<p style='color: #999; font-size: 14px; line-height: 1.6; margin: 25px 0 0;'>" +
                "If you have any questions or need assistance, please contact the system administrator." +
                "</p>" +

                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;'>" +
                "<p style='color: #666; margin: 0 0 10px; font-size: 14px;'><strong>Best regards,</strong></p>" +
                "<p style='color: #666; margin: 0 0 15px; font-size: 14px;'>Assignment Service Team</p>" +
                "<p style='color: #999; font-size: 12px; margin: 15px 0 0;'>" +
                "This is an automated message containing sensitive information.<br>" +
                "© 2024 Assignment Service. All rights reserved." +
                "</p>" +
                "</td></tr>" +

                "</table></td></tr></table>" +
                "</body></html>";
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
                "<tr><td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 28px;'>🎉 Solution Ready for Download!</h1>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 30px;'>" +
                "<p style='color: #333; font-size: 16px;'>Dear <strong>" + user.getFullName() + "</strong>,</p>" +

                "<p style='color: #333; font-size: 16px;'>Great news! Your assignment solution for <strong>" + assignment.getTitle() + "</strong> is now ready and available for download!</p>" +

                "<div style='background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea; margin: 25px 0;'>" +
                "<h3 style='color: #333; margin-top: 0;'>📋 Assignment Details:</h3>" +
                "<p style='margin: 5px 0;'><strong>Title:</strong> " + assignment.getTitle() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Subject:</strong> " + assignment.getSubject() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Type:</strong> " + assignment.getType() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Delivery Date:</strong> " + deliveryDate + "</p>" +
                (assignment.getPrice() != null ? "<p style='margin: 5px 0;'><strong>Price:</strong> $" + assignment.getPrice() + "</p>" : "") +
                "</div>" +

                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + dashboardLink + "' style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>Download Solution</a>" +
                "</div>" +

                "<div style='background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;'>" +
                "<h4 style='color: #1976D2; margin-top: 0;'>📥 How to Download:</h4>" +
                "<ol style='color: #333; margin: 10px 0; padding-left: 20px;'>" +
                "<li>Click the button above to go to your dashboard</li>" +
                "<li>Find your assignment in 'My Assignments'</li>" +
                "<li>Click the download button to get your files</li>" +
                "</ol>" +
                "</div>" +

                "<div style='background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;'>" +
                "<h4 style='color: #856404; margin-top: 0;'>📝 Important Notes:</h4>" +
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

    private String buildVerificationEmail(String fullName, String verificationUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head><meta charset='UTF-8'><title>Verify Your Email</title></head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +

                "<!-- Header -->" +
                "<tr><td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 28px;'>Welcome to Assignment Service!</h1>" +
                "<p style='color: #ffffff; margin: 10px 0 0; font-size: 16px;'>Just one more step to get started</p>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 40px 30px;'>" +
                "<h2 style='color: #333; margin-top: 0; font-size: 24px;'>Hello " + fullName + "!</h2>" +

                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "Thank you for registering with Assignment Service. We're excited to have you on board!" +
                "</p>" +

                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "To complete your registration and activate your account, please verify your email address by clicking the button below:" +
                "</p>" +

                "<!-- Verification Button -->" +
                "<div style='text-align: center; margin: 35px 0;'>" +
                "<a href='" + verificationUrl + "' " +
                "style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; " +
                "padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; " +
                "font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +
                "✅ Verify Email Address" +
                "</a>" +
                "</div>" +

                "<!-- Alternative Link -->" +
                "<div style='background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 25px 0;'>" +
                "<p style='color: #666; margin: 0 0 10px; font-size: 14px;'>" +
                "<strong>Button not working?</strong> Copy and paste this link into your browser:" +
                "</p>" +
                "<p style='color: #667eea; margin: 0; font-size: 14px; word-break: break-all;'>" +
                verificationUrl +
                "</p>" +
                "</div>" +

                "<!-- Important Info -->" +
                "<div style='background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 5px;'>" +
                "<p style='color: #856404; margin: 0; font-size: 14px;'>" +
                "<strong>⏰ Important:</strong> This verification link will expire in 24 hours for security reasons." +
                "</p>" +
                "</div>" +

                "<p style='color: #999; font-size: 14px; line-height: 1.6; margin: 25px 0 0;'>" +
                "If you didn't create an account with Assignment Service, please ignore this email." +
                "</p>" +

                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;'>" +
                "<p style='color: #666; margin: 0 0 10px; font-size: 14px;'><strong>Best regards,</strong></p>" +
                "<p style='color: #666; margin: 0 0 15px; font-size: 14px;'>Assignment Service Team</p>" +
                "<p style='color: #999; font-size: 12px; margin: 15px 0 0;'>" +
                "This is an automated message. Please do not reply to this email.<br>" +
                "For questions, contact support@assignmentservice.com" +
                "</p>" +
                "</td></tr>" +

                "</table></td></tr></table>" +
                "</body></html>";
    }

    private String buildPasswordResetEmail(String fullName, String resetUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head><meta charset='UTF-8'><title>Reset Your Password</title></head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden;'>" +

                "<!-- Header -->" +
                "<tr><td style='background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 28px;'>🔒 Reset Your Password</h1>" +
                "</td></tr>" +

                "<!-- Body -->" +
                "<tr><td style='padding: 40px 30px;'>" +
                "<h2 style='color: #333; margin-top: 0;'>Hello " + fullName + ",</h2>" +

                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "We received a request to reset your password. Click the button below to create a new password:" +
                "</p>" +

                "<div style='text-align: center; margin: 35px 0;'>" +
                "<a href='" + resetUrl + "' " +
                "style='background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; " +
                "padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>" +
                "Reset Password" +
                "</a>" +
                "</div>" +

                "<div style='background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 25px 0;'>" +
                "<p style='color: #666; margin: 0 0 10px; font-size: 14px;'><strong>Link not working?</strong></p>" +
                "<p style='color: #667eea; margin: 0; font-size: 14px; word-break: break-all;'>" + resetUrl + "</p>" +
                "</div>" +

                "<div style='background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 5px;'>" +
                "<p style='color: #856404; margin: 0; font-size: 14px;'>" +
                "<strong>⏰ This link expires in 1 hour</strong> for security reasons." +
                "</p>" +
                "</div>" +

                "<p style='color: #999; font-size: 14px;'>" +
                "If you didn't request a password reset, please ignore this email or contact support if you have concerns." +
                "</p>" +

                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 20px; text-align: center;'>" +
                "<p style='color: #999; margin: 0; font-size: 12px;'>© 2024 Assignment Service. All rights reserved.</p>" +
                "</td></tr>" +

                "</table></td></tr></table>" +
                "</body></html>";
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

    /**
     * Send assignment notification to admin WITH attached files
     */
    public void sendAssignmentNotificationToAdminWithFiles(Assignment assignment,
                                                           List<MultipartFile> descriptionFiles,
                                                           List<MultipartFile> requirementFiles) {
        if (!emailEnabled) {
            System.out.println("⚠️ Email is disabled. Assignment notification skipped.");
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("🔔 New Assignment Submitted - " + assignment.getTitle());

            String htmlContent = buildAdminAssignmentNotificationEmailWithFiles(assignment);
            helper.setText(htmlContent, true);

            // Attach description files
            int totalAttachments = 0;
            long totalSize = 0;

            if (descriptionFiles != null && !descriptionFiles.isEmpty()) {
                for (MultipartFile file : descriptionFiles) {
                    if (!file.isEmpty()) {
                        helper.addAttachment(
                                "[DESC] " + file.getOriginalFilename(),
                                new ByteArrayResource(file.getBytes()),
                                file.getContentType()
                        );
                        totalAttachments++;
                        totalSize += file.getSize();
                        System.out.println("📎 Attached description file: " + file.getOriginalFilename() +
                                " (" + (file.getSize() / 1024) + " KB)");
                    }
                }
            }

            // Attach requirement files
            if (requirementFiles != null && !requirementFiles.isEmpty()) {
                for (MultipartFile file : requirementFiles) {
                    if (!file.isEmpty()) {
                        helper.addAttachment(
                                "[REQ] " + file.getOriginalFilename(),
                                new ByteArrayResource(file.getBytes()),
                                file.getContentType()
                        );
                        totalAttachments++;
                        totalSize += file.getSize();
                        System.out.println("📎 Attached requirement file: " + file.getOriginalFilename() +
                                " (" + (file.getSize() / 1024) + " KB)");
                    }
                }
            }

            System.out.println("📧 Sending to admin: " + adminEmail);
            System.out.println("   Total attachments: " + totalAttachments);
            System.out.println("   Total size: " + (totalSize / (1024 * 1024)) + " MB");

            emailSender.send(message);
            System.out.println("✅ Assignment notification with files sent successfully!");

        } catch (Exception e) {
            System.err.println("❌ Failed to send assignment notification: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send assignment notification: " + e.getMessage(), e);
        }
    }

    private String buildAdminAssignmentNotificationEmailWithFiles(Assignment assignment) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        String submittedDate = assignment.getCreatedAt() != null
                ? assignment.getCreatedAt().format(formatter)
                : LocalDateTime.now().format(formatter);

        int descFileCount = assignment.getDescriptionFileList() != null
                ? (int) assignment.getDescriptionFileList().stream().filter(f -> !f.isEmpty()).count()
                : 0;
        int reqFileCount = assignment.getRequirementsFileList() != null
                ? (int) assignment.getRequirementsFileList().stream().filter(f -> !f.isEmpty()).count()
                : 0;
        int totalFiles = descFileCount + reqFileCount;

        return "<!DOCTYPE html>" +
                "<html><body style='font-family: Arial, sans-serif; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 30px; border-radius: 10px;'>" +
                "<h2 style='color: #667eea;'>🔔 New Assignment Submitted</h2>" +

                "<div style='background: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>" +
                "<h3 style='color: #333; margin-top: 0;'>📋 Assignment Details</h3>" +
                "<p><strong>ID:</strong> #" + assignment.getId() + "</p>" +
                "<p><strong>Title:</strong> " + assignment.getTitle() + "</p>" +
                "<p><strong>Type:</strong> " + assignment.getType() + "</p>" +
                "<p><strong>Subject:</strong> " + assignment.getSubject() + "</p>" +
                "<p><strong>Deadline:</strong> " + assignment.getDeadline() + "</p>" +
                "<p><strong>Submitted:</strong> " + submittedDate + "</p>" +
                "</div>" +

                "<div style='background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;'>" +
                "<h3 style='color: #1565C0; margin-top: 0;'>👤 Student Information</h3>" +
                "<p><strong>Name:</strong> " + assignment.getUser().getFullName() + "</p>" +
                "<p><strong>Email:</strong> " + assignment.getUser().getEmail() + "</p>" +
                "</div>" +

                "<div style='background: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>" +
                "<h3 style='color: #333; margin-top: 0;'>📝 Description</h3>" +
                "<p style='white-space: pre-wrap;'>" + assignment.getDescription() + "</p>" +
                "</div>" +

                (assignment.getAdditionalRequirements() != null && !assignment.getAdditionalRequirements().isEmpty() ?
                        "<div style='background: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>" +
                                "<h3 style='color: #333; margin-top: 0;'>⚙️ Additional Requirements</h3>" +
                                "<p style='white-space: pre-wrap;'>" + assignment.getAdditionalRequirements() + "</p>" +
                                "</div>" : "") +

                (totalFiles > 0 ?
                        "<div style='background: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;'>" +
                                "<h3 style='color: #856404; margin-top: 0;'>📎 Attached Files (" + totalFiles + ")</h3>" +
                                "<p><strong>Description Files:</strong> " + descFileCount + "</p>" +
                                "<p><strong>Requirement Files:</strong> " + reqFileCount + "</p>" +
                                "<p style='font-size: 14px; color: #856404;'>✅ All files are attached to this email. Download them to work on the assignment.</p>" +
                                "</div>" :
                        "<div style='background: #e3f2fd; padding: 15px; border-radius: 5px;'>" +
                                "<p style='color: #1565C0; margin: 0;'>ℹ️ No files were attached to this assignment.</p>" +
                                "</div>") +

                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + appUrl + "/admin/dashboard' style='background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>Go to Admin Dashboard</a>" +
                "</div>" +

                "</div>" +
                "</body></html>";
    }


    /**
     * Send contact form submission to admin
     */
    public void sendContactFormToAdmin(String name, String email, String phone, String message)
            throws MessagingException {
        if (!emailEnabled) {
            System.out.println("⚠️ Email is disabled. Contact form submission skipped.");
            return;
        }

        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("📧 New Contact Form Submission - " + name);

            String htmlContent = buildContactFormEmail(name, email, phone, message);
            helper.setText(htmlContent, true);

            // Also set reply-to as the user's email for easy response
            helper.setReplyTo(email);

            emailSender.send(mimeMessage);
            System.out.println("✅ Contact form email sent successfully to admin!");

        } catch (Exception e) {
            System.err.println("❌ Failed to send contact form email: " + e.getMessage());
            e.printStackTrace();
            throw new MessagingException("Failed to send contact form email: " + e.getMessage(), e);
        }
    }

    /**
     * Build HTML email for contact form submission
     */
    private String buildContactFormEmail(String name, String email, String phone, String message) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        String receivedDate = LocalDateTime.now().format(formatter);

        return "<!DOCTYPE html>" +
                "<html><body style='font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;'>" +
                "<table style='max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>" +

                "<!-- Header -->" +
                "<tr><td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;'>" +
                "<h1 style='color: white; margin: 0; font-size: 28px;'>📧 New Contact Form</h1>" +
                "<p style='color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;'>Someone reached out through your website!</p>" +
                "</td></tr>" +

                "<!-- Content -->" +
                "<tr><td style='padding: 40px 30px;'>" +

                "<!-- Contact Details -->" +
                "<div style='background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 20px; border-radius: 5px;'>" +
                "<h3 style='color: #667eea; margin: 0 0 15px; font-size: 18px;'>👤 Contact Information</h3>" +
                "<p style='margin: 8px 0; color: #333;'><strong>Name:</strong> " + name + "</p>" +
                "<p style='margin: 8px 0; color: #333;'><strong>Email:</strong> <a href='mailto:" + email + "' style='color: #667eea; text-decoration: none;'>" + email + "</a></p>" +
                "<p style='margin: 8px 0; color: #333;'><strong>Phone:</strong> <a href='tel:" + phone + "' style='color: #667eea; text-decoration: none;'>" + phone + "</a></p>" +
                "<p style='margin: 8px 0; color: #999; font-size: 13px;'><strong>Received:</strong> " + receivedDate + "</p>" +
                "</div>" +

                "<!-- Message -->" +
                "<div style='background: white; border: 2px solid #e0e0e0; border-radius: 5px; padding: 20px; margin-bottom: 20px;'>" +
                "<h3 style='color: #333; margin: 0 0 15px; font-size: 18px;'>💬 Message</h3>" +
                "<p style='color: #555; line-height: 1.8; white-space: pre-wrap; margin: 0;'>" + message + "</p>" +
                "</div>" +

                "<!-- Action Buttons -->" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='mailto:" + email + "?subject=Re: Your inquiry' " +
                "style='background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; " +
                "display: inline-block; margin: 5px; font-weight: 600;'>✉️ Reply via Email</a>" +

                "<a href='https://wa.me/" + phone.replaceAll("[^0-9]", "") + "' " +
                "style='background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; " +
                "display: inline-block; margin: 5px; font-weight: 600;'>💬 WhatsApp</a>" +
                "</div>" +

                "<!-- Quick Stats -->" +
                "<div style='background: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center;'>" +
                "<p style='color: #1565C0; margin: 0; font-size: 14px;'>" +
                "💡 <strong>Quick Tip:</strong> This email has 'Reply-To' set to the sender's email for easy responses!" +
                "</p>" +
                "</div>" +

                "</td></tr>" +

                "<!-- Footer -->" +
                "<tr><td style='background-color: #f8f9fa; padding: 20px; text-align: center;'>" +
                "<p style='color: #999; margin: 0; font-size: 12px;'>© 2025 Assignment Service. All rights reserved.</p>" +
                "<p style='color: #999; margin: 5px 0 0; font-size: 11px;'>This is an automated notification from your contact form.</p>" +
                "</td></tr>" +

                "</table></body></html>";
    }

    /**
     * Send approval email with payment link
     */
    public void sendApprovalWithPaymentLinkEmail(Assignment assignment, Payment payment) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String subject = "✅ Assignment Approved - Complete Payment to Start Processing";
        String content = createApprovalWithPaymentContent(assignment, payment);

        helper.setTo(assignment.getUser().getEmail());
        helper.setSubject(subject);
        helper.setText(content, true);

        emailSender.send(message);
    }

    /**
     * Send payment link email
     */
    public void sendPaymentLinkEmail(Payment payment) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String subject = "💳 Payment Link - " + payment.getAssignment().getTitle();
        String content = createPaymentLinkContent(payment);

        helper.setTo(payment.getUser().getEmail());
        helper.setSubject(subject);
        helper.setText(content, true);

        emailSender.send(message);
    }

    /**
     * Send payment confirmation email
     */
    public void sendPaymentConfirmationEmail(Payment payment) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String subject = "✅ Payment Received - " + payment.getAssignment().getTitle();
        String content = createPaymentConfirmationContent(payment);

        helper.setTo(payment.getUser().getEmail());
        helper.setSubject(subject);
        helper.setText(content, true);

        emailSender.send(message);
    }

    // EMAIL TEMPLATES
    private String createApprovalWithPaymentContent(Assignment assignment, Payment payment) {
        String paymentLink = appUrl + "/payment/pay/" + payment.getPaymentToken();
        String currencySymbol = payment.getCurrency().getSymbol();
        String amount = String.format("%.2f", payment.getAmount());

        return "<!DOCTYPE html>" +
                "<html><head><style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".container { background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }" +
                ".header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }" +
                ".content { padding: 30px; }" +
                ".price-box { background: #f8f9fa; border: 2px solid #28a745; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }" +
                ".price-amount { font-size: 36px; font-weight: bold; color: #28a745; }" +
                ".payment-btn { display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; }" +
                "</style></head><body>" +
                "<div class='container'>" +
                "<div class='header'><h1>🎉 Assignment Approved!</h1></div>" +
                "<div class='content'>" +
                "<p>Dear <strong>" + assignment.getUser().getFullName() + "</strong>,</p>" +
                "<p>Your assignment <strong>" + assignment.getTitle() + "</strong> has been approved!</p>" +
                "<div class='price-box'>" +
                "<div class='price-amount'>" + currencySymbol + " " + amount + "</div>" +
                "</div>" +
                "<div style='text-align: center;'>" +
                "<a href='" + paymentLink + "' class='payment-btn'>💳 Complete Payment Now</a>" +
                "</div>" +
                "<p><strong>Order ID:</strong> " + payment.getOrderId() + "</p>" +
                "<p>This payment link is valid for 7 days.</p>" +
                "<p>Best regards,<br><strong>Assignment Service Team</strong></p>" +
                "</div></div></body></html>";
    }

    private String createPaymentLinkContent(Payment payment) {
        String paymentLink = appUrl + "/payment/pay/" + payment.getPaymentToken();
        String currencySymbol = payment.getCurrency().getSymbol();
        String amount = String.format("%.2f", payment.getAmount());

        return "<!DOCTYPE html>" +
                "<html><head><style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".payment-btn { background: #28a745; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; }" +
                "</style></head><body>" +
                "<p>Dear <strong>" + payment.getUser().getFullName() + "</strong>,</p>" +
                "<p>Payment link for: <strong>" + payment.getAssignment().getTitle() + "</strong></p>" +
                "<p><strong>Amount:</strong> " + currencySymbol + " " + amount + "</p>" +
                "<p><a href='" + paymentLink + "' class='payment-btn'>Pay Now</a></p>" +
                "<p>Best regards,<br><strong>Assignment Service Team</strong></p>" +
                "</body></html>";
    }

    private String createPaymentConfirmationContent(Payment payment) {
        String currencySymbol = payment.getCurrency().getSymbol();
        String amount = String.format("%.2f", payment.getAmount());

        return "<!DOCTYPE html>" +
                "<html><head><style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "</style></head><body>" +
                "<p>Dear <strong>" + payment.getUser().getFullName() + "</strong>,</p>" +
                "<h2>✅ Payment Received!</h2>" +
                "<p>Your payment has been confirmed.</p>" +
                "<p><strong>Order ID:</strong> " + payment.getOrderId() + "</p>" +
                "<p><strong>Amount Paid:</strong> " + currencySymbol + " " + amount + "</p>" +
                "<p><strong>Assignment:</strong> " + payment.getAssignment().getTitle() + "</p>" +
                "<p>Admin will start working on your assignment now!</p>" +
                "<p>Best regards,<br><strong>Assignment Service Team</strong></p>" +
                "</body></html>";
    }


    /**
     * Send simple text email (used for admin notifications)
     */
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        if (!emailEnabled) {
            System.out.println("Email is disabled. Would have sent to: " + toEmail);
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + body);
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);

            // Create HTML version of the body
            String htmlBody = createSimpleEmailContent(subject, body);
            helper.setText(htmlBody, true);

            emailSender.send(message);
            System.out.println("Simple email sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("Failed to send simple email to: " + toEmail);
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Create HTML content for simple email
     */
    private String createSimpleEmailContent(String subject, String body) {
        return "<!DOCTYPE html>" +
                "<html><head><style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".container { background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }" +
                ".header { background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%); color: white; padding: 20px; text-align: center; }" +
                ".content { padding: 30px; }" +
                ".message-box { background: #f8f9fa; border-left: 4px solid #4361ee; padding: 15px; margin: 20px 0; white-space: pre-wrap; }" +
                ".footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #999; font-size: 12px; }" +
                "</style></head><body>" +
                "<div class='container'>" +
                "<div class='header'><h2>" + subject + "</h2></div>" +
                "<div class='content'>" +
                "<div class='message-box'>" + body.replace("\n", "<br>") + "</div>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2025 Assignment Service. All rights reserved.</p>" +
                "</div>" +
                "</div></body></html>";
    }


}