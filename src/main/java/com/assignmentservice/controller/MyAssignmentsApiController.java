package com.assignmentservice.controller;

import com.assignmentservice.model.Assignment;
import com.assignmentservice.model.Payment;
import com.assignmentservice.model.User;
import com.assignmentservice.service.AssignmentService;
import com.assignmentservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Standalone controller (kept separate from AssignmentController, which is
 * mapped at class-level to "/assignments") so JSON endpoints live at clean
 * paths the React frontend can call directly, e.g. GET /api/assignments/my-assignments
 * and GET /api/assignments/{id} — with no class-level prefix concatenation.
 *
 * NOTE: getAssignmentApi() used to live inside AssignmentController as
 * @GetMapping("/api/assignments/{id}"), but because that controller has
 * @RequestMapping("/assignments") at the class level, the real path was
 * actually "/assignments/api/assignments/{id}" — not what the frontend
 * expects. That method has been moved here and removed from
 * AssignmentController to fix the mismatch.
 */
@RestController
public class MyAssignmentsApiController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private UserService userService;

    @GetMapping("/api/assignments/my-assignments")
    @ResponseBody
    public ResponseEntity<?> getMyAssignments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }
        User user = userOptional.get();

        List<Assignment> assignments = assignmentService.getUserAssignments(user);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Assignment assignment : assignments) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", assignment.getId());
            item.put("title", assignment.getTitle());
            item.put("type", assignment.getType() != null ? assignment.getType().toString() : null);
            item.put("subject", assignment.getSubject());
            item.put("status", assignment.getStatus() != null ? assignment.getStatus().toString() : null);
            item.put("createdAt", assignment.getCreatedAt());
            item.put("deadline", assignment.getDeadline());
            item.put("price", assignment.getPrice());
            item.put("finalPrice", assignment.getFinalPrice());
            item.put("adminNotes", assignment.getAdminNotes());
            item.put("revisionsUsed", assignment.getRevisionsUsed());
            item.put("maxRevisions", assignment.getMaxRevisions());
            item.put("solutionFiles", assignment.getSolutionFiles() != null && !assignment.getSolutionFiles().isBlank()
                    ? Arrays.asList(assignment.getSolutionFiles().split(","))
                    : List.of());

            // Attach payment info if it exists
            Map<String, Object> paymentMap = null;
            try {
                Payment payment = assignmentService.getPaymentByAssignment(assignment);
                if (payment != null) {
                    paymentMap = new HashMap<>();
                    paymentMap.put("status", payment.getStatus() != null ? payment.getStatus().toString() : null);
                    Map<String, Object> currencyMap = new HashMap<>();
                    currencyMap.put("symbol", payment.getCurrency() != null
                            ? currencySymbolFor(payment.getCurrency().name()) : "$");
                    paymentMap.put("currency", currencyMap);
                }
            } catch (Exception e) {
                // No payment yet — leave paymentMap null
            }
            item.put("payment", paymentMap);

            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * JSON version of AssignmentController's Thymeleaf viewAssignment().
     * Moved here (from @GetMapping("/api/assignments/{id}") inside
     * AssignmentController) to fix the double-prefix path bug — this now
     * lives at the real /api/assignments/{id}.
     */
    @GetMapping("/api/assignments/{id}")
    @ResponseBody
    public ResponseEntity<?> getAssignmentApi(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        User currentUser = userOptional.get();

        Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);
        if (assignmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Assignment not found"));
        }

        Assignment assignment = assignmentOpt.get();

        boolean isOwner = assignment.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = "ADMIN".equals(currentUser.getRole()) || "SUPER_ADMIN".equals(currentUser.getRole());

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to view this assignment"));
        }
        if (isAdmin && !isOwner && !assignmentService.canAdminAccessAssignment(currentUser, assignment)) {
            return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to access this assignment"));
        }

        Payment payment = null;
        try {
            payment = assignmentService.getPaymentByAssignment(assignment);
        } catch (Exception e) {
            // continue without payment info
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", assignment.getId());
        response.put("title", assignment.getTitle());
        response.put("subject", assignment.getSubject());
        response.put("type", assignment.getType());
        response.put("status", assignment.getStatus());
        response.put("description", assignment.getDescription());
        response.put("additionalRequirements", assignment.getAdditionalRequirements());
        response.put("adminNotes", assignment.getAdminNotes());
        response.put("deadline", assignment.getDeadline() != null ? assignment.getDeadline().toString() : null);
        response.put("createdAt", assignment.getCreatedAt() != null ? assignment.getCreatedAt().toString() : null);
        response.put("updatedAt", assignment.getUpdatedAt() != null ? assignment.getUpdatedAt().toString() : null);
        response.put("deliveredAt", assignment.getDeliveredAt() != null ? assignment.getDeliveredAt().toString() : null);
        response.put("revisionsUsed", assignment.getRevisionsUsed());
        response.put("maxRevisions", assignment.getMaxRevisions());

        response.put("price", assignment.getPrice());
        response.put("finalPrice", assignment.getFinalPrice());
        response.put("currency", payment != null ? payment.getCurrency().name() : "USD");

        response.put("descriptionFiles", assignment.getDescriptionFiles() != null && !assignment.getDescriptionFiles().isBlank()
                ? Arrays.asList(assignment.getDescriptionFiles().split(","))
                : List.of());
        response.put("requirementsFiles", assignment.getRequirementsFiles() != null && !assignment.getRequirementsFiles().isBlank()
                ? Arrays.asList(assignment.getRequirementsFiles().split(","))
                : List.of());
        response.put("solutionFiles", assignment.getSolutionFiles() != null && !assignment.getSolutionFiles().isBlank()
                ? Arrays.asList(assignment.getSolutionFiles().split(","))
                : List.of());

        List<Map<String, Object>> revisions = assignmentService
                .getRevisionRequestsByAssignment(id)
                .stream()
                .map(r -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("reason", r.getReason());
                    m.put("status", r.getStatus());
                    m.put("requestedAt", r.getRequestedAt() != null ? r.getRequestedAt().toString() : null);
                    m.put("adminNotes", r.getAdminNotes());
                    return m;
                })
                .collect(Collectors.toList());
        response.put("revisionRequests", revisions);

        response.put("isOwner", isOwner);
        response.put("isAdmin", isAdmin);
        response.put("currency", assignment.getCurrency() != null
        ? assignment.getCurrency()
        : (payment != null ? payment.getCurrency().name() : "USD"));

        return ResponseEntity.ok(response);
    }

    private String currencySymbolFor(String currencyCode) {
        return switch (currencyCode) {
            case "LKR" -> "Rs.";
            case "EUR" -> "€";
            case "GBP" -> "£";
            default -> "$";
        };
    }
}