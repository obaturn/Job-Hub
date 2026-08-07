package com.example.JobHub.auth.controller;

import com.example.JobHub.auth.config.RefreshTokenCookieService;
import com.example.JobHub.auth.dto.*;
import com.example.JobHub.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenCookieService refreshTokenCookieService;

    public AuthController(AuthService authService, RefreshTokenCookieService refreshTokenCookieService) {
        this.authService = authService;
        this.refreshTokenCookieService = refreshTokenCookieService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Validated @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Validated @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        refreshTokenCookieService.write(response, authResponse.getRefreshToken(), authResponse.isRememberMe());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {
        String refreshToken = request != null && StringUtils.hasText(request.getRefreshToken())
                ? request.getRefreshToken()
                : refreshTokenCookieService.read(httpRequest);
        authService.logout(refreshToken);
        refreshTokenCookieService.clear(response);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@Validated @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerification(@Validated @RequestBody ResendVerificationRequest request) {
        authService.resendVerification(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {
        String refreshToken = request != null && StringUtils.hasText(request.getRefreshToken())
                ? request.getRefreshToken()
                : refreshTokenCookieService.read(httpRequest);

        RefreshTokenRequest resolvedRequest = new RefreshTokenRequest();
        resolvedRequest.setRefreshToken(refreshToken);
        AuthResponse authResponse = authService.refreshToken(resolvedRequest);
        refreshTokenCookieService.write(response, authResponse.getRefreshToken(), authResponse.isRememberMe());
        return ResponseEntity.ok(authResponse);
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
