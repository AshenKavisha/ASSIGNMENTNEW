package com.assignmentservice.service;

import com.assignmentservice.model.Assignment;
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

    // ==========================================
    // EXISTING METHODS (Your original code)
    // ==========================================

    public void sendAssignmentNotificationToAdmin(Assignment assignment) {
        // Your existing implementation
    }

    public void sendAssignmentApprovalToUser(String userEmail, Assignment assignment) {
        // Your existing implementation
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
        helper.setText(content, true); // true = HTML content

        emailSender.send(message);
    }

    /**
     * Send solution files to user via email with attachments
     */
    public void sendSolutionToUser(User user, Assignment assignment, List<MultipartFile> solutionFiles)
            throws MessagingException, IOException {

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String subject = "Your Assignment Solution is Ready - " + assignment.getTitle();
        String content = createSolutionEmailContent(user, assignment);

        helper.setTo(user.getEmail());
        helper.setSubject(subject);
        helper.setText(content, true); // true = HTML content

        // Attach solution files
        for (MultipartFile file : solutionFiles) {
            if (!file.isEmpty()) {
                helper.addAttachment(
                        file.getOriginalFilename(),
                        new ByteArrayResource(file.getBytes()),
                        file.getContentType()
                );
            }
        }

        emailSender.send(message);
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

    // ==========================================
    // NEW METHODS FOR EMAIL VERIFICATION & PASSWORD RESET
    // ==========================================

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
    // EXISTING EMAIL TEMPLATE BUILDERS
    // ==========================================

    /**
     * Create HTML email content for admin invitation
     */
    private String createAdminInvitationContent(String email, String password) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px; }" +
                ".content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }" +
                ".credentials-box { background: white; padding: 20px; border: 2px solid #007bff; border-radius: 5px; margin: 20px 0; }" +
                ".button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }" +
                ".footer { margin-top: 30px; font-size: 12px; color: #666; }" +
                ".alert-box { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>🎉 Welcome to Assignment Service!</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello,</p>" +
                "<p>You have been registered as an <strong>Administrator</strong> for Assignment Service.</p>" +

                "<div class='credentials-box'>" +
                "<h3 style='margin-top: 0; color: #007bff;'>📧 Your Login Credentials</h3>" +
                "<p style='margin: 10px 0;'><strong>Email:</strong> " + email + "</p>" +
                "<p style='margin: 10px 0;'><strong>Password:</strong> " + password + "</p>" +
                "</div>" +

                "<div class='alert-box'>" +
                "<h4 style='margin-top: 0; color: #856404;'>⚠️ Important Security Notice</h4>" +
                "<ul style='margin-bottom: 0;'>" +
                "<li>Please change your password after your first login</li>" +
                "<li>Keep your credentials confidential</li>" +
                "<li>Never share your password with anyone</li>" +
                "</ul>" +
                "</div>" +

                "<h3>🔐 Getting Started:</h3>" +
                "<ol>" +
                "<li>Click the button below to access the admin panel</li>" +
                "<li>Log in with the credentials provided above</li>" +
                "<li>Update your password in Account Settings</li>" +
                "<li>Start managing assignments!</li>" +
                "</ol>" +

                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='http://localhost:8080/login' class='button'>Login to Admin Panel</a>" +
                "</div>" +

                "<p style='font-size: 14px; color: #666;'>" +
                "If the button doesn't work, copy and paste this link in your browser:<br>" +
                "<strong>http://localhost:8080/login</strong>" +
                "</p>" +

                "<p>If you have any questions or need assistance, please don't hesitate to contact the system administrator.</p>" +
                "</div>" +

                "<div class='footer'>" +
                "<p>Best regards,<br><strong>Assignment Service Team</strong></p>" +
                "<p style='font-size: 11px; color: #999;'>" +
                "This is an automated message. If you received this email by mistake, please contact us immediately." +
                "</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Create HTML email content for solution delivery
     */
    private String createSolutionEmailContent(User user, Assignment assignment) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; }" +
                ".content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }" +
                ".button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }" +
                ".footer { margin-top: 30px; font-size: 12px; color: #666; }" +
                ".assignment-details { background: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>🎉 Assignment Solution Delivered!</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>" + user.getFullName() + "</strong>,</p>" +
                "<p>Your assignment solution for <strong>" + assignment.getTitle() + "</strong> is ready!</p>" +

                "<div class='assignment-details'>" +
                "<h3>Assignment Details:</h3>" +
                "<ul>" +
                "<li><strong>Title:</strong> " + assignment.getTitle() + "</li>" +
                "<li><strong>Subject:</strong> " + assignment.getSubject() + "</li>" +
                "<li><strong>Type:</strong> " + assignment.getType() + "</li>" +
                "<li><strong>Delivery Date:</strong> " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")) + "</li>" +
                (assignment.getPrice() != null ?
                        "<li><strong>Final Price:</strong> $" + String.format("%.2f", assignment.getPrice()) + "</li>" : "") +
                "</ul>" +
                "</div>" +

                "<p><strong>📎 Important:</strong> Your solution files are attached to this email. Please download them for your review.</p>" +

                "<div style='text-align: center; margin: 25px 0;'>" +
                "<a href='http://localhost:8080/dashboard' class='button'>Go to Dashboard</a>" +
                "</div>" +

                "<div style='background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;'>" +
                "<h4 style='color: #856404; margin-top: 0;'>📋 Important Notes:</h4>" +
                "<ul style='margin-bottom: 0;'>" +
                "<li>Please review all files carefully</li>" +
                "<li>If you need any revisions, please submit a revision request through your dashboard</li>" +
                "<li>For any questions, contact our support team</li>" +
                "</ul>" +
                "</div>" +

                "<p>We hope you're satisfied with the solution. Thank you for choosing our service!</p>" +
                "</div>" +

                "<div class='footer'>" +
                "<p>Best regards,<br><strong>Assignment Service Team</strong></p>" +
                "<p style='font-size: 11px; color: #999;'>" +
                "This is an automated message. Please do not reply to this email.<br>" +
                "If you have any questions, please contact support@assignmentservice.com" +
                "</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Create HTML content for solution notification
     */
    private String createSolutionNotificationContent(User user, Assignment assignment) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px; }" +
                ".content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }" +
                ".button { display: inline-block; background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>📬 Assignment Solution Available!</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>" + user.getFullName() + "</strong>,</p>" +
                "<p>Your assignment solution for <strong>" + assignment.getTitle() + "</strong> is ready for download!</p>" +

                "<p>Please log in to your account to download the solution files and review your work.</p>" +

                "<ul>" +
                "<li><strong>Assignment:</strong> " + assignment.getTitle() + "</li>" +
                "<li><strong>Subject:</strong> " + assignment.getSubject() + "</li>" +
                "<li><strong>Status:</strong> Completed</li>" +
                "</ul>" +

                "<div style='text-align: center; margin: 25px 0;'>" +
                "<a href='http://localhost:8080/dashboard' class='button'>Download Solution</a>" +
                "</div>" +

                "<p style='font-size: 14px; color: #666;'>" +
                "If the button doesn't work, copy and paste this link in your browser:<br>" +
                "http://localhost:8080/dashboard" +
                "</p>" +
                "</div>" +

                "<div class='footer'>" +
                "<p>Best regards,<br>Assignment Service Team</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    // ==========================================
    // NEW EMAIL TEMPLATE BUILDERS FOR VERIFICATION & RESET
    // ==========================================

    /**
     * Build HTML content for verification email
     */
    private String buildVerificationEmail(String fullName, String verificationUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Verify Your Email</title>" +
                "</head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr>" +
                "<td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +
                "<!-- Header -->" +
                "<tr>" +
                "<td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 28px;'>Welcome to Assignment Service!</h1>" +
                "</td>" +
                "</tr>" +
                "<!-- Body -->" +
                "<tr>" +
                "<td style='padding: 40px;'>" +
                "<h2 style='color: #333; margin-top: 0;'>Hello " + fullName + ",</h2>" +
                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "Thank you for registering with Assignment Service! We're excited to have you on board." +
                "</p>" +
                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "To complete your registration and activate your account, please verify your email address by clicking the button below:" +
                "</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + verificationUrl + "' style='background: linear-gradient(45deg, #3498db, #2980b9); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>Verify Email Address</a>" +
                "</div>" +
                "<p style='color: #666; line-height: 1.6; font-size: 14px;'>" +
                "Or copy and paste this link into your browser:" +
                "</p>" +
                "<p style='color: #3498db; word-break: break-all; font-size: 14px;'>" +
                verificationUrl +
                "</p>" +
                "<p style='color: #999; line-height: 1.6; font-size: 14px; margin-top: 30px;'>" +
                "This verification link will expire in 24 hours." +
                "</p>" +
                "<p style='color: #999; line-height: 1.6; font-size: 14px;'>" +
                "If you didn't create an account with Assignment Service, please ignore this email." +
                "</p>" +
                "</td>" +
                "</tr>" +
                "<!-- Footer -->" +
                "<tr>" +
                "<td style='background-color: #f8f9fa; padding: 20px; text-align: center;'>" +
                "<p style='color: #999; margin: 0; font-size: 12px;'>" +
                "© 2024 Assignment Service. All rights reserved." +
                "</p>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</body>" +
                "</html>";
    }

    /**
     * Build HTML content for password reset email
     */
    private String buildPasswordResetEmail(String fullName, String resetUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Reset Your Password</title>" +
                "</head>" +
                "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>" +
                "<tr>" +
                "<td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +
                "<!-- Header -->" +
                "<tr>" +
                "<td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;'>" +
                "<h1 style='color: #ffffff; margin: 0; font-size: 28px;'>Password Reset Request</h1>" +
                "</td>" +
                "</tr>" +
                "<!-- Body -->" +
                "<tr>" +
                "<td style='padding: 40px;'>" +
                "<h2 style='color: #333; margin-top: 0;'>Hello " + fullName + ",</h2>" +
                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "We received a request to reset your password for your Assignment Service account." +
                "</p>" +
                "<p style='color: #666; line-height: 1.6; font-size: 16px;'>" +
                "Click the button below to create a new password:" +
                "</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + resetUrl + "' style='background: linear-gradient(45deg, #e74c3c, #c0392b); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>Reset Password</a>" +
                "</div>" +
                "<p style='color: #666; line-height: 1.6; font-size: 14px;'>" +
                "Or copy and paste this link into your browser:" +
                "</p>" +
                "<p style='color: #e74c3c; word-break: break-all; font-size: 14px;'>" +
                resetUrl +
                "</p>" +
                "<div style='background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;'>" +
                "<p style='color: #856404; margin: 0; font-size: 14px;'>" +
                "<strong>Important:</strong> This reset link will expire in 1 hour for security reasons." +
                "</p>" +
                "</div>" +
                "<p style='color: #999; line-height: 1.6; font-size: 14px;'>" +
                "If you didn't request a password reset, please ignore this email or contact support if you have concerns." +
                "</p>" +
                "</td>" +
                "</tr>" +
                "<!-- Footer -->" +
                "<tr>" +
                "<td style='background-color: #f8f9fa; padding: 20px; text-align: center;'>" +
                "<p style='color: #999; margin: 0; font-size: 12px;'>" +
                "© 2024 Assignment Service. All rights reserved." +
                "</p>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</body>" +
                "</html>";
    }
}