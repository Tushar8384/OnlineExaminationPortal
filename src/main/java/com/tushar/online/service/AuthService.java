package com.tushar.online.service;


import com.tushar.online.dto.request.LoginRequest;
import com.tushar.online.dto.request.RegisterRequest;
import com.tushar.online.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}