package com.example.placement;

import com.example.placement.dto.LoginRequest;
import com.example.placement.dto.LoginResponse;
import com.example.placement.model.User;
import com.example.placement.repository.UserRepository;
import com.example.placement.service.AuthService;
import com.example.placement.service.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.crypto.SecretKey;
import java.lang.reflect.Field;
import java.lang.reflect.Proxy;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class AuthAndJwtTest {

    private final Map<String, User> userDatabase = new HashMap<>();
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthService authService;

    private static final String SECRET_KEY_STRING = "StudentPlacementManagementJwtSecretKey2026SecureKey";
    private SecretKey secretKey;

    @BeforeEach
    void setUp() throws Exception {
        userDatabase.clear();
        passwordEncoder = new BCryptPasswordEncoder();
        secretKey = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));

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
                        return Optional.ofNullable(userDatabase.get(email));
                    }
                    if ("save".equals(method.getName())) {
                        User user = (User) args[0];
                        userDatabase.put(user.getEmail(), user);
                        return user;
                    }
                    return null;
                }
        );

        authService = new AuthService(userRepository, passwordEncoder, jwtService);

        // Seed all 10 authoritative users
        seedUser(1L, "Chakri", "chakri@gmail.com", "chakri123", "ADMIN");
        seedUser(10L, "Chakri (Admin)", "kcr1606137@gmail.com", "chakri123", "ADMIN");
        seedUser(2L, "Harsha", "harsha@gmail.com", "harsha123", "COMPANY");
        seedUser(3L, "Sai Charan", "saicharan@gmail.com", "saicharan123", "COMPANY");
        seedUser(4L, "Indra", "indra@gmail.com", "indra123", "COMPANY");
        seedUser(5L, "Rishitha", "rishitha@gmail.com", "rishitha123", "STUDENT");
        seedUser(6L, "Nitya", "nitya@gmail.com", "nitya123", "STUDENT");
        seedUser(7L, "Bhargav", "bhargav@gmail.com", "bhargav123", "STUDENT");
        seedUser(8L, "Srujan", "srujan@gmail.com", "srujan123", "STUDENT");
        seedUser(9L, "Anurag", "anurag@gmail.com", "anurag123", "STUDENT");
    }

    private void seedUser(Long id, String name, String email, String rawPwd, String role) {
        User u = new User();
        u.setId(id);
        u.setName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(rawPwd));
        u.setRole(role);
        userDatabase.put(email, u);
    }

    @Test
    @DisplayName("1. Login with correct student email/password -> 200 + JWT")
    void test1_LoginWithCorrectStudentEmailPassword() {

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
        assertEquals("STUDENT", jwtService.extractRole(response.getToken()));
    }

    @Test
    @DisplayName("2. Login with correct company credentials -> 200 + JWT")
    void test2_LoginWithCorrectCompanyCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("harsha@gmail.com");
        req.setPassword("harsha123");

        LoginResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("Login successful", response.getMessage());
        assertEquals("COMPANY", response.getRole());
        assertEquals("harsha@gmail.com", response.getEmail());
        assertNotNull(response.getToken());
        assertTrue(jwtService.isTokenValid(response.getToken()));
        assertEquals("harsha@gmail.com", jwtService.extractEmail(response.getToken()));
        assertEquals("COMPANY", jwtService.extractRole(response.getToken()));
    }

    @Test
    @DisplayName("3. Login with correct admin credentials -> 200 + JWT")
    void test3_LoginWithCorrectAdminCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("chakri@gmail.com");
        req.setPassword("chakri123");

        LoginResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("Login successful", response.getMessage());
        assertEquals("ADMIN", response.getRole());
        assertEquals("chakri@gmail.com", response.getEmail());
        assertNotNull(response.getToken());
        assertTrue(jwtService.isTokenValid(response.getToken()));
        assertEquals("chakri@gmail.com", jwtService.extractEmail(response.getToken()));
        assertEquals("ADMIN", jwtService.extractRole(response.getToken()));
    }

    @Test
    @DisplayName("3b. Login with second admin (kcr1606137@gmail.com) -> 200 + JWT")
    void test3b_LoginWithSecondAdminCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("kcr1606137@gmail.com");
        req.setPassword("chakri123");

        LoginResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("Login successful", response.getMessage());
        assertEquals("ADMIN", response.getRole());
        assertEquals("kcr1606137@gmail.com", response.getEmail());
        assertNotNull(response.getToken());
        assertTrue(jwtService.isTokenValid(response.getToken()));
        assertEquals("kcr1606137@gmail.com", jwtService.extractEmail(response.getToken()));
        assertEquals("ADMIN", jwtService.extractRole(response.getToken()));
    }

    @Test
    @DisplayName("4. Login with wrong password -> throws RuntimeException (Mapped to 401)")
    void test4_LoginWithWrongPassword() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nitya@gmail.com");
        req.setPassword("wrongPassword123");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(req));
        assertEquals("Invalid email or password", ex.getMessage());
    }

    @Test
    @DisplayName("5. Login with nonexistent email -> throws RuntimeException (Mapped to 401)")
    void test5_LoginWithNonexistentEmail() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nonexistent@gmail.com");
        req.setPassword("anyPassword123");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(req));
        assertEquals("Invalid email or password", ex.getMessage());
    }

    @Test
    @DisplayName("6. Login with empty email -> throws IllegalArgumentException (Mapped to 400)")
    void test6_LoginWithEmptyEmail() {
        LoginRequest req = new LoginRequest();
        req.setEmail("   ");
        req.setPassword("nitya123");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.login(req));
        assertEquals("Email is required", ex.getMessage());
    }

    @Test
    @DisplayName("7. Login with empty password -> throws IllegalArgumentException (Mapped to 400)")
    void test7_LoginWithEmptyPassword() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nitya@gmail.com");
        req.setPassword("");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.login(req));
        assertEquals("Password is required", ex.getMessage());
    }

    @Test
    @DisplayName("8. Request protected API without JWT -> isTokenValid is false (401/403)")
    void test8_RequestProtectedApiWithoutJwt() {
        assertFalse(jwtService.isTokenValid(null));
        assertFalse(jwtService.isTokenValid(""));
        assertFalse(jwtService.isTokenValid("   "));
    }

    @Test
    @DisplayName("9. Request with garbage JWT -> isTokenValid is false (401/403)")
    void test9_RequestWithGarbageJwt() {
        assertFalse(jwtService.isTokenValid("invalid.garbage.jwt.string"));
        assertFalse(jwtService.isTokenValid("Bearer 1234567890"));
    }

    @Test
    @DisplayName("10. Request with tampered JWT -> isTokenValid is false (401/403)")
    void test10_RequestWithTamperedJwt() {
        String validToken = jwtService.generateToken(10L, "nitya@gmail.com", "STUDENT");
        assertTrue(jwtService.isTokenValid(validToken));

        // Tamper signature / payload
        String[] parts = validToken.split("\\.");
        String tamperedToken = parts[0] + "." + parts[1] + "X" + "." + parts[2];
        assertFalse(jwtService.isTokenValid(tamperedToken));
    }

    @Test
    @DisplayName("11. Request with expired JWT -> isTokenValid is false (401/403)")
    void test11_RequestWithExpiredJwt() {
        String expiredToken = Jwts.builder()
                .subject("nitya@gmail.com")
                .claim("userId", 10L)
                .claim("role", "STUDENT")
                .issuedAt(new Date(System.currentTimeMillis() - 7200000))
                .expiration(new Date(System.currentTimeMillis() - 3600000))
                .signWith(secretKey)
                .compact();

        assertFalse(jwtService.isTokenValid(expiredToken));
    }

    @Test
    @DisplayName("12. Logout -> request without token -> null token is invalid (401/403)")
    void test12_LogoutThenRequestWithoutToken() {
        String clientTokenAfterLogout = null;
        assertFalse(jwtService.isTokenValid(clientTokenAfterLogout));
    }
}
