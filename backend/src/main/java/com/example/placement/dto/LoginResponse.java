package com.example.placement.dto;

public class LoginResponse {

    private String message;
    private String role;
    private String email;
    private Long userId;
    private String token;

    public LoginResponse() {
    }

    public LoginResponse(String message, String role, String email, Long userId) {
        this.message = message;
        this.role = role;
        this.email = email;
        this.userId = userId;
    }

    public LoginResponse(String message, String role, String email, Long userId, String token) {
        this.message = message;
        this.role = role;
        this.email = email;
        this.userId = userId;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
