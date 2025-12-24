package com.assignmentservice.controller;

import com.assignmentservice.dto.AdminPerformanceDto;
import com.assignmentservice.dto.AdminRegistrationDto;
import com.assignmentservice.model.*;
import com.assignmentservice.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import jakarta.mail.MessagingException;
import java.util.Arrays;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ============ DASHBOARD ============
    @GetMapping("/dashboard")
    public String adminDashboard(Model model) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        List<Assignment> pendingAssignments = assignmentService.getPendingAssignments();
        List<Assignment> allAssignments = assignmentService.getAllAssignments();

        // Get current user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> currentUser = userService.getUserByEmail(email);

        // Calculate status counts properly
        long inProgressCount = allAssignments.stream()
                .filter(a -> a.getStatus() == Assignment.AssignmentStatus.IN_PROGRESS)
                .count();

        long completedCount = allAssignments.stream()
                .filter(a -> a.getStatus() == Assignment.AssignmentStatus.COMPLETED)
                .count();

        model.addAttribute("pendingAssignments", pendingAssignments);
        model.addAttribute("pendingCount", pendingAssignments.size());
        model.addAttribute("totalAssignments", allAssignments.size());
        model.addAttribute("inProgressCount", inProgressCount);
        model.addAttribute("completedCount", completedCount);
        model.addAttribute("user", currentUser.orElse(null));

        return "admin/admin-dashboard"; // CHANGED THIS LINE
    }

    // ============ CUSTOMER PROFILES PAGE - NEW FEATURE ============
    @GetMapping("/customers")
    public String viewCustomerProfiles(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "1") int page,
            Model model) {

        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        // Get current admin user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> currentAdminOpt = userService.getUserByEmail(email);

        if (!currentAdminOpt.isPresent()) {
            return "redirect:/dashboard?error=User not found";
        }

        User currentAdmin = currentAdminOpt.get();
        User.Specialization adminSpecialization = currentAdmin.getSpecialization();

        // Get all customers (users with role USER)
        List<User> allCustomers = userService.getAllCustomers();
        List<User> filteredCustomers;

        // Filter customers based on admin specialization and optional type filter
        if (adminSpecialization == User.Specialization.BOTH) {
            // Admin can see all customers
            if (type != null && !type.isEmpty()) {
                Assignment.AssignmentType assignmentType = Assignment.AssignmentType.valueOf(type);
                filteredCustomers = filterCustomersByAssignmentType(allCustomers, assignmentType);
            } else {
                filteredCustomers = allCustomers;
            }
        } else if (adminSpecialization == User.Specialization.IT) {
            // IT admin sees only IT customers
            filteredCustomers = filterCustomersByAssignmentType(allCustomers, Assignment.AssignmentType.IT);
        } else if (adminSpecialization == User.Specialization.QUANTITY_SURVEYING) {
            // QS admin sees only QS customers
            filteredCustomers = filterCustomersByAssignmentType(allCustomers, Assignment.AssignmentType.QUANTITY_SURVEYING);
        } else {
            // NONE specialization - no access to customers
            filteredCustomers = new ArrayList<>();
        }

        // Calculate statistics
        long itCustomerCount = filterCustomersByAssignmentType(allCustomers, Assignment.AssignmentType.IT).size();
        long qsCustomerCount = filterCustomersByAssignmentType(allCustomers, Assignment.AssignmentType.QUANTITY_SURVEYING).size();

        model.addAttribute("customers", filteredCustomers);
        model.addAttribute("totalCustomers", filteredCustomers.size());
        model.addAttribute("itCustomerCount", itCustomerCount);
        model.addAttribute("qsCustomerCount", qsCustomerCount);
        model.addAttribute("currentAdmin", currentAdmin);
        model.addAttribute("filterType", type);

        return "admin/customer-profiles";
    }

    @GetMapping("/customers/{id}")
    public String viewCustomerDetail(@PathVariable Long id, Model model) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        // Get current admin user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> currentAdminOpt = userService.getUserByEmail(email);

        if (!currentAdminOpt.isPresent()) {
            return "redirect:/dashboard?error=User not found";
        }

        User currentAdmin = currentAdminOpt.get();

        // Get customer
        Optional<User> customerOpt = userService.getUserById(id);
        if (!customerOpt.isPresent()) {
            return "redirect:/admin/customers?error=Customer not found";
        }

        User customer = customerOpt.get();

        // Check if admin has permission to view this customer
        if (!canAdminViewCustomer(currentAdmin, customer)) {
            return "redirect:/admin/customers?error=You don't have permission to view this customer";
        }

        // Get customer's assignments
        List<Assignment> customerAssignments = customer.getAssignments();

        // Calculate statistics
        long totalAssignments = customerAssignments.size();
        long completedAssignments = customerAssignments.stream()
                .filter(a -> a.getStatus() == Assignment.AssignmentStatus.COMPLETED)
                .count();
        long pendingAssignments = customerAssignments.stream()
                .filter(a -> a.getStatus() == Assignment.AssignmentStatus.PENDING)
                .count();
        long inProgressAssignments = customerAssignments.stream()
                .filter(a -> a.getStatus() == Assignment.AssignmentStatus.IN_PROGRESS)
                .count();

        double totalSpent = customerAssignments.stream()
                .filter(a -> a.getStatus() == Assignment.AssignmentStatus.COMPLETED && a.getPrice() != null)
                .mapToDouble(Assignment::getPrice)
                .sum();

        model.addAttribute("customer", customer);
        model.addAttribute("assignments", customerAssignments);
        model.addAttribute("totalAssignments", totalAssignments);
        model.addAttribute("completedAssignments", completedAssignments);
        model.addAttribute("pendingAssignments", pendingAssignments);
        model.addAttribute("inProgressAssignments", inProgressAssignments);
        model.addAttribute("totalSpent", totalSpent);
        model.addAttribute("currentAdmin", currentAdmin);

        return "admin/customer-detail";
    }

    // Helper method to filter customers by assignment type
    private List<User> filterCustomersByAssignmentType(List<User> customers, Assignment.AssignmentType type) {
        return customers.stream()
                .filter(customer -> customer.getAssignments().stream()
                        .anyMatch(assignment -> assignment.getType() == type))
                .collect(Collectors.toList());
    }

    // Helper method to check if admin can view customer based on specialization
    private boolean canAdminViewCustomer(User admin, User customer) {
        User.Specialization specialization = admin.getSpecialization();

        if (specialization == User.Specialization.BOTH) {
            return true;
        }

        List<Assignment> customerAssignments = customer.getAssignments();

        if (specialization == User.Specialization.IT) {
            return customerAssignments.stream()
                    .anyMatch(a -> a.getType() == Assignment.AssignmentType.IT);
        } else if (specialization == User.Specialization.QUANTITY_SURVEYING) {
            return customerAssignments.stream()
                    .anyMatch(a -> a.getType() == Assignment.AssignmentType.QUANTITY_SURVEYING);
        }

        return false;
    }

    // ============ TOTAL ASSIGNMENTS PAGE ============
    @GetMapping("/assignments/completed")
    public String viewCompletedAssignments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String type,
            Model model) {

        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        int pageSize = 10;
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("updatedAt").descending());

        Page<Assignment> assignmentPage;
        if (type != null && !type.isEmpty()) {
            Assignment.AssignmentType assignmentType = Assignment.AssignmentType.valueOf(type);
            assignmentPage = assignmentService.getCompletedAssignmentsByType(assignmentType, pageable);
        } else {
            assignmentPage = assignmentService.getCompletedAssignments(pageable);
        }

        long itCount = assignmentService.countCompletedAssignmentsByType(Assignment.AssignmentType.IT);
        long qsCount = assignmentService.countCompletedAssignmentsByType(Assignment.AssignmentType.QUANTITY_SURVEYING);
        long totalCount = itCount + qsCount;

        model.addAttribute("completedAssignments", assignmentPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", assignmentPage.getTotalPages());
        model.addAttribute("itCompletedCount", itCount);
        model.addAttribute("qsCompletedCount", qsCount);
        model.addAttribute("totalCompletedCount", totalCount);

        return "admin/total-assignments";
    }

    // ============ PENDING ASSIGNMENTS PAGE ============
    @GetMapping("/assignments/pending")
    public String viewPendingAssignments(Model model) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        List<Assignment> pendingAssignments = assignmentService.getPendingAssignments();
        model.addAttribute("assignments", pendingAssignments);
        model.addAttribute("pendingCount", pendingAssignments.size());
        return "admin/pending-assignments";
    }

    // ============ ASSIGNMENT ACTIONS ============
    @PostMapping("/assignments/{id}/approve")
    public String approveAssignment(@PathVariable Long id,
                                    @RequestParam(required = false) @Min(0) Double price,
                                    RedirectAttributes redirectAttributes) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        try {
            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);
            if (assignmentOpt.isPresent()) {
                Assignment assignment = assignmentOpt.get();
                assignment.setStatus(Assignment.AssignmentStatus.APPROVED);
                if (price != null) {
                    assignment.setPrice(price);
                }
                assignmentService.saveAssignment(assignment);

                emailService.sendAssignmentApprovalToUser(assignment.getUser().getEmail(), assignment);

                redirectAttributes.addFlashAttribute("success", "Assignment approved successfully!");
            } else {
                redirectAttributes.addFlashAttribute("error", "Assignment not found!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Failed to approve assignment: " + e.getMessage());
        }
        return "redirect:/admin/assignments/pending";
    }

    @PostMapping("/assignments/{id}/reject")
    public String rejectAssignment(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        try {
            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);
            if (assignmentOpt.isPresent()) {
                Assignment assignment = assignmentOpt.get();
                assignment.setStatus(Assignment.AssignmentStatus.REJECTED);
                assignmentService.saveAssignment(assignment);
                redirectAttributes.addFlashAttribute("success", "Assignment rejected successfully!");
            } else {
                redirectAttributes.addFlashAttribute("error", "Assignment not found!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Failed to reject assignment: " + e.getMessage());
        }
        return "redirect:/admin/assignments/pending";
    }

    @GetMapping("/assignments/{id}")
    public String viewAssignmentDetails(@PathVariable Long id, Model model) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);
        if (assignmentOpt.isPresent()) {
            model.addAttribute("assignment", assignmentOpt.get());
            return "admin/assignment-details";
        }
        return "redirect:/admin/assignments/completed?error=Assignment not found";
    }

    // ============ SYSTEM MANAGEMENT PAGE ============
    @GetMapping("/management")
    public String systemManagement(Model model) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        List<User> admins = userService.getAllAdmins();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> currentUser = userService.getUserByEmail(email);

        model.addAttribute("admins", admins);
        model.addAttribute("adminCount", admins.size());
        model.addAttribute("currentUser", currentUser.orElse(null));
        model.addAttribute("adminRegistrationDto", new AdminRegistrationDto());

        return "admin/system-management";
    }

    @PostMapping("/management/add-admin")
    public String addNewAdmin(@ModelAttribute AdminRegistrationDto adminDto,
                              BindingResult result,
                              RedirectAttributes redirectAttributes) {

        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        // Validate email doesn't exist
        if (userService.getUserByEmail(adminDto.getEmail()).isPresent()) {
            result.rejectValue("email", "error.adminRegistrationDto", "Email already registered");
        }

        // Validate password match
        if (!adminDto.getPassword().equals(adminDto.getConfirmPassword())) {
            result.rejectValue("confirmPassword", "error.adminRegistrationDto", "Passwords do not match");
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.adminRegistrationDto", result);
            redirectAttributes.addFlashAttribute("adminRegistrationDto", adminDto);
            return "redirect:/admin/management";
        }

        try {
            User newAdmin = new User();
            newAdmin.setFullName(adminDto.getFirstName() + " " + adminDto.getLastName());
            newAdmin.setEmail(adminDto.getEmail());
            newAdmin.setPassword(passwordEncoder.encode(adminDto.getPassword()));
            newAdmin.setRole("ADMIN");

            // Set specialization
            if (adminDto.getSpecialization() != null) {
                try {
                    User.Specialization specialization = User.Specialization.valueOf(adminDto.getSpecialization());
                    newAdmin.setSpecialization(specialization);
                } catch (IllegalArgumentException e) {
                    newAdmin.setSpecialization(User.Specialization.NONE);
                }
            } else {
                newAdmin.setSpecialization(User.Specialization.NONE);
            }

            userService.saveUser(newAdmin);

            // Send invitation email
            emailService.sendAdminInvitation(newAdmin.getEmail(), adminDto.getPassword());

            redirectAttributes.addFlashAttribute("success", "Admin added successfully! Invitation email sent.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Failed to add admin: " + e.getMessage());
        }

        return "redirect:/admin/management";
    }

    @PostMapping("/management/{id}/deactivate")
    public String deactivateAdmin(@PathVariable Long id,
                                  RedirectAttributes redirectAttributes) {

        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        try {
            Optional<User> adminOpt = userService.getUserById(id);
            if (adminOpt.isPresent()) {
                User admin = adminOpt.get();
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String currentEmail = auth.getName();

                if (admin.getEmail().equals(currentEmail)) {
                    redirectAttributes.addFlashAttribute("error", "Cannot deactivate your own account");
                } else {
                    admin.setRole("USER");
                    userService.saveUser(admin);
                    redirectAttributes.addFlashAttribute("success", "Admin deactivated successfully");
                }
            } else {
                redirectAttributes.addFlashAttribute("error", "Admin not found");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Failed to deactivate admin: " + e.getMessage());
        }

        return "redirect:/admin/management";
    }

    // ============ REPORTS PAGE ============
    @GetMapping("/reports")
    public String viewReports(@RequestParam(defaultValue = "30") int days,
                              Model model) {

        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        LocalDateTime startDate = LocalDateTime.now().minusDays(days);

        // Get assignment statistics
        Map<String, Object> assignmentStats = assignmentService.getAssignmentStatistics(startDate);
        model.addAttribute("stats", assignmentStats);

        // Get user statistics
        Map<String, Object> userStats = userService.getUserStatistics(startDate);
        model.addAttribute("userStats", userStats);

        // Get revenue data
        Map<String, Object> revenueData = assignmentService.getRevenueData(startDate);
        model.addAttribute("revenueData", revenueData);

        // Get admin performance
        List<AdminPerformanceDto> adminPerformance = userService.getAdminPerformance(startDate);
        model.addAttribute("adminPerformance", adminPerformance);

        // Get top users
        List<User> topUsers = userService.getTopActiveUsers(10);
        model.addAttribute("topUsers", topUsers);

        // Pass individual stats for easy access in template
        model.addAttribute("totalAssignments", assignmentStats.get("totalAssignments"));
        model.addAttribute("completionRate", assignmentStats.get("completionRate"));
        model.addAttribute("avgResponseTime", assignmentStats.get("avgResponseTime"));
        model.addAttribute("avgSatisfaction", revenueData.get("avgSatisfaction"));
        model.addAttribute("activeUsers", userStats.get("activeUsers"));
        model.addAttribute("newUsers", userStats.get("newUsers"));

        // Calculate percentages for charts
        long itCompleted = assignmentService.countCompletedAssignmentsByType(Assignment.AssignmentType.IT);
        long qsCompleted = assignmentService.countCompletedAssignmentsByType(Assignment.AssignmentType.QUANTITY_SURVEYING);
        long totalCompleted = itCompleted + qsCompleted;

        double itPercentage = totalCompleted > 0 ? (itCompleted * 100.0) / totalCompleted : 0;
        double qsPercentage = totalCompleted > 0 ? (qsCompleted * 100.0) / totalCompleted : 0;

        model.addAttribute("itPercentage", String.format("%.1f%%", itPercentage));
        model.addAttribute("qsPercentage", String.format("%.1f%%", qsPercentage));
        model.addAttribute("days", days);

        return "admin/view-reports";
    }

    /**
     * Helper method to check if the current user is an admin
     */
    private boolean isAdminUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);
        return userOptional.isPresent() && "ADMIN".equals(userOptional.get().getRole());
    }

    @GetMapping("/assignments")
    public String redirectToCompletedAssignments() {
        return "redirect:/admin/assignments/completed";
    }

    // In AdminController.java, add this method

    @GetMapping("/assignments/{id}/deliver")
    public String showDeliverSolutionForm(@PathVariable Long id, Model model) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);
        if (assignmentOpt.isEmpty()) {
            return "redirect:/admin/assignments/completed?error=Assignment not found";
        }

        Assignment assignment = assignmentOpt.get();

        // Only allow delivery for approved, completed or in-progress assignments (not for already delivered)
        if (assignment.getStatus() != Assignment.AssignmentStatus.APPROVED &&
                assignment.getStatus() != Assignment.AssignmentStatus.COMPLETED &&
                assignment.getStatus() != Assignment.AssignmentStatus.IN_PROGRESS) {
            return "redirect:/admin/assignments/" + id + "?error=Cannot deliver solution at this stage";
        }

        model.addAttribute("assignment", assignment);
        return "admin/assignment-solution-delivery";
    }

    @PostMapping("/assignments/{id}/deliver-solution")
    public String deliverSolution(@PathVariable Long id,
                                  @RequestParam("solutionFiles") List<MultipartFile> solutionFiles,
                                  @RequestParam(required = false) String adminNotes,
                                  RedirectAttributes redirectAttributes) {

        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        try {
            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);
            if (assignmentOpt.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Assignment not found!");
                return "redirect:/admin/assignments/completed";
            }

            Assignment assignment = assignmentOpt.get();
            User user = assignment.getUser();

            // Validate files
            if (solutionFiles == null || solutionFiles.isEmpty() || solutionFiles.get(0).isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Please attach at least one solution file");
                return "redirect:/admin/assignments/" + id + "/deliver";
            }

            // Validate file types and sizes
            for (MultipartFile file : solutionFiles) {
                if (file.isEmpty()) continue;

                if (!isValidSolutionFileType(file.getOriginalFilename())) {
                    redirectAttributes.addFlashAttribute("error",
                            "Invalid file type: " + file.getOriginalFilename() +
                                    ". Allowed: PDF, Word, Excel, PowerPoint, Images, ZIP files");
                    return "redirect:/admin/assignments/" + id + "/deliver";
                }

                if (file.getSize() > 25 * 1024 * 1024) { // 25MB limit
                    redirectAttributes.addFlashAttribute("error",
                            "File too large: " + file.getOriginalFilename() +
                                    ". Maximum size is 25MB");
                    return "redirect:/admin/assignments/" + id + "/deliver";
                }
            }

            // Send solution via email with attachments
            emailService.sendSolutionToUser(user, assignment, solutionFiles);

            // Update assignment status and details
            assignment.setStatus(Assignment.AssignmentStatus.DELIVERED);
            assignment.setAdminNotes(adminNotes);
            assignment.setDeliveredAt(LocalDateTime.now());

            // Save solution file names (optional - for tracking)
            String solutionFileNames = solutionFiles.stream()
                    .filter(file -> !file.isEmpty())
                    .map(MultipartFile::getOriginalFilename)
                    .collect(Collectors.joining(", "));
            assignment.setSolutionFiles(solutionFileNames);

            assignmentService.saveAssignment(assignment);

            redirectAttributes.addFlashAttribute("success",
                    "Solution delivered successfully to " + user.getEmail() +
                            " with " + solutionFiles.size() + " file(s)");

        } catch (MessagingException e) {
            log.error("Email sending failed: ", e);
            redirectAttributes.addFlashAttribute("error",
                    "Failed to send email: " + e.getMessage());
            return "redirect:/admin/assignments/" + id + "/deliver";
        } catch (IOException e) {
            log.error("File processing failed: ", e);
            redirectAttributes.addFlashAttribute("error",
                    "Failed to process files: " + e.getMessage());
            return "redirect:/admin/assignments/" + id + "/deliver";
        } catch (Exception e) {
            log.error("Error delivering solution: ", e);
            redirectAttributes.addFlashAttribute("error",
                    "Failed to deliver solution: " + e.getMessage());
            return "redirect:/admin/assignments/" + id + "/deliver";
        }

        return "redirect:/admin/assignments/completed";
    }

    @PostMapping("/assignments/{id}/mark-ready")
    public String markAssignmentReadyForDelivery(@PathVariable Long id,
                                                 RedirectAttributes redirectAttributes) {
        if (!isAdminUser()) {
            return "redirect:/dashboard?error=Unauthorized";
        }

        try {
            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);
            if (assignmentOpt.isPresent()) {
                Assignment assignment = assignmentOpt.get();
                assignment.setStatus(Assignment.AssignmentStatus.READY_FOR_DELIVERY);
                assignmentService.saveAssignment(assignment);

                redirectAttributes.addFlashAttribute("success",
                        "Assignment marked as ready for delivery");
            } else {
                redirectAttributes.addFlashAttribute("error", "Assignment not found!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "Failed to update status: " + e.getMessage());
        }

        return "redirect:/admin/assignments/completed";
    }

    /**
     * Helper method to validate solution file types
     */
    private boolean isValidSolutionFileType(String filename) {
        if (filename == null) return false;

        String[] allowedExtensions = {".pdf", ".doc", ".docx", ".txt",
                ".jpg", ".jpeg", ".png", ".gif", ".bmp",
                ".xlsx", ".xls", ".pptx", ".ppt",
                ".zip", ".rar", ".7z", ".tar.gz"};

        String fileExtension = "";
        if (filename.contains(".")) {
            fileExtension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        } else {
            return false;
        }

        return Arrays.asList(allowedExtensions).contains(fileExtension);
    }

}