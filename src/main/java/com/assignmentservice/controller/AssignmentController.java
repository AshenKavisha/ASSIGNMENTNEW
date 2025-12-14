package com.assignmentservice.controller;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Assignment.AssignmentStatus;
import com.assignmentservice.model.User;
import com.assignmentservice.service.AssignmentService;
import com.assignmentservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    // Define upload directory - you can move this to application.properties
    private static final String UPLOAD_BASE_DIR = "uploads/assignments/";

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        // Get authenticated user from Spring Security
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
        // Get authenticated user from Spring Security
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

            // Add user back to model for the form
            model.addAttribute("user", user);
            return "create-assignment";
        }

        try {
            // Handle file uploads
            System.out.println("=== DEBUG: Handling file uploads ===");
            handleFileUploads(assignment, request, user);

            // Set user and save assignment
            assignment.setUser(user);
            System.out.println("=== DEBUG: Saving assignment to database ===");
            assignmentService.createAssignment(assignment);

            System.out.println("=== DEBUG: Assignment created successfully ===");
            return "redirect:/dashboard?success=Assignment submitted successfully! We'll review it and get back to you.";

        } catch (IOException e) {
            System.err.println("=== DEBUG: File upload error ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();

            // Handle file upload error
            model.addAttribute("error", "Error uploading files: " + e.getMessage());
            model.addAttribute("user", user);
            return "create-assignment";

        } catch (Exception e) {
            System.err.println("=== DEBUG: General error ===");
            System.err.println("Error type: " + e.getClass().getName());
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Stack trace:");
            e.printStackTrace();

            // Handle other errors
            model.addAttribute("error", "Error submitting assignment: " +
                    (e.getMessage() != null ? e.getMessage() : "Unknown error occurred"));
            model.addAttribute("user", user);
            return "create-assignment";
        }
    }

    private void handleFileUploads(Assignment assignment, HttpServletRequest request, User user) throws IOException {
        try {
            // Get project root
            String projectRoot = System.getProperty("user.dir");
            System.out.println("Project root: " + projectRoot);

            // Create user-specific upload directory path
            String userUploadDir = user.getId() + "/" + System.currentTimeMillis() + "/";
            String absolutePath = projectRoot + File.separator + UPLOAD_BASE_DIR + userUploadDir;

            // Normalize for Windows
            absolutePath = absolutePath.replace("/", "\\");
            System.out.println("Upload directory: " + absolutePath);

            // Create directory if it doesn't exist
            File dir = new File(absolutePath);
            System.out.println("Directory exists before creation: " + dir.exists());

            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                System.out.println("Directory created: " + created);
                System.out.println("Directory exists after creation: " + dir.exists());
                System.out.println("Directory path: " + dir.getAbsolutePath());
                System.out.println("Can write to directory: " + dir.canWrite());
            }

            // Check if directory is writable
            if (!dir.canWrite()) {
                throw new IOException("Cannot write to directory: " + absolutePath);
            }

            // Handle description files
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
                            // Store relative path from uploads base
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

            // Handle requirements files
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
                            // Store relative path from uploads base
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

            // Set file paths in assignment
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
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            System.out.println("Original filename: " + originalFilename);

            String fileExtension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                System.out.println("File extension: " + fileExtension);
            } else {
                System.out.println("No file extension found");
                fileExtension = ".txt"; // Default extension
            }

            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            String filePath = uploadDir + uniqueFilename;

            System.out.println("Saving file to: " + filePath);
            System.out.println("File size: " + file.getSize() + " bytes");

            // Save file
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
        // Get authenticated user from Spring Security
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

        // Calculate status counts for statistics
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
}