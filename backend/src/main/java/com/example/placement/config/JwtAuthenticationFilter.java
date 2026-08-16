package com.example.placement.config;

import com.example.placement.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        logger.debug("JwtAuthenticationFilter: processing {} {}", request.getMethod(), request.getRequestURI());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No Authorization header present, proceeding without JWT");
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        logger.debug("Authorization header found, token extracted");

        if (jwtService.isTokenValid(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.debug("JWT token is valid");
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);

            if (role != null) {
                // Prepend ROLE_ if not already present for standard Spring Security authority conventions
                String authorityRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority(authorityRole)
                );
                logger.debug("Setting authentication for email {} with role {}", email, authorityRole);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        authorities
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } else {
            logger.warn("Invalid JWT token or authentication already set");
        }

        logger.debug("JwtAuthenticationFilter: proceeding with filter chain");
        filterChain.doFilter(request, response);
        logger.debug("JwtAuthenticationFilter: completed processing request");
    }
}
