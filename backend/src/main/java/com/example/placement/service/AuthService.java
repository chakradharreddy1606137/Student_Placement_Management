package com.example.placement.service;

import com.example.placement.dto.LoginRequest;
import com.example.placement.dto.LoginResponse;
import com.example.placement.model.User;
import com.example.placement.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        logger.debug("AuthService: login attempt for email {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("User not found for email {}", request.getEmail());
                    return new RuntimeException("Invalid email or password");
                });
        logger.debug("User found with ID {} and role {}", user.getId(), user.getRole());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Password mismatch for email {}", request.getEmail());
            throw new RuntimeException("Invalid email or password");
        }
        logger.debug("Password match successful for email {}", request.getEmail());

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        logger.debug("Generated JWT token for user ID {}", user.getId());

        return new LoginResponse(
                "Login successful",
                user.getRole(),
                user.getEmail(),
                user.getId(),
                token
        );
    }
}
