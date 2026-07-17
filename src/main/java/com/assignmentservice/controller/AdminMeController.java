package com.assignmentservice.controller;

import com.assignmentservice.model.User;
import com.assignmentservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Small standalone controller for the logged-in admin's own profile.
 * Kept separate from AdminController because that class has a class-level
 * @RequestMapping("/admin"), which would otherwise turn "/api/admin/me"
 * into "/admin/api/admin/me".
 */
@RestController
public class AdminMeController {

    @Autowired
    private UserService userService;

    @GetMapping("/api/admin/me")
    public ResponseEntity<?> getCurrentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> currentAdminOpt = userService.getUserByEmail(email);

        if (currentAdminOpt.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        User currentAdmin = currentAdminOpt.get();
        boolean isSuperAdmin = "ADMIN".equals(currentAdmin.getRole()) &&
                currentAdmin.getSpecialization() == User.Specialization.BOTH;

        Map<String, Object> response = new HashMap<>();
        response.put("id", currentAdmin.getId());
        response.put("fullName", currentAdmin.getFullName());
        response.put("email", currentAdmin.getEmail());
        response.put("role", currentAdmin.getRole());
        response.put("specialization", currentAdmin.getSpecialization());
        response.put("isSuperAdmin", isSuperAdmin);

        return ResponseEntity.ok(response);
    }
}