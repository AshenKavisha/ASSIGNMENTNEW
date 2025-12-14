package com.assignmentservice.service;

import com.assignmentservice.model.Assignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.url}")
    private String appUrl;

    public void sendAssignmentNotificationToAdmin(Assignment assignment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(adminEmail);
        message.setSubject("New Assignment Request - " + assignment.getTitle());
        message.setText(createAssignmentEmailContent(assignment));

        try {
            mailSender.send(message);
            System.out.println("Assignment notification email sent to admin");
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendAssignmentApprovalToUser(String userEmail, Assignment assignment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("Assignment Approved - " + assignment.getTitle());
        message.setText(
                "Dear Student,\n\n" +
                        "Your assignment '" + assignment.getTitle() + "' has been approved!\n\n" +
                        "Assignment Details:\n" +
                        "Type: " + assignment.getType() + "\n" +
                        "Subject: " + assignment.getSubject() + "\n" +
                        "Deadline: " + assignment.getDeadline() + "\n" +
                        "Price: $" + (assignment.getPrice() != null ? assignment.getPrice() : "To be determined") + "\n\n" +
                        "You can now proceed with the payment to start working on your assignment.\n\n" +
                        "Best regards,\nAssignment Service Team"
        );

        try {
            mailSender.send(message);
            System.out.println("Approval email sent to user: " + userEmail);
        } catch (Exception e) {
            System.err.println("Failed to send approval email: " + e.getMessage());
        }
    }

    private String createAssignmentEmailContent(Assignment assignment) {
        return String.format(
                "NEW ASSIGNMENT REQUEST\n\n" +
                        "Assignment Details:\n" +
                        "Title: %s\n" +
                        "Type: %s\n" +
                        "Subject: %s\n" +
                        "Deadline: %s\n" +
                        "Description: %s\n" +
                        "Additional Requirements: %s\n\n" +
                        "Student Information:\n" +
                        "Name: %s\n" +
                        "Email: %s\n\n" +
                        "Please review this assignment in the admin panel and update its status.",
                assignment.getTitle(),
                assignment.getType(),
                assignment.getSubject(),
                assignment.getDeadline(),
                assignment.getDescription(),
                assignment.getAdditionalRequirements() != null ? assignment.getAdditionalRequirements() : "None",
                assignment.getUser().getFullName(),
                assignment.getUser().getEmail()
        );
    }

    public void sendPaymentConfirmation(String userEmail, Assignment assignment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("Payment Confirmed - " + assignment.getTitle());
        message.setText(
                "Dear Student,\n\n" +
                        "Your payment for assignment '" + assignment.getTitle() + "' has been confirmed!\n\n" +
                        "Our team will now start working on your assignment. You will receive updates on the progress.\n\n" +
                        "Thank you for choosing our service!\n\n" +
                        "Best regards,\nAssignment Service Team"
        );

        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send payment confirmation email: " + e.getMessage());
        }
    }

    public void sendAdminInvitation(String adminEmail, String temporaryPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(adminEmail);
        message.setSubject("Welcome as Administrator - Assignment Service");
        message.setText(
                "Dear Administrator,\n\n" +
                        "You have been added as an administrator to the Assignment Service platform.\n\n" +
                        "Your login credentials:\n" +
                        "Email: " + adminEmail + "\n" +
                        "Temporary Password: " + temporaryPassword + "\n\n" +
                        "Please login at: " + appUrl + "/login\n\n" +
                        "For security reasons, please change your password after your first login.\n\n" +
                        "Best regards,\nAssignment Service Team"
        );

        try {
            mailSender.send(message);
            System.out.println("Admin invitation email sent to: " + adminEmail);
        } catch (Exception e) {
            System.err.println("Failed to send admin invitation email: " + e.getMessage());
        }
    }


}
