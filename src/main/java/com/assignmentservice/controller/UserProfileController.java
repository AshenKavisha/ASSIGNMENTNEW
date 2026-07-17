package com.assignmentservice.controller;

import com.assignmentservice.model.User;
import com.assignmentservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Controller
@RequestMapping("/profile")
public class UserProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Display user profile page
     */
    @GetMapping
    public String showProfile(Model model, HttpSession session) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            model.addAttribute("user", user);

            // Update last seen (for online indicator)
            user.setLastLogin(LocalDateTime.now());
            userService.saveUser(user);

            // Add user details form
            if (!model.containsAttribute("userDetails")) {
                model.addAttribute("userDetails", user);
            }

            return "profile";
        }

        return "redirect:/login";
    }

    /**
     * Handle profile picture upload
     */
    @PostMapping("/upload-picture")
    public String uploadProfilePicture(@RequestParam("profilePicture") MultipartFile file,
                                       RedirectAttributes redirectAttributes) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Validate file
                if (file.isEmpty()) {
                    redirectAttributes.addFlashAttribute("error", "Please select a file to upload");
                    return "redirect:/profile";
                }

                if (!file.getContentType().startsWith("image/")) {
                    redirectAttributes.addFlashAttribute("error", "Only image files are allowed");
                    return "redirect:/profile";
                }

                if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
                    redirectAttributes.addFlashAttribute("error", "File size must be less than 5MB");
                    return "redirect:/profile";
                }

                // Convert image to Base64
                byte[] bytes = file.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(bytes);

                // Save to user
                user.setProfilePicture(base64Image);
                userService.saveUser(user);

                redirectAttributes.addFlashAttribute("success", "Profile picture updated successfully!");
            }
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("error", "Error uploading file: " + e.getMessage());
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "An error occurred: " + e.getMessage());
        }

        return "redirect:/profile";
    }

    /**
     * Remove profile picture
     */
    @PostMapping("/remove-picture")
    public String removeProfilePicture(RedirectAttributes redirectAttributes) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setProfilePicture(null);
            userService.saveUser(user);

            redirectAttributes.addFlashAttribute("success", "Profile picture removed successfully!");
        }

        return "redirect:/profile";
    }

    /**
     * Update user details
     */
    @PostMapping("/update-details")
    public String updateUserDetails(@ModelAttribute("userDetails") @Valid User userDetails,
                                    BindingResult result,
                                    RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.userDetails", result);
            redirectAttributes.addFlashAttribute("userDetails", userDetails);
            return "redirect:/profile";
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Update user details
            user.setFullName(userDetails.getFullName());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setBirthDate(userDetails.getBirthDate());
            user.setBio(userDetails.getBio());
            user.setWorkExperience(userDetails.getWorkExperience());
            user.setSkills(userDetails.getSkills());
            user.setEducation(userDetails.getEducation());
            user.setLocation(userDetails.getLocation());
            user.setWebsite(userDetails.getWebsite());

            userService.saveUser(user);

            redirectAttributes.addFlashAttribute("success", "Profile details updated successfully!");
        }

        return "redirect:/profile";
    }

    /**
     * Change password
     */
    @PostMapping("/change-password")
    public String changePassword(@RequestParam("currentPassword") String currentPassword,
                                 @RequestParam("newPassword") String newPassword,
                                 @RequestParam("confirmPassword") String confirmPassword,
                                 RedirectAttributes redirectAttributes) {

        // Validate passwords
        if (!newPassword.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("passwordError", "New passwords do not match");
            return "redirect:/profile";
        }

        if (newPassword.length() < 6) {
            redirectAttributes.addFlashAttribute("passwordError", "Password must be at least 6 characters");
            return "redirect:/profile";
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                redirectAttributes.addFlashAttribute("passwordError", "Current password is incorrect");
                return "redirect:/profile";
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userService.saveUser(user);

            redirectAttributes.addFlashAttribute("success", "Password changed successfully!");
        }

        return "redirect:/profile";
    }

    /**
     * DELETE ACCOUNT - HARD DELETE (allows email reuse)
     * Permanently removes user and all associated data
     * After deletion, the same email CAN be used to create a new account
     */
    @PostMapping("/delete-account")
    public String deleteAccount(@RequestParam("password") String password,
                                HttpServletRequest request,
                                RedirectAttributes redirectAttributes) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Verify password before deletion
                if (!passwordEncoder.matches(password, user.getPassword())) {
                    redirectAttributes.addFlashAttribute("error",
                            "Incorrect password. Account deletion cancelled.");
                    return "redirect:/profile";
                }

                // Prevent last admin from deleting account
                if ("ADMIN".equals(user.getRole())) {
                    long adminCount = userService.countAdmins();
                    if (adminCount <= 1) {
                        redirectAttributes.addFlashAttribute("error",
                                "Cannot delete account. You are the only admin in the system. " +
                                        "Please create another admin account before deleting yours.");
                        return "redirect:/profile";
                    }
                }

                // HARD DELETE - This will permanently remove the user and free up the email
                userService.deleteUserById(user.getId());

                // Logout the user
                new SecurityContextLogoutHandler().logout(request, null, authentication);

                redirectAttributes.addFlashAttribute("message",
                        "Your account has been permanently deleted. " +
                                "You can create a new account with the same email if you wish to return.");

                return "redirect:/login";
            }

            redirectAttributes.addFlashAttribute("error", "User not found");
            return "redirect:/profile";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "Failed to delete account: " + e.getMessage());
            return "redirect:/profile";
        }
    }
}