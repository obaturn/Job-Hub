package com.example.JobHub.auth.service;

import com.example.JobHub.auth.dto.*;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void logout(String refreshToken);

    void verifyEmail(VerifyEmailRequest request);

    void resendVerification(ResendVerificationRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}
