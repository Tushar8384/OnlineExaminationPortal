package com.tushar.online.service.impl;

import com.tushar.online.dto.request.LoginRequest;
import com.tushar.online.dto.request.RegisterRequest;
import com.tushar.online.dto.response.AuthResponse;
import com.tushar.online.model.entity.User;
import com.tushar.online.model.enums.Role;
import com.tushar.online.repository.UserRepository;
import com.tushar.online.service.AuthService;
import com.tushar.online.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists with email: " + request.getEmail());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT); // Default role is Student

        userRepository.save(user);

        // Generate token immediately (optional, or force them to login)
        // For this example, we return a success message without a token
        return new AuthResponse(null, "User registered successfully!");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // This will authenticate using the CustomUserDetailsService we created earlier
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // If authentication passes, load user and generate token
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // We need to convert our User entity to Spring Security's UserDetails
        // A shortcut is to fetch it again via UserDetailsService or build it manually here.
        // Since JwtUtil just needs the username (email), we can use a helper or modify JwtUtil.
        // Let's keep it simple: We need a UserDetails object for JwtUtil.
        // Re-using the logic from CustomUserDetailsService:
        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.emptyList() // Roles are handled inside JwtUtil generation if needed
        );

        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, "Login successful");
    }
}