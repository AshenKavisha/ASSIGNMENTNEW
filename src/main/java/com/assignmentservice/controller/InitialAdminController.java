package com.assignmentservice.controller;

import com.assignmentservice.model.User;
import com.assignmentservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;

/**
 * ADMIN CREATION CONTROLLER
 * This controller allows creating admin users with a secret key.
 *
 * Usage:
 * /create-admin?secret=YOUR_SECRET&email=admin@example.com&password=SecurePass123&name=Admin Name
 *
 * SECURITY: Keep the secret key safe and delete this controller in production!
 */
@Controller
public class InitialAdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Change this secret key!
    private static final String SECRET_KEY = "Ashen2025Secret";

    /**
     * Create first admin - Simple version (original functionality)
     */
    @GetMapping("/create-first-admin")
    @ResponseBody
    public String createFirstAdmin(@RequestParam String secret) {

        // Verify secret key
        if (!SECRET_KEY.equals(secret)) {
            return errorResponse("Invalid secret key!");
        }

        // Check if this specific admin already exists
        if (userService.getUserByEmail("assignmentservice.net@gmail.com").isPresent()) {
            return errorResponse("Admin with email 'assignmentservice.net@gmail.com' already exists! " +
                    "Use /create-admin endpoint to create additional admins with different emails.");
        }

        try {
            // Create admin user
            User admin = new User();
            admin.setEmail("assignmentservice.net@gmail.com");
            admin.setPassword(passwordEncoder.encode("Ass@1234"));
            admin.setFullName("Super Admin");
            admin.setPhoneNumber("+94123456789");
            admin.setRole("ADMIN");
            admin.setSpecialization(User.Specialization.BOTH);
            admin.setEmailVerified(true);
            admin.setCreatedAt(LocalDateTime.now());

            userService.saveUser(admin);

            return successResponse(
                    "assignmentservice.net@gmail.com",
                    "Ass@1234",
                    "Super Admin"
            );

        } catch (Exception e) {
            return errorResponse("Failed to create admin: " + e.getMessage());
        }
    }

    /**
     * Create additional admin - Flexible version
     * Usage: /create-admin?secret=YourSecret&email=admin2@example.com&password=Pass123&name=Admin Two
     */
    @GetMapping("/create-admin")
    @ResponseBody
    public String createAdmin(@RequestParam String secret,
                              @RequestParam String email,
                              @RequestParam String password,
                              @RequestParam String name,
                              @RequestParam(required = false, defaultValue = "+94000000000") String phone,
                              @RequestParam(required = false, defaultValue = "BOTH") String specialization) {

        // Verify secret key
        if (!SECRET_KEY.equals(secret)) {
            return errorResponse("Invalid secret key!");
        }

        // Validate email format
        if (!email.contains("@") || !email.contains(".")) {
            return errorResponse("Invalid email format!");
        }

        // Validate password strength
        if (password.length() < 6) {
            return errorResponse("Password must be at least 6 characters long!");
        }

        // Check if email already exists
        if (userService.getUserByEmail(email).isPresent()) {
            return errorResponse("An account with email '" + email + "' already exists!");
        }

        try {
            // Parse specialization
            User.Specialization spec;
            try {
                spec = User.Specialization.valueOf(specialization.toUpperCase());
            } catch (IllegalArgumentException e) {
                spec = User.Specialization.BOTH;
            }

            // Create admin user
            User admin = new User();
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setFullName(name);
            admin.setPhoneNumber(phone);
            admin.setRole("ADMIN");
            admin.setSpecialization(spec);
            admin.setEmailVerified(true);
            admin.setCreatedAt(LocalDateTime.now());

            userService.saveUser(admin);

            // Count total admins
            long adminCount = userService.countAdmins();

            return successResponse(email, password, name) +
                    "<div class='info' style='background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196f3;'>" +
                    "<p><strong>Total Admins in System:</strong> " + adminCount + "</p>" +
                    "<p><strong>Specialization:</strong> " + spec + "</p>" +
                    "</div>" +
                    "</div></body></html>";

        } catch (Exception e) {
            return errorResponse("Failed to create admin: " + e.getMessage() +
                    "<br><br><strong>Stack trace:</strong><pre>" + e.toString() + "</pre>");
        }
    }

    /**
     * List all admins (for verification)
     * Usage: /list-admins?secret=YourSecret
     */
    @GetMapping("/list-admins")
    @ResponseBody
    public String listAdmins(@RequestParam String secret) {
        // Verify secret key
        if (!SECRET_KEY.equals(secret)) {
            return errorResponse("Invalid secret key!");
        }

        try {
            var admins = userService.getAllAdmins();
            long totalAdmins = userService.countAdmins();

            StringBuilder html = new StringBuilder();
            html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'>")
                    .append("<title>Admin List</title>")
                    .append("<style>")
                    .append("body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }")
                    .append(".info-box { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }")
                    .append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }")
                    .append("th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }")
                    .append("th { background: #2196f3; color: white; }")
                    .append("tr:hover { background: #f5f5f5; }")
                    .append(".badge { padding: 4px 8px; border-radius: 3px; font-size: 12px; }")
                    .append(".badge-it { background: #4caf50; color: white; }")
                    .append(".badge-qs { background: #ff9800; color: white; }")
                    .append(".badge-both { background: #2196f3; color: white; }")
                    .append("</style></head><body>")
                    .append("<div class='info-box'>")
                    .append("<h1>👥 Admin Users List</h1>")
                    .append("<p><strong>Total Admins:</strong> ").append(totalAdmins).append("</p>")
                    .append("<table>")
                    .append("<tr><th>Email</th><th>Full Name</th><th>Specialization</th><th>Created</th></tr>");

            for (User admin : admins) {
                String specBadge = "";
                if (admin.getSpecialization() != null) {
                    String badgeClass = switch (admin.getSpecialization()) {
                        case IT -> "badge-it";
                        case QUANTITY_SURVEYING -> "badge-qs";
                        case BOTH -> "badge-both";
                        default -> "";
                    };
                    specBadge = "<span class='badge " + badgeClass + "'>" + admin.getSpecialization() + "</span>";
                }

                html.append("<tr>")
                        .append("<td>").append(admin.getEmail()).append("</td>")
                        .append("<td>").append(admin.getFullName()).append("</td>")
                        .append("<td>").append(specBadge).append("</td>")
                        .append("<td>").append(admin.getCreatedAt()).append("</td>")
                        .append("</tr>");
            }

            html.append("</table>")
                    .append("<div style='margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;'>")
                    .append("<strong>⚠️ Security Note:</strong> Delete this controller file in production!")
                    .append("</div>")
                    .append("</div></body></html>");

            return html.toString();

        } catch (Exception e) {
            return errorResponse("Failed to list admins: " + e.getMessage());
        }
    }

    // Helper methods for HTML responses
    private String successResponse(String email, String password, String name) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<title>Admin Created Successfully</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }" +
                ".success-box { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
                "h1 { color: #27ae60; margin-top: 0; }" +
                ".info { background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #27ae60; }" +
                ".warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; color: #856404; }" +
                ".btn { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }" +
                ".btn:hover { background: #0056b3; }" +
                "code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='success-box'>" +
                "<h1>✅ SUCCESS! Admin Created!</h1>" +
                "<div class='info'>" +
                "<h3>Login Credentials:</h3>" +
                "<p><strong>Email:</strong> <code>" + email + "</code></p>" +
                "<p><strong>Password:</strong> <code>" + password + "</code></p>" +
                "<p><strong>Name:</strong> " + name + "</p>" +
                "<p><strong>Role:</strong> Admin (Full Access)</p>" +
                "</div>" +
                "<div class='warning'>" +
                "<h3>⚠️ IMPORTANT SECURITY STEPS:</h3>" +
                "<ol>" +
                "<li><strong>Change your password immediately after first login!</strong></li>" +
                "<li><strong>Delete InitialAdminController.java in production</strong></li>" +
                "<li><strong>Keep the secret key safe</strong></li>" +
                "</ol>" +
                "</div>" +
                "<a href='/login' class='btn'>Go to Login Page</a><br>" +
                "<a href='/list-admins?secret=" + SECRET_KEY + "' class='btn' style='background: #6c757d; margin-top: 10px;'>View All Admins</a>";
    }

    private String errorResponse(String message) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'><title>Error</title></head>" +
                "<body style='font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px;'>" +
                "<div style='background: #f8d7da; padding: 20px; border-radius: 10px; border-left: 4px solid #dc3545;'>" +
                "<h1 style='color: #721c24;'>❌ ERROR</h1>" +
                "<p>" + message + "</p>" +
                "<a href='/login' style='display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;'>Back to Login</a>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}