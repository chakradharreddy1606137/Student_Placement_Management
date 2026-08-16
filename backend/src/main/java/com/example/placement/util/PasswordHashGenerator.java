package com.example.placement.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Simple helper to generate a BCrypt hash for a given password.
 * Run this class after compiling the project to obtain a hash for "password123".
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("password123");
        System.out.println(hash);
    }
}
