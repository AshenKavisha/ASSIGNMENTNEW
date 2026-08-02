package com.assignmentservice.controller;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Assignment.AssignmentStatus;
import com.assignmentservice.model.User;
import com.assignmentservice.service.AssignmentService;
import com.assignmentservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

// ============================================================
// POST /api/assignments/submit
// React API endpoint — returns JSON, not a redirect.
// Called by CreateAssignment.jsx as /api/assignments/submit
//
// Pulled out into its own @RestController (no class-level
// "/assignments" prefix) so the path is exactly /api/assignments/submit
// instead of accidentally becoming /assignments/api/assignments/submit.
//
// NOTE: Admin notification on submission is handled inside
// AssignmentService.createAssignmentWithFiles() — do NOT call
// notificationService here too, or admins get duplicate notifications.
//
// UPDATED: now accepts academicYear, semester, moduleCode from the
// SLIIT module selector in CreateAssignment.jsx and persists them
// onto the Assignment entity.
// ============================================================
@RestController
@RequestMapping("/api/assignments")
public class AssignmentApiController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private UserService userService;

    @PostMapping("/submit")
    public ResponseEntity<?> createAssignmentApi(
            @RequestParam("type")                                                       String type,
            @RequestParam("title")                                                      String title,
            @RequestParam("subject")                                                    String subject,
            @RequestParam("deadline")                                                   String deadlineStr,
            @RequestParam("description")                                                String description,
            @RequestParam(value = "additionalRequirements", required = false, defaultValue = "") String additionalRequirements,
            @RequestParam(value = "universityName", required = false, defaultValue = "") String universityName,
            @RequestParam(value = "academicYear", required = false, defaultValue = "")  String academicYear,
            @RequestParam(value = "semester",     required = false, defaultValue = "")  String semester,
            @RequestParam(value = "moduleCode",   required = false, defaultValue = "")  String moduleCode,
            @RequestParam(value = "descriptionFiles",        required = false)          List<MultipartFile> descriptionFiles,
            @RequestParam(value = "requirementFiles",        required = false)          List<MultipartFile> requirementFiles) {

        // ── 1. Auth check ────────────────────────────────────────────────────
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Not authenticated. Please log in.");
        }

        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("User not found.");
        }
        User user = userOptional.get();

        // ── 2. Field validation ──────────────────────────────────────────────
        if (type == null || type.isBlank())
            return ResponseEntity.badRequest().body("Assignment type is required.");
        if (title == null || title.isBlank())
            return ResponseEntity.badRequest().body("Title is required.");
        if (subject == null || subject.isBlank())
            return ResponseEntity.badRequest().body("Subject is required.");
        if (description == null || description.trim().length() <= 10)
            return ResponseEntity.badRequest().body("Description must be at least 11 characters.");
        if (deadlineStr == null || deadlineStr.isBlank())
            return ResponseEntity.badRequest().body("Deadline is required.");

        // ── 3. Parse assignment type enum ────────────────────────────────────
        Assignment.AssignmentType assignmentType;
        try {
            assignmentType = Assignment.AssignmentType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    "Invalid assignment type '" + type + "'. Accepted: IT, QUANTITY_SURVEYING.");
        }

        // ── 4. Parse deadline (datetime-local sends "yyyy-MM-ddTHH:mm") ──────
        java.time.LocalDateTime deadline;
        try {
            deadline = java.time.LocalDateTime.parse(deadlineStr,
                    DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
        } catch (java.time.format.DateTimeParseException e1) {
            try {
                deadline = java.time.LocalDateTime.parse(deadlineStr,
                        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            } catch (java.time.format.DateTimeParseException e2) {
                return ResponseEntity.badRequest().body(
                        "Invalid deadline format. Expected: yyyy-MM-ddTHH:mm");
            }
        }
        if (deadline.isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Deadline must be in the future.");
        }

        // ── 5. Build Assignment entity ────────────────────────────────────────
        Assignment assignment = new Assignment();
        assignment.setUser(user);
        assignment.setType(assignmentType);
        assignment.setTitle(title.trim());
        assignment.setSubject(subject.trim());
        assignment.setDeadline(deadline.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")));
        assignment.setDescription(description.trim());
        assignment.setAdditionalRequirements(additionalRequirements.trim());
        assignment.setUniversityName(universityName.isBlank() ? null : universityName.trim());
        assignment.setAcademicYear(academicYear.isBlank() ? null : academicYear.trim());
        assignment.setSemester(semester.isBlank() ? null : semester.trim());
        assignment.setModuleCode(moduleCode.isBlank() ? null : moduleCode.trim());
        assignment.setStatus(AssignmentStatus.PENDING);
        assignment.setCreatedAt(java.time.LocalDateTime.now());

        if (descriptionFiles != null) {
            String names = descriptionFiles.stream()
                    .filter(f -> !f.isEmpty())
                    .map(MultipartFile::getOriginalFilename)
                    .collect(Collectors.joining(", "));
            if (!names.isBlank()) assignment.setDescriptionFiles(names);
        }
        if (requirementFiles != null) {
            String names = requirementFiles.stream()
                    .filter(f -> !f.isEmpty())
                    .map(MultipartFile::getOriginalFilename)
                    .collect(Collectors.joining(", "));
            if (!names.isBlank()) assignment.setRequirementsFiles(names);
        }

        // ── 6. Save + send emails / notifications (handled inside the service) ─
        try {
            assignmentService.createAssignmentWithFiles(
                    assignment,
                    descriptionFiles != null ? descriptionFiles : List.of(),
                    requirementFiles != null ? requirementFiles : List.of()
            );

            System.out.println("✅ Assignment created via React API for: " + user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("id",      assignment.getId());
            response.put("title",   assignment.getTitle());
            response.put("status",  assignment.getStatus());
            response.put("message", "Assignment submitted successfully! Admin will review it shortly.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Assignment creation failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to submit assignment: " + e.getMessage());
        }
    }
}