package com.tushar.online.config;

import com.tushar.online.service.impl.CustomUserDetailsService;
import com.tushar.online.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String username = null;
        String token = null; // Removed the confusing 'jwt' variable!

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Trim removes accidental spaces
            token = authHeader.substring(7).trim();

            // If the token is empty or the literal string "undefined", ignore it
            if (!token.isEmpty() && !token.equals("undefined") && !token.equals("null")) {
                try {
                    username = jwtUtil.extractUsername(token);
                } catch (Exception e) {
                    System.out.println("Invalid or empty JWT token: " + e.getMessage());
                    token = null; // Set to null so it doesn't try to validate it later
                }
            } else {
                token = null;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // CHANGED 'jwt' to 'token' HERE! Added a null check too.
            if (token != null && jwtUtil.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}