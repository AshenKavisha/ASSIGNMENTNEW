package com.assignmentservice.controller;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Assignment.AssignmentStatus;
import com.assignmentservice.model.RevisionRequest;
import com.assignmentservice.model.User;
import com.assignmentservice.service.AssignmentService;
import com.assignmentservice.service.EmailService;
import com.assignmentservice.service.NotificationService;
import com.assignmentservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Arrays;

@Controller
@RequestMapping("/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    // Define upload directory
    private static final String UPLOAD_BASE_DIR = "uploads/assignments/";

    // ============================================
    // EXISTING METHODS - All your current code
    // ============================================

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return "redirect:/login";
        }

        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);

        if (userOptional.isEmpty()) {
            return "redirect:/login";
        }

        User user = userOptional.get();
        model.addAttribute("user", user);
        model.addAttribute("assignment", new Assignment());
        return "create-assignment";
    }

    @PostMapping("/create")
    public String createAssignment(@Valid @ModelAttribute Assignment assignment,
                                   BindingResult result,
                                   Model model,
                                   HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return "redirect:/login";
        }

        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);

        if (userOptional.isEmpty()) {
            return "redirect:/login";
        }

        User user = userOptional.get();

        System.out.println("=== DEBUG: Starting assignment creation ===");
        System.out.println("Project directory: " + System.getProperty("user.dir"));
        System.out.println("User ID: " + user.getId());
        System.out.println("Assignment title: " + assignment.getTitle());
        System.out.println("Description file count: " + (assignment.getDescriptionFileList() != null ? assignment.getDescriptionFileList().size() : 0));
        System.out.println("Requirements file count: " + (assignment.getRequirementsFileList() != null ? assignment.getRequirementsFileList().size() : 0));

        if (result.hasErrors()) {
            System.out.println("=== DEBUG: Form validation errors ===");
            result.getAllErrors().forEach(error -> System.out.println("Error: " + error.getDefaultMessage()));
            model.addAttribute("user", user);
            return "create-assignment";
        }

        try {
            assignment.setUser(user);
            assignment.setStatus(AssignmentStatus.PENDING);
            System.out.println("Creating assignment with status: " + assignment.getStatus());

            String userUploadDir = user.getId() + "/";
            String absolutePath = UPLOAD_BASE_DIR + userUploadDir;
            System.out.println("Checking upload directory: " + absolutePath);

            File directory = new File(absolutePath);
            if (!directory.exists()) {
                System.out.println("Creating directory: " + absolutePath);
                if (directory.mkdirs()) {
                    System.out.println("Directory created successfully");
                } else {
                    System.err.println("Failed to create directory");
                    throw new IOException("Could not create upload directory: " + absolutePath);
                }
            } else {
                System.out.println("Directory already exists");
            }

            if (!directory.canWrite()) {
                System.err.println("Directory is not writable");
                throw new IOException("Upload directory is not writable: " + absolutePath);
            }

            handleFileUploads(assignment, absolutePath, userUploadDir);
            assignmentService.createAssignment(assignment);
            System.out.println("Assignment created successfully with ID: " + assignment.getId());

            return "redirect:/dashboard?success=Assignment submitted successfully!";

        } catch (Exception e) {
            System.err.println("=== ERROR: Assignment creation failed ===");
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Error class: " + e.getClass().getName());
            e.printStackTrace();

            model.addAttribute("user", user);
            model.addAttribute("error", "Failed to create assignment: " + e.getMessage());
            return "create-assignment";
        }
    }

    private void handleFileUploads(Assignment assignment, String absolutePath, String userUploadDir) throws Exception {
        try {
            System.out.println("=== handleFileUploads START ===");
            System.out.println("Upload directory: " + absolutePath);

            List<String> descriptionFilePaths = new ArrayList<>();
            if (assignment.getDescriptionFileList() != null && !assignment.getDescriptionFileList().isEmpty()) {
                System.out.println("Processing " + assignment.getDescriptionFileList().size() + " description files");

                for (int i = 0; i < assignment.getDescriptionFileList().size(); i++) {
                    MultipartFile file = assignment.getDescriptionFileList().get(i);
                    System.out.println("Description file " + (i+1) + ": " +
                            (file.getOriginalFilename() != null ? file.getOriginalFilename() : "null") +
                            ", Size: " + file.getSize() + " bytes");

                    if (!file.isEmpty() && isValidFileType(file.getOriginalFilename())) {
                        String savedFileName = saveFile(file, absolutePath);
                        if (savedFileName != null) {
                            String relativePath = "assignments/" + userUploadDir + savedFileName;
                            descriptionFilePaths.add(relativePath);
                            System.out.println("Description file saved: " + relativePath);
                        }
                    } else {
                        System.out.println("Description file " + (i+1) + " is empty or invalid type");
                    }
                }
            } else {
                System.out.println("No description files to process");
            }

            List<String> requirementsFilePaths = new ArrayList<>();
            if (assignment.getRequirementsFileList() != null && !assignment.getRequirementsFileList().isEmpty()) {
                System.out.println("Processing " + assignment.getRequirementsFileList().size() + " requirements files");

                for (int i = 0; i < assignment.getRequirementsFileList().size(); i++) {
                    MultipartFile file = assignment.getRequirementsFileList().get(i);
                    System.out.println("Requirements file " + (i+1) + ": " +
                            (file.getOriginalFilename() != null ? file.getOriginalFilename() : "null") +
                            ", Size: " + file.getSize() + " bytes");

                    if (!file.isEmpty() && isValidFileType(file.getOriginalFilename())) {
                        String savedFileName = saveFile(file, absolutePath);
                        if (savedFileName != null) {
                            String relativePath = "assignments/" + userUploadDir + savedFileName;
                            requirementsFilePaths.add(relativePath);
                            System.out.println("Requirements file saved: " + relativePath);
                        }
                    } else {
                        System.out.println("Requirements file " + (i+1) + " is empty or invalid type");
                    }
                }
            } else {
                System.out.println("No requirements files to process");
            }

            if (!descriptionFilePaths.isEmpty()) {
                String descFiles = String.join(",", descriptionFilePaths);
                assignment.setDescriptionFiles(descFiles);
                System.out.println("Description files saved to DB: " + descFiles);
            } else {
                System.out.println("No description files saved");
            }

            if (!requirementsFilePaths.isEmpty()) {
                String reqFiles = String.join(",", requirementsFilePaths);
                assignment.setRequirementsFiles(reqFiles);
                System.out.println("Requirements files saved to DB: " + reqFiles);
            } else {
                System.out.println("No requirements files saved");
            }

        } catch (Exception e) {
            System.err.println("Error in handleFileUploads: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private String saveFile(MultipartFile file, String uploadDir) throws IOException {
        try {
            String originalFilename = file.getOriginalFilename();
            System.out.println("Original filename: " + originalFilename);

            String fileExtension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                System.out.println("File extension: " + fileExtension);
            } else {
                System.out.println("No file extension found");
                fileExtension = ".txt";
            }

            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            String filePath = uploadDir + uniqueFilename;

            System.out.println("Saving file to: " + filePath);
            System.out.println("File size: " + file.getSize() + " bytes");

            Path path = Paths.get(filePath);
            Files.copy(file.getInputStream(), path);

            System.out.println("File saved successfully: " + uniqueFilename);
            return uniqueFilename;

        } catch (Exception e) {
            System.err.println("Error saving file: " + e.getMessage());
            System.err.println("Upload directory: " + uploadDir);
            e.printStackTrace();
            throw e;
        }
    }

    private boolean isValidFileType(String filename) {
        if (filename == null) {
            System.out.println("Filename is null");
            return false;
        }

        System.out.println("Validating file type for: " + filename);

        String[] allowedExtensions = {".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png", ".xlsx", ".xls", ".pptx", ".ppt"};

        String fileExtension = "";
        if (filename.contains(".")) {
            fileExtension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        } else {
            System.out.println("No file extension in filename");
            return false;
        }

        System.out.println("File extension: " + fileExtension);

        for (String ext : allowedExtensions) {
            if (fileExtension.equals(ext)) {
                System.out.println("File type is valid");
                return true;
            }
        }

        System.out.println("File type is NOT valid. Allowed extensions: " + Arrays.toString(allowedExtensions));
        return false;
    }

    @GetMapping("/my-assignments")
    public String viewMyAssignments(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return "redirect:/login";
        }

        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);

        if (userOptional.isEmpty()) {
            return "redirect:/login";
        }

        User user = userOptional.get();
        List<Assignment> assignments = assignmentService.getUserAssignments(user);

        long completedCount = assignments.stream()
                .filter(a -> a.getStatus() == AssignmentStatus.COMPLETED)
                .count();
        long pendingCount = assignments.stream()
                .filter(a -> a.getStatus() == AssignmentStatus.PENDING)
                .count();
        long inProgressCount = assignments.stream()
                .filter(a -> a.getStatus() == AssignmentStatus.IN_PROGRESS)
                .count();

        model.addAttribute("assignments", assignments);
        model.addAttribute("completedCount", completedCount);
        model.addAttribute("pendingCount", pendingCount);
        model.addAttribute("inProgressCount", inProgressCount);
        model.addAttribute("user", user);
        return "my-assignments";
    }

    // ============================================
    // REVISION FEATURE METHODS
    // ============================================

    /**
     * Request revision for a delivered assignment
     */
    @PostMapping("/{id}/request-revision")
    public String requestRevision(
            @PathVariable Long id,
            @RequestParam String reason,
            RedirectAttributes redirectAttributes) {

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Optional<User> userOptional = userService.getUserByEmail(email);

            if (userOptional.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "User not found.");
                return "redirect:/login";
            }

            User user = userOptional.get();
            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);

            if (assignmentOpt.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Assignment not found.");
                return "redirect:/assignments/my-assignments";
            }

            Assignment assignment = assignmentOpt.get();

            // Validate ownership
            if (!assignment.getUser().getId().equals(user.getId())) {
                redirectAttributes.addFlashAttribute("error",
                        "You are not authorized to request revision for this assignment.");
                return "redirect:/assignments/my-assignments";
            }

            // Validate revision availability
            if (!assignment.canRequestRevision()) {
                if (assignment.hasExhaustedRevisions()) {
                    redirectAttributes.addFlashAttribute("error",
                            "You have used all available revisions for this assignment.");
                } else {
                    redirectAttributes.addFlashAttribute("error",
                            "Revision cannot be requested for assignments with status: " + assignment.getStatus());
                }
                return "redirect:/assignments/my-assignments";
            }

            // Validate reason
            if (reason == null || reason.trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("error",
                        "Please provide a reason for the revision request.");
                return "redirect:/assignments/my-assignments";
            }

            // Create revision request
            RevisionRequest revisionRequest = assignmentService.createRevisionRequest(id, reason);

            // Update assignment
            assignment.setStatus(Assignment.AssignmentStatus.REVISION_REQUESTED);
            assignment.incrementRevisionsUsed();
            assignmentService.saveAssignment(assignment);

            // Send notifications
            try {
                emailService.sendRevisionRequestNotificationToAdmin(assignment, revisionRequest);
                emailService.sendRevisionRequestConfirmationToUser(assignment, revisionRequest);
                notificationService.notifyAdminRevisionRequested(assignment, revisionRequest);
            } catch (Exception e) {
                System.err.println("Failed to send revision email notifications: " + e.getMessage());
            }

            redirectAttributes.addFlashAttribute("success",
                    "Revision request submitted successfully! The admin will review your request and work on the changes.");

        } catch (Exception e) {
            System.err.println("Error submitting revision request: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error",
                    "Failed to submit revision request: " + e.getMessage());
        }

        return "redirect:/assignments/my-assignments";
    }


    /**
     * Show delivery solution page (GET request)
     * This displays the form for uploading solution files
     */
    @GetMapping("/{id}/deliver-solution")
    public String showDeliverSolutionPage(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Optional<User> userOptional = userService.getUserByEmail(email);

            if (userOptional.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "User not found.");
                return "redirect:/login";
            }

            User admin = userOptional.get();

            // Check if user is admin (role is stored as String: "ADMIN" or "SUPER_ADMIN")
            if (!admin.getRole().equals("ADMIN") && !admin.getRole().equals("SUPER_ADMIN")) {
                redirectAttributes.addFlashAttribute("error", "Access denied. Admin privileges required.");
                return "redirect:/dashboard";
            }

            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);

            if (assignmentOpt.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Assignment not found.");
                return "redirect:/admin/assignments";
            }

            Assignment assignment = assignmentOpt.get();

            // Check if admin can access this assignment based on specialization
            if (!assignmentService.canAdminAccessAssignment(admin, assignment)) {
                redirectAttributes.addFlashAttribute("error",
                        "You don't have permission to access this assignment. Check your specialization.");
                return "redirect:/admin/assignments";
            }

            model.addAttribute("assignment", assignment);
            return "admin/assignment-solution-delivery";

        } catch (Exception e) {
            System.err.println("Error loading delivery solution page: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error",
                    "Failed to load delivery page: " + e.getMessage());
            return "redirect:/admin/assignments";
        }
    }

    /**
     * Deliver solution to user (POST request)
     * This handles the actual solution file upload and email delivery
     */
    @PostMapping("/{id}/deliver-solution")
    public String deliverSolution(@PathVariable Long id,
                                  @RequestParam("solutionFiles") List<MultipartFile> solutionFiles,
                                  @RequestParam(value = "adminNotes", required = false) String adminNotes,
                                  @RequestParam(value = "finalPrice", required = false) Double finalPrice,
                                  RedirectAttributes redirectAttributes) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Optional<User> userOptional = userService.getUserByEmail(email);

            if (userOptional.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "User not found.");
                return "redirect:/login";
            }

            User admin = userOptional.get();

            // Check if user is admin
            if (!admin.getRole().equals("ADMIN") && !admin.getRole().equals("SUPER_ADMIN")) {
                redirectAttributes.addFlashAttribute("error", "Access denied. Admin privileges required.");
                return "redirect:/dashboard";
            }

            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);

            if (assignmentOpt.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Assignment not found.");
                return "redirect:/admin/assignments";
            }

            Assignment assignment = assignmentOpt.get();

            // Check if admin can access this assignment based on specialization
            if (!assignmentService.canAdminAccessAssignment(admin, assignment)) {
                redirectAttributes.addFlashAttribute("error",
                        "You don't have permission to access this assignment. Check your specialization.");
                return "redirect:/admin/assignments";
            }

            // Validate solution files
            if (solutionFiles == null || solutionFiles.isEmpty() ||
                    solutionFiles.stream().allMatch(MultipartFile::isEmpty)) {
                redirectAttributes.addFlashAttribute("error", "Please upload at least one solution file.");
                return "redirect:/assignments/" + id + "/deliver-solution";
            }

            // Create solution upload directory
            String userUploadDir = assignment.getUser().getId() + "/solutions/";
            String absolutePath = UPLOAD_BASE_DIR + userUploadDir;

            System.out.println("=== Solution Delivery: Creating directory ===");
            System.out.println("Path: " + absolutePath);

            File directory = new File(absolutePath);
            if (!directory.exists()) {
                if (directory.mkdirs()) {
                    System.out.println("Directory created successfully");
                } else {
                    throw new IOException("Could not create solution directory: " + absolutePath);
                }
            }

            // Save solution files
            List<String> solutionFilePaths = new ArrayList<>();
            System.out.println("=== Saving solution files ===");

            for (MultipartFile file : solutionFiles) {
                if (!file.isEmpty()) {
                    System.out.println("Processing file: " + file.getOriginalFilename() +
                            " | Size: " + (file.getSize() / 1024) + " KB");

                    String savedFileName = saveFile(file, absolutePath);
                    if (savedFileName != null) {
                        String relativePath = "assignments/" + userUploadDir + savedFileName;
                        solutionFilePaths.add(relativePath);
                        System.out.println("✓ File saved: " + relativePath);
                    }
                }
            }

            if (solutionFilePaths.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Failed to save solution files.");
                return "redirect:/assignments/" + id + "/deliver-solution";
            }

            // Update assignment with solution details
            assignment.setSolutionFiles(String.join(",", solutionFilePaths));
            assignment.setAdminNotes(adminNotes);
            assignment.setFinalPrice(finalPrice);
            assignment.setStatus(AssignmentStatus.DELIVERED);
            assignment.setDeliveredAt(java.time.LocalDateTime.now());
            assignmentService.saveAssignment(assignment);

            System.out.println("=== Assignment updated with solution ===");
            System.out.println("Assignment ID: " + assignment.getId());
            System.out.println("Status: " + assignment.getStatus());
            System.out.println("Files: " + assignment.getSolutionFiles());

            // Send notifications
            try {
                // Send email with solution files attached
                emailService.sendSolutionToUser(assignment.getUser(), assignment, solutionFiles);
                System.out.println("✓ Email sent to user with attachments");

                // ⭐ NEW: Send in-app notification to user
                notificationService.notifyUserSolutionDelivered(assignment, admin);
                System.out.println("✓ In-app notification created for user");

            } catch (Exception e) {
                System.err.println("Failed to send notifications: " + e.getMessage());
                e.printStackTrace();
                // Don't fail the entire operation if notifications fail
            }

            redirectAttributes.addFlashAttribute("success",
                    "Solution delivered successfully! The user has been notified via email and in-app notification.");
            return "redirect:/admin/assignments";

        } catch (Exception e) {
            System.err.println("=== ERROR: Solution delivery failed ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error",
                    "Failed to deliver solution: " + e.getMessage());
            return "redirect:/assignments/" + id + "/deliver-solution";
        }
    }
    /**
     * Download solution file
     */
    @GetMapping("/{id}/download-solution")
    public ResponseEntity<Resource> downloadSolution(@PathVariable Long id) {

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Optional<User> userOptional = userService.getUserByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            User user = userOptional.get();
            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);

            if (assignmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Assignment assignment = assignmentOpt.get();

            // Validate ownership
            if (!assignment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Check if solution exists
            if (assignment.getSolutionFiles() == null || assignment.getSolutionFiles().isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Get first solution file
            String solutionFilePath = assignment.getSolutionFiles().split(",")[0];

            // Construct full path
            Path filePath = Paths.get("uploads/" + solutionFilePath);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                System.err.println("Solution file not found or not readable: " + filePath);
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String filename = filePath.getFileName().toString();

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (Exception e) {
            System.err.println("Error downloading solution: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}