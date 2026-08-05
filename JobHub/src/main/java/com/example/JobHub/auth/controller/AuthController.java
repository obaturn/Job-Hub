package com.example.JobHub.auth.controller;

import com.example.JobHub.auth.dto.*;
import com.example.JobHub.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Validated @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Validated @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Validated @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@Validated @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@Validated @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Validated @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Validated @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.noContent().build();
    }
}
