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

    @Override
    public void run(String... args) throws Exception {
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
