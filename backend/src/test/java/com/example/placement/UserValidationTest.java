package com.example.placement;

import com.example.placement.config.GlobalExceptionHandler;
import com.example.placement.dto.LoginRequest;
import com.example.placement.dto.LoginResponse;
import com.example.placement.model.User;
import com.example.placement.repository.UserRepository;
import com.example.placement.service.AuthService;
import com.example.placement.service.JwtService;
import com.example.placement.service.UserService;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.crypto.SecretKey;
import java.lang.reflect.Field;
import java.lang.reflect.Proxy;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class UserValidationTest {

    private UserService userService;
    private AuthService authService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private GlobalExceptionHandler exceptionHandler;

    private final Map<String, User> userDb = new HashMap<>();

    @BeforeEach
    void setUp() throws Exception {
        userDb.clear();
        exceptionHandler = new GlobalExceptionHandler();
        passwordEncoder = new BCryptPasswordEncoder();

        SecretKey secretKey = Keys.hmacShaKeyFor("StudentPlacementManagementJwtSecretKey2026SecureKey".getBytes(StandardCharsets.UTF_8));
        jwtService = new JwtService();
        Field keyField = JwtService.class.getDeclaredField("key");
        keyField.setAccessible(true);
        keyField.set(jwtService, secretKey);

        Field expField = JwtService.class.getDeclaredField("expirationTime");
        expField.setAccessible(true);
        expField.set(jwtService, 3600000L);

        userRepository = (UserRepository) Proxy.newProxyInstance(
                UserRepository.class.getClassLoader(),
                new Class<?>[]{UserRepository.class},
                (proxy, method, args) -> {
                    if ("findByEmail".equals(method.getName())) {
                        String email = (String) args[0];
                        return Optional.ofNullable(userDb.get(email.toLowerCase()));
                    }
                    if ("save".equals(method.getName())) {
                        User u = (User) args[0];
                        if (u.getId() == null) {
                            u.setId(userDb.size() + 1L);
                        }
                        userDb.put(u.getEmail().toLowerCase(), u);
                        return u;
                    }
                    return null;
                }
        );

        userService = new UserService(userRepository, null, null, null, null, passwordEncoder);
        authService = new AuthService(userRepository, passwordEncoder, jwtService);

        // Pre-seed an existing user
        User existingUser = new User();
        existingUser.setId(10L);
        existingUser.setName("Nitya");
        existingUser.setEmail("nitya@gmail.com");
        existingUser.setPassword(passwordEncoder.encode("nitya123"));
        existingUser.setRole("STUDENT");
        userDb.put("nitya@gmail.com", existingUser);
    }

    @Test
    @DisplayName("96. Create user with unique email -> Allowed (200 OK)")
    void test96_CreateUserWithUniqueEmail_Success() {
        User newUser = new User();
        newUser.setName("Kavya");
        newUser.setEmail("kavya@gmail.com");
        newUser.setPassword("kavya123");
        newUser.setRole("STUDENT");

        User saved = userService.saveUser(newUser);
        assertNotNull(saved);
        assertNotNull(saved.getId());
        assertEquals("kavya@gmail.com", saved.getEmail());
        assertTrue(saved.getPassword().startsWith("$2a$")); // Encrypted with BCrypt
    }

    @Test
    @DisplayName("97. Duplicate email -> throws IllegalArgumentException (400 Bad Request)")
    void test97_DuplicateEmail_Throws400() {
        User duplicate = new User();
        duplicate.setName("Duplicate Nitya");
        duplicate.setEmail("nitya@gmail.com"); // Already exists
        duplicate.setPassword("pass123");
        duplicate.setRole("STUDENT");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            userService.saveUser(duplicate);
        });
        assertTrue(ex.getMessage().contains("Email already exists"));

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("98. Empty email -> throws IllegalArgumentException (400 Bad Request)")
    void test98_EmptyEmail_Throws400() {
        User emptyEmailUser = new User();
        emptyEmailUser.setName("No Email");
        emptyEmailUser.setEmail("   ");
        emptyEmailUser.setPassword("pass123");
        emptyEmailUser.setRole("STUDENT");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            userService.saveUser(emptyEmailUser);
        });
        assertEquals("Email is required", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("99. Invalid email format -> throws IllegalArgumentException (400 Bad Request)")
    void test99_InvalidEmailFormat_Throws400() {
        User invalidEmailUser = new User();
        invalidEmailUser.setName("Bad Email");
        invalidEmailUser.setEmail("invalid-email-without-at");
        invalidEmailUser.setPassword("pass123");
        invalidEmailUser.setRole("STUDENT");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            userService.saveUser(invalidEmailUser);
        });
        assertTrue(ex.getMessage().contains("Invalid email format"));

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("100. Empty password -> throws IllegalArgumentException (400 Bad Request)")
    void test100_EmptyPassword_Throws400() {
        User emptyPassUser = new User();
        emptyPassUser.setName("No Pass");
        emptyPassUser.setEmail("nopass@gmail.com");
        emptyPassUser.setPassword("");
        emptyPassUser.setRole("STUDENT");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            userService.saveUser(emptyPassUser);
        });
        assertEquals("Password is required", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("101. Wrong password login -> throws RuntimeException (Mapped to 401)")
    void test101_WrongPasswordLogin_Fails() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nitya@gmail.com");
        req.setPassword("incorrectPassword");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            authService.login(req);
        });
        assertEquals("Invalid email or password", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleRuntimeException(ex);
        assertEquals(HttpStatus.UNAUTHORIZED, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("102. Correct password login -> 200 OK + JWT Token returned")
    void test102_CorrectPasswordLogin_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nitya@gmail.com");
        req.setPassword("nitya123");

        LoginResponse response = authService.login(req);
        assertNotNull(response);
        assertEquals("Login successful", response.getMessage());
        assertEquals("STUDENT", response.getRole());
        assertEquals("nitya@gmail.com", response.getEmail());
        assertNotNull(response.getToken());
        assertTrue(jwtService.isTokenValid(response.getToken()));
        assertEquals("nitya@gmail.com", jwtService.extractEmail(response.getToken()));
    }
}
