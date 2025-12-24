// RegistrationController.java
package com.assignmentservice.controller;

import com.assignmentservice.model.User;
import com.assignmentservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api")
public class RegistrationController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @ResponseBody
    public String registerUser(@RequestBody RegistrationRequest request) {
        try {
            // Check if user already exists
            if (userService.getUserByEmail(request.getEmail()).isPresent()) {
                return "{\"error\": \"Email already registered\"}";
            }

            // Create user object
            User user = new User();
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword()); // Will be hashed by UserService

            // Register user
            userService.registerUser(user);

            return "{\"success\": true, \"message\": \"User registered successfully\"}";

        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }

    // Request DTO
    public static class RegistrationRequest {
        private String fullName;
        private String email;
        private String password;
        private String phone;
        private String country;
        private boolean newsletter;

        // Getters and setters
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }

        public boolean isNewsletter() { return newsletter; }
        public void setNewsletter(boolean newsletter) { this.newsletter = newsletter; }
    }
}