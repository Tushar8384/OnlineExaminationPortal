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

        // If they send a role in the request, use it. Otherwise, default to STUDENT.
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            user.setRole(Role.ADMIN);
        } else {
            user.setRole(Role.STUDENT);
        }

        userRepository.save(user);

        // FIXED: Removed the trailing comma and added the role!
        return new AuthResponse(null, "User registered successfully!", user.getRole().name());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.emptyList()
        );

        String token = jwtUtil.generateToken(userDetails);

        // FIXED: Added user.getRole().name() as the third argument!
        return new AuthResponse(token, "Login successfully", user.getRole().name());
    }
}