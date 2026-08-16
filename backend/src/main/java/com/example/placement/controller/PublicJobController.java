package com.example.placement.controller;

import com.example.placement.model.Job;
import com.example.placement.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicJobController {

    private final JobService jobService;

    public PublicJobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Public endpoint for browsing jobs (available to all authenticated roles)
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllPublicJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }
}
