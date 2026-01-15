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
 * TEMPORARY CONTROLLER - DELETE AFTER CREATING ADMIN!
 * This controller creates the first admin user.
 * Access it once at: /create-first-admin?secret=YOUR_SECRET_KEY
 * Then DELETE this file and redeploy!
 */
@Controller
public class InitialAdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Change this secret key!
    private static final String SECRET_KEY = "Ashen2025Secret";

    @GetMapping("/create-first-admin")
    @ResponseBody
    public String createFirstAdmin(@RequestParam String secret) {

        // Verify secret key
        if (!SECRET_KEY.equals(secret)) {
            return "ERROR: Invalid secret key!";
        }

        // Check if admin already exists
        if (userService.getUserByEmail("assignmentservice.net@gmail.com").isPresent()) {
            return "ERROR: Admin already exists!";
        }

        try {
            // Create admin user
            User admin = new User();
            admin.setEmail("assignmentservice.net@gmail.com");
            admin.setPassword(passwordEncoder.encode("Ass@1234"));  // Change this password!
            admin.setFullName("Super Admin");
            admin.setPhoneNumber("+94123456789");
            admin.setRole("ADMIN");
            admin.setSpecialization(User.Specialization.BOTH);  // Full access
            admin.setEmailVerified(true);  // Email is verified
            admin.setCreatedAt(LocalDateTime.now());
            userService.saveUser(admin);
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
                    "<h1>✅ SUCCESS! Admin Created Successfully!</h1>" +
                    "<div class='info'>" +
                    "<h3>Login Credentials:</h3>" +
                    "<p><strong>Email:</strong> <code>assignmentservice.net@gmail.com</code></p>" +
                    "<p><strong>Password:</strong> <code>Ass@1234</code></p>" +
                    "<p><strong>Role:</strong> Super Admin (Full Access)</p>" +
                    "</div>" +
                    "<div class='warning'>" +
                    "<h3>⚠️ IMPORTANT SECURITY STEPS:</h3>" +
                    "<ol>" +
                    "<li><strong>Change your password immediately after first login!</strong></li>" +
                    "<li><strong>Delete InitialAdminController.java from your project</strong></li>" +
                    "<li><strong>Push changes to GitHub to redeploy</strong></li>" +
                    "</ol>" +
                    "<p><strong>How to delete:</strong></p>" +
                    "<pre style='background: #f4f4f4; padding: 10px; border-radius: 5px;'>" +
                    "git rm src/main/java/com/assignmentservice/controller/InitialAdminController.java\n" +
                    "git commit -m \"Remove admin creation endpoint\"\n" +
                    "git push origin Ashen" +
                    "</pre>" +
                    "</div>" +
                    "<a href='/login' class='btn'>Go to Login Page</a>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

        } catch (Exception e) {
            return "<!DOCTYPE html>" +
                    "<html>" +
                    "<head><meta charset='UTF-8'><title>Error</title></head>" +
                    "<body style='font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px;'>" +
                    "<div style='background: #f8d7da; padding: 20px; border-radius: 10px; border-left: 4px solid #dc3545;'>" +
                    "<h1 style='color: #721c24;'>❌ ERROR</h1>" +
                    "<p>Failed to create admin: " + e.getMessage() + "</p>" +
                    "<p><strong>Stack trace:</strong></p>" +
                    "<pre style='background: white; padding: 10px; border-radius: 5px; overflow-x: auto;'>" +
                    e.toString() +
                    "</pre>" +
                    "<a href='/login' style='display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;'>Back to Login</a>" +
                    "</div>" +
                    "</body>" +
                    "</html>";
        }
    }
}