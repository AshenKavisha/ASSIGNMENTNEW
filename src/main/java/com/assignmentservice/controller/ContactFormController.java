package com.assignmentservice.controller;

import com.assignmentservice.service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactFormController {

    @Autowired
    private EmailService emailService;

    /**
     * Handle contact form submissions
     *
     * POST /api/contact/submit
     *
     * Request Body:
     * {
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "phone": "+1234567890",
     *   "message": "I need help with my assignment"
     * }
     */
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitContactForm(
            @RequestBody ContactFormRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Validate input
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Name is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Phone number is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Message is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Send email to admin
            emailService.sendContactFormToAdmin(
                    request.getName().trim(),
                    request.getEmail().trim(),
                    request.getPhone().trim(),
                    request.getMessage().trim()
            );

            // Log the submission
            System.out.println("📧 Contact form submitted:");
            System.out.println("   Name: " + request.getName());
            System.out.println("   Email: " + request.getEmail());
            System.out.println("   Phone: " + request.getPhone());

            response.put("success", true);
            response.put("message", "Thank you for contacting us! We'll get back to you soon.");

            return ResponseEntity.ok(response);

        } catch (MessagingException e) {
            System.err.println("❌ Error sending contact form email: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Failed to send message. Please try again or contact us directly.");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "An unexpected error occurred. Please try again.");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * DTO for contact form requests
     */
    public static class ContactFormRequest {
        private String name;
        private String email;
        private String phone;
        private String message;

        // Constructors
        public ContactFormRequest() {}

        public ContactFormRequest(String name, String email, String phone, String message) {
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.message = message;
        }

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        @Override
        public String toString() {
            return "ContactFormRequest{" +
                    "name='" + name + '\'' +
                    ", email='" + email + '\'' +
                    ", phone='" + phone + '\'' +
                    ", message='" + message + '\'' +
                    '}';
        }
    }
}