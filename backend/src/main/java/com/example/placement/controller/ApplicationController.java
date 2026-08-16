package com.example.placement.controller;

import com.example.placement.model.Application;
import com.example.placement.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Application application, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        Application savedApplication = applicationService.saveApplication(application, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedApplication);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String email = authentication.getName();
        return ResponseEntity.ok(applicationService.getApplicationsByStudentEmail(email));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @GetMapping
    public List<Application> getAllApplications(Authentication authentication) {
        if (authentication != null &&
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_STUDENT"))) {
            throw new org.springframework.security.access.AccessDeniedException("Students cannot access applications management");
        }
        if (authentication != null &&
                authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_COMPANY"))) {
            String email = authentication.getName();
            return applicationService.getApplicationsByCompanyEmail(email);
        }
        // Admin can see all applications
        return applicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_STUDENT"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
        }
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        String companyEmail = isAdmin ? null : authentication.getName();
        try {
            Application updated = applicationService.updateApplicationStatus(id, status.toUpperCase(), companyEmail);
            return ResponseEntity.ok(updated);
        } catch (org.springframework.security.access.AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id, Authentication authentication) {
        // Unauthenticated -> forbid
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // Students are not allowed to delete applications
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_STUDENT"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // Retrieve the application
        var optionalApp = applicationService.getApplicationById(id);
        if (optionalApp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var app = optionalApp.get();
        // ADMIN can delete any application
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            applicationService.deleteApplication(id);
            return ResponseEntity.noContent().build();
        }
        // COMPANY can delete only its own applications
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_COMPANY"))) {
            var companyUserEmail = app.getJob() != null && app.getJob().getCompany() != null && app.getJob().getCompany().getUser() != null
                    ? app.getJob().getCompany().getUser().getEmail()
                    : null;
            if (companyUserEmail == null || !companyUserEmail.equals(authentication.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            applicationService.deleteApplication(id);
            return ResponseEntity.noContent().build();
        }
        // Fallback forbid
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}
