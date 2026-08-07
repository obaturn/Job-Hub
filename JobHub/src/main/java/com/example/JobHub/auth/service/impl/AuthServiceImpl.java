package com.example.JobHub.auth.service.impl;

import com.example.JobHub.auth.dto.*;
import com.example.JobHub.auth.entity.*;
import com.example.JobHub.auth.repository.*;
import com.example.JobHub.auth.service.AuthService;
import com.example.JobHub.email.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final long accessTokenExpirationMinutes;
    private final long refreshTokenExpirationDays;
    private final long shortRefreshTokenExpirationDays;

    public AuthServiceImpl(
            UserRepository userRepository,
            EmailVerificationTokenRepository emailVerificationTokenRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            EmailService emailService,
            @Value("${jwt.access-token-expiration-minutes}") long accessTokenExpirationMinutes,
            @Value("${jwt.refresh-token-expiration-days}") long refreshTokenExpirationDays,
            @Value("${jwt.short-refresh-token-expiration-days:1}") long shortRefreshTokenExpirationDays) {
        this.userRepository = userRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
        this.accessTokenExpirationMinutes = accessTokenExpirationMinutes;
        this.refreshTokenExpirationDays = refreshTokenExpirationDays;
        this.shortRefreshTokenExpirationDays = shortRefreshTokenExpirationDays;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setFirstName(normalizeName(request.getFirstName(), "JobHub"));
        user.setLastName(normalizeName(request.getLastName(), "Member"));
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user = userRepository.save(user);

        EmailVerificationToken token = createEmailVerificationToken(user);
        emailVerificationTokenRepository.save(token);
        emailService.sendVerificationEmail(user.getEmail(), displayName(user), token.getToken());

        return new AuthResponse(null, null, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), false);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!user.isEmailVerified()) {
            throw new IllegalStateException("Email address is not verified");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        boolean rememberMe = request.isRememberMe();
        String accessToken = jwtTokenProvider.createAccessToken(
                user.getId(), user.getEmail(), accessTokenExpirationMinutes);
        String refreshTokenValue = UUID.randomUUID().toString();
        RefreshToken refreshToken = createRefreshToken(user, refreshTokenValue, rememberMe);
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(
                accessToken,
                refreshTokenValue,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                rememberMe);
    }

    @Override
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }

        refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    public void verifyEmail(VerifyEmailRequest request) {
        EmailVerificationToken token = emailVerificationTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        if (token.isUsed() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification token is invalid or expired");
        }

        User user = token.getUser();
        user.setEmailVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        token.setUsed(true);
        emailVerificationTokenRepository.save(token);
    }

    @Override
    public void resendVerification(ResendVerificationRequest request) {
        userRepository.findByEmail(normalizeEmail(request.getEmail())).ifPresent(user -> {
            if (user.isEmailVerified()) {
                throw new IllegalStateException("Email address is already verified");
            }

            emailVerificationTokenRepository.findByUser_Id(user.getId()).forEach(existingToken -> {
                existingToken.setUsed(true);
                emailVerificationTokenRepository.save(existingToken);
            });

            EmailVerificationToken token = createEmailVerificationToken(user);
            emailVerificationTokenRepository.save(token);
            emailService.sendVerificationEmail(user.getEmail(), displayName(user), token.getToken());
        });
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (request == null || request.getRefreshToken() == null || request.getRefreshToken().isBlank()) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (token.isRevoked() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token is invalid or expired");
        }

        token.setRevoked(true);
        refreshTokenRepository.save(token);

        User user = token.getUser();
        String accessToken = jwtTokenProvider.createAccessToken(
                user.getId(), user.getEmail(), accessTokenExpirationMinutes);
        String nextRefreshTokenValue = UUID.randomUUID().toString();
        RefreshToken nextRefreshToken = createRefreshToken(user, nextRefreshTokenValue, token.isRememberMe());
        refreshTokenRepository.save(nextRefreshToken);

        return new AuthResponse(
                accessToken,
                nextRefreshTokenValue,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                token.isRememberMe());
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(normalizeEmail(request.getEmail())).ifPresent(user -> {
            PasswordResetToken resetToken = createPasswordResetToken(user);
            passwordResetTokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), displayName(user), resetToken.getToken());
        });
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token is invalid or expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordChangedEmail(user.getEmail(), displayName(user));
    }

    private EmailVerificationToken createEmailVerificationToken(User user) {
        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusHours(24));
        token.setUsed(false);
        return token;
    }

    private RefreshToken createRefreshToken(User user, String tokenValue, boolean rememberMe) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(tokenValue);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(
                rememberMe ? refreshTokenExpirationDays : shortRefreshTokenExpirationDays));
        refreshToken.setRevoked(false);
        refreshToken.setRememberMe(rememberMe);
        refreshToken.setCreatedAt(LocalDateTime.now());
        return refreshToken;
    }

    private PasswordResetToken createPasswordResetToken(User user) {
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(2));
        resetToken.setUsed(false);
        resetToken.setCreatedAt(LocalDateTime.now());
        return resetToken;
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String normalizeName(String name, String fallback) {
        return name == null || name.isBlank() ? fallback : name.trim();
    }

    private String displayName(User user) {
        return (user.getFirstName() + " " + user.getLastName()).trim();
    }
}
