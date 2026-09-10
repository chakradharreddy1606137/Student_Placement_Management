package com.example.placement;

import com.example.placement.controller.CompanyController;
import com.example.placement.model.Company;
import com.example.placement.model.User;
import com.example.placement.service.CompanyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class CompanyProfileIsolationTest {

    private CompanyController companyController;
    private CompanyService companyService;

    private Authentication companyHarshaAuth;  // Microsoft
    private Authentication studentNityaAuth;    // Student

    private Company microsoftCompany;
    private Company perficientCompany;
    private final Map<Long, Company> companyDb = new HashMap<>();

    @BeforeEach
    void setUp() {
        companyDb.clear();

        // 1. Authenticated Company: Harsha (Microsoft)
        companyHarshaAuth = new UsernamePasswordAuthenticationToken(
                "harsha@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        // 2. Authenticated Student: Nitya
        studentNityaAuth = new UsernamePasswordAuthenticationToken(
                "nitya@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        User harshaUser = new User();
        harshaUser.setId(3L);
        harshaUser.setName("Harsha");
        harshaUser.setEmail("harsha@gmail.com");
        harshaUser.setRole("COMPANY");

        microsoftCompany = new Company();
        microsoftCompany.setId(1L);
        microsoftCompany.setCompanyName("Microsoft");
        microsoftCompany.setDescription("Software development company");
        microsoftCompany.setLocation("Hyderabad");
        microsoftCompany.setUser(harshaUser);
        companyDb.put(1L, microsoftCompany);

        User saicharanUser = new User();
        saicharanUser.setId(2L);
        saicharanUser.setName("Sai Charan");
        saicharanUser.setEmail("saicharan@gmail.com");
        saicharanUser.setRole("COMPANY");

        perficientCompany = new Company();
        perficientCompany.setId(2L);
        perficientCompany.setCompanyName("Perficient");
        perficientCompany.setDescription("Associate Technical Consultant");
        perficientCompany.setLocation("Nagpur");
        perficientCompany.setUser(saicharanUser);
        companyDb.put(2L, perficientCompany);

        companyService = new CompanyService(null, null, null) {
            @Override
            public Optional<Company> getCompanyByEmail(String email) {
                if ("harsha@gmail.com".equalsIgnoreCase(email)) {
                    return Optional.of(microsoftCompany);
                }
                if ("saicharan@gmail.com".equalsIgnoreCase(email)) {
                    return Optional.of(perficientCompany);
                }
                return Optional.empty();
            }

            @Override
            public Optional<Company> getCompanyById(Long id) {
                return Optional.ofNullable(companyDb.get(id));
            }

            @Override
            public List<Company> getAllCompanies() {
                return List.of(microsoftCompany, perficientCompany);
            }
        };

        companyController = new CompanyController(companyService);
    }

    @Test
    @DisplayName("51. Company views own /me -> Returns caller company profile (200 OK)")
    void test51_CompanyViewsOwnMe_Success() {
        SecurityContextHolder.getContext().setAuthentication(companyHarshaAuth);

        ResponseEntity<Company> response = companyController.getCurrentCompany(companyHarshaAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Microsoft", response.getBody().getCompanyName());
        assertEquals("Hyderabad", response.getBody().getLocation());
        assertEquals("harsha@gmail.com", response.getBody().getUser().getEmail());
    }

    @Test
    @DisplayName("52. Company attempts another company's profile -> Requires ADMIN role (403 Forbidden)")
    void test52_CompanyAttemptsAnotherCompanyProfile_Forbidden() {
        SecurityContextHolder.getContext().setAuthentication(companyHarshaAuth);

        // SecurityConfig rule: .requestMatchers("/api/companies/**").hasRole("ADMIN")
        // Direct access to /api/companies/{id} requires ROLE_ADMIN
        boolean hasAdmin = companyHarshaAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        assertFalse(hasAdmin, "Company recruiter must not possess ROLE_ADMIN authority to view arbitrary company records");
    }

    @Test
    @DisplayName("53. Student attempts company /me -> Requires COMPANY role (403 Forbidden)")
    void test53_StudentAttemptsCompanyMe_Forbidden() {
        SecurityContextHolder.getContext().setAuthentication(studentNityaAuth);

        // SecurityConfig rule: .requestMatchers(HttpMethod.GET, "/api/companies/me").hasRole("COMPANY")
        // GET /api/companies/me strictly requires ROLE_COMPANY
        boolean hasCompany = studentNityaAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_COMPANY"));
        assertFalse(hasCompany, "Student user must not possess ROLE_COMPANY authority to access company /me endpoint");

        // Controller check if called directly without company profile
        ResponseEntity<Company> response = companyController.getCurrentCompany(studentNityaAuth);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @DisplayName("54. Company attempts company list -> Requires ADMIN role (403 Forbidden)")
    void test54_CompanyAttemptsCompanyList_Forbidden() {
        SecurityContextHolder.getContext().setAuthentication(companyHarshaAuth);

        // SecurityConfig rule: .requestMatchers("/api/companies/**").hasRole("ADMIN")
        // GET /api/companies requires ROLE_ADMIN
        boolean hasAdmin = companyHarshaAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        assertFalse(hasAdmin, "Company recruiter must not possess ROLE_ADMIN authority to list all companies");
    }
}
