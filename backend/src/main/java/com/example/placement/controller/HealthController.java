package com.example.placement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Student Placement Management Backend");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now().toString());

        // Check database connectivity
        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(2);
            response.put("database", valid ? "CONNECTED" : "UNREACHABLE");
            response.put("databaseProduct", conn.getMetaData().getDatabaseProductName());
        } catch (Exception e) {
            response.put("database", "DISCONNECTED");
            response.put("databaseError", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return getHealth();
    }
}
