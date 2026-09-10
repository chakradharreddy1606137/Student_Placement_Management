package com.example.placement.config;

import com.example.placement.model.User;
import com.example.placement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Automatically detects any plain text passwords in the database (e.g. manually updated in MySQL)
 * and encodes them using BCrypt so login works seamlessly.
 */
@Component
public class PasswordAutoEncoderRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordAutoEncoderRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private static final java.util.Map<String, String[]> AUTHORITATIVE_USERS = java.util.Map.of(
        "chakri@gmail.com", new String[]{"Chakri (Admin)", "chakri123", "ADMIN"},
        "kcr1606137@gmail.com", new String[]{"Chakri (Admin)", "chakri123", "ADMIN"},
        "harsha@gmail.com", new String[]{"Harsha", "harsha123", "COMPANY"},
        "saicharan@gmail.com", new String[]{"Sai Charan", "saicharan123", "COMPANY"},
        "indra@gmail.com", new String[]{"Indra", "indra123", "COMPANY"},
        "rishitha@gmail.com", new String[]{"Rishitha", "rishitha123", "STUDENT"},
        "nitya@gmail.com", new String[]{"Nitya", "nitya123", "STUDENT"},
        "bhargav@gmail.com", new String[]{"Bhargav", "bhargav123", "STUDENT"},
        "srujan@gmail.com", new String[]{"Srujan", "srujan123", "STUDENT"},
        "anurag@gmail.com", new String[]{"Anurag", "anurag123", "STUDENT"}
    );

    @Override
    public void run(String... args) throws Exception {
        // 1. Ensure all 10 authoritative users exist and have valid BCrypt passwords matching their original credentials
        for (java.util.Map.Entry<String, String[]> entry : AUTHORITATIVE_USERS.entrySet()) {
            String email = entry.getKey();
            String name = entry.getValue()[0];
            String expectedPwd = entry.getValue()[1];
            String expectedRole = entry.getValue()[2];

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new User();
                user.setName(name);
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(expectedPwd));
                user.setRole(expectedRole);
                userRepository.save(user);
                System.out.println("[PasswordAutoEncoder] Seeded missing authoritative user: " + email);
            } else {
                boolean updated = false;
                if (user.getPassword() == null || !passwordEncoder.matches(expectedPwd, user.getPassword())) {
                    user.setPassword(passwordEncoder.encode(expectedPwd));
                    updated = true;
                }
                if (!expectedRole.equalsIgnoreCase(user.getRole())) {
                    user.setRole(expectedRole);
                    updated = true;
                }
                if (updated) {
                    userRepository.save(user);
                    System.out.println("[PasswordAutoEncoder] Successfully synced credentials for: " + email);
                }
            }
        }

        // 2. Encode any other plain text passwords
        List<User> users = userRepository.findAll();
        for (User user : users) {
            String pwd = user.getPassword();
            if (pwd != null && !isBcryptHashed(pwd)) {
                String encoded = passwordEncoder.encode(pwd);
                user.setPassword(encoded);
                userRepository.save(user);
                System.out.println("[PasswordAutoEncoder] Successfully BCrypt encoded password for: " + user.getEmail());
            }
        }
    }

    private boolean isBcryptHashed(String password) {
        return (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$")) 
                && password.length() == 60;
    }
}
