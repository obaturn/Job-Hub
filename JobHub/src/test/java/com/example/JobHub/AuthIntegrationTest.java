package com.example.JobHub;

import com.example.JobHub.auth.dto.*;
import com.example.JobHub.auth.entity.*;
import com.example.JobHub.auth.repository.*;
import com.example.JobHub.auth.service.AuthService;
import com.example.JobHub.auth.service.impl.JwtTokenProvider;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private RegisterRequest createRegisterRequest(String email, String password) {
        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    private LoginRequest createLoginRequest(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    private void registerUser(String email, String password) {
        authService.register(createRegisterRequest(email, password));
    }

    private void verifyEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        assertThat(user).isNotNull();
        String token = emailVerificationTokenRepository.findByUser_Id(user.getId()).stream()
                .findFirst()
                .orElseThrow(() -> new AssertionError("No verification token found"))
                .getToken();

        VerifyEmailRequest verifyRequest = new VerifyEmailRequest();
        verifyRequest.setToken(token);
        authService.verifyEmail(verifyRequest);
    }

    private void forgotPassword(String email) {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail(email);
        authService.forgotPassword(request);
    }

    @Test
    @Order(1)
    void register_ShouldCreateUserWithHashedPassword() {
        authService.register(createRegisterRequest("register@example.com", "Password123!"));

        Optional<User> userOpt = userRepository.findByEmail("register@example.com");
        assertThat(userOpt).isPresent();
        User user = userOpt.get();
        assertThat(user.isEmailVerified()).isFalse();
        assertThat(passwordEncoder.matches("Password123!", user.getPassword())).isTrue();
    }

    @Test
    @Order(2)
    void register_ShouldFailForDuplicateEmail() {
        registerUser("dup@example.com", "Password123!");

        assertThatThrownBy(() -> authService.register(createRegisterRequest("dup@example.com", "Password123!")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email is already registered");
    }

    @Test
    @Order(3)
    void login_ShouldFailForUnverifiedEmail() {
        registerUser("unverified@example.com", "Password123!");

        assertThatThrownBy(() -> authService.login(createLoginRequest("unverified@example.com", "Password123!")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Email address is not verified");
    }

    @Test
    @Order(4)
    void login_ShouldFailForInvalidPassword() {
        registerUser("badpwd@example.com", "Password123!");
        verifyEmail("badpwd@example.com");

        assertThatThrownBy(() -> authService.login(createLoginRequest("badpwd@example.com", "WrongPassword1!")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid credentials");
    }

    @Test
    @Order(5)
    void verifyEmail_ShouldActivateUserAccount() {
        registerUser("verify@example.com", "Password123!");

        User userBefore = userRepository.findByEmail("verify@example.com").orElse(null);
        assertThat(userBefore).isNotNull();
        assertThat(userBefore.isEmailVerified()).isFalse();

        verifyEmail("verify@example.com");

        User userAfter = userRepository.findByEmail("verify@example.com").orElse(null);
        assertThat(userAfter).isNotNull();
        assertThat(userAfter.isEmailVerified()).isTrue();
    }

    @Test
    @Order(6)
    void verifyEmail_ShouldFailForInvalidToken() {
        assertThatThrownBy(() -> {
            VerifyEmailRequest request = new VerifyEmailRequest();
            request.setToken("invalid-token");
            authService.verifyEmail(request);
        }).isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Invalid verification token");
    }

    @Test
    @Order(7)
    void login_ShouldSucceedForVerifiedUser() {
        registerUser("loginsuccess@example.com", "Password123!");
        verifyEmail("loginsuccess@example.com");

        AuthResponse response = authService.login(createLoginRequest("loginsuccess@example.com", "Password123!"));

        assertThat(response.getAccessToken()).isNotNull();
        assertThat(response.getRefreshToken()).isNotNull();
        assertThat(response.getUserId()).isNotNull();
    }

    @Test
    @Order(8)
    void forgotPassword_ShouldNotRevealUserExistence() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("nonexistent@example.com");

        authService.forgotPassword(request);
    }

    @Test
    @Order(9)
    void forgotPassword_ShouldCreateResetTokenForExistingUser() {
        registerUser("resetpass@example.com", "Password123!");

        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("resetpass@example.com");

        authService.forgotPassword(request);

        User user = userRepository.findByEmail("resetpass@example.com").orElse(null);
        assertThat(user).isNotNull();
        assertThat(passwordResetTokenRepository.findByUser_Id(user.getId())).isNotEmpty();
    }

    @Test
    @Order(10)
    void resetPassword_ShouldUpdatePassword() {
        registerUser("resetcomplete@example.com", "Password123!");
        forgotPassword("resetcomplete@example.com");

        User user = userRepository.findByEmail("resetcomplete@example.com").orElse(null);
        String token = passwordResetTokenRepository.findByUser_Id(user.getId()).stream()
                .findFirst()
                .orElseThrow(() -> new AssertionError("No reset token found"))
                .getToken();

        ResetPasswordRequest resetRequest = new ResetPasswordRequest();
        resetRequest.setToken(token);
        resetRequest.setNewPassword("NewPassword456!");

        authService.resetPassword(resetRequest);

        User updatedUser = userRepository.findByEmail("resetcomplete@example.com").orElse(null);
        assertThat(updatedUser).isNotNull();
        assertThat(passwordEncoder.matches("NewPassword456!", updatedUser.getPassword())).isTrue();
    }

    @Test
    @Order(11)
    void resetPassword_ShouldFailForInvalidToken() {
        ResetPasswordRequest resetRequest = new ResetPasswordRequest();
        resetRequest.setToken("invalid-token");
        resetRequest.setNewPassword("NewPassword456!");

        assertThatThrownBy(() -> authService.resetPassword(resetRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid reset token");
    }

    @Test
    @Order(12)
    void logout_ShouldRevokeRefreshToken() {
        registerUser("logout@example.com", "Password123!");
        verifyEmail("logout@example.com");

        AuthResponse loginResponse = authService.login(createLoginRequest("logout@example.com", "Password123!"));
        String refreshToken = loginResponse.getRefreshToken();

        RefreshTokenRequest logoutRequest = new RefreshTokenRequest();
        logoutRequest.setRefreshToken(refreshToken);
        authService.logout(refreshToken);

        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken).orElse(null);
        assertThat(storedToken).isNotNull();
        assertThat(storedToken.isRevoked()).isTrue();
    }

    @Test
    @Order(13)
    void refreshToken_ShouldIssueNewTokens() {
        registerUser("refresh@example.com", "Password123!");
        verifyEmail("refresh@example.com");

        AuthResponse loginResponse = authService.login(createLoginRequest("refresh@example.com", "Password123!"));
        String refreshToken = loginResponse.getRefreshToken();

        RefreshTokenRequest refreshReq = new RefreshTokenRequest();
        refreshReq.setRefreshToken(refreshToken);

        AuthResponse refreshResponse = authService.refreshToken(refreshReq);

        assertThat(refreshResponse.getAccessToken()).isNotNull();
        assertThat(refreshResponse.getRefreshToken()).isNotNull();
        assertThat(refreshResponse.getUserId()).isEqualTo(loginResponse.getUserId());
    }

    @Test
    @Order(14)
    void refreshToken_ShouldFailForRevokedToken() {
        registerUser("revoked@example.com", "Password123!");
        verifyEmail("revoked@example.com");

        AuthResponse loginResponse = authService.login(createLoginRequest("revoked@example.com", "Password123!"));
        String refreshToken = loginResponse.getRefreshToken();

        RefreshTokenRequest logoutReq = new RefreshTokenRequest();
        logoutReq.setRefreshToken(refreshToken);
        authService.logout(refreshToken);

        RefreshTokenRequest refreshReq = new RefreshTokenRequest();
        refreshReq.setRefreshToken(refreshToken);

        assertThatThrownBy(() -> authService.refreshToken(refreshReq))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @Order(15)
    void jwtTokenProvider_ShouldCreateAndParseTokens() {
        Long userId = 99L;
        String email = "jwt-test@example.com";

        String accessToken = jwtTokenProvider.createAccessToken(userId, email, 15);
        assertThat(accessToken).isNotNull();

        var claims = jwtTokenProvider.parseClaims(accessToken);
        assertThat(claims.getSubject()).isEqualTo(String.valueOf(userId));
        assertThat(claims.get("email", String.class)).isEqualTo(email);
    }

    @Test
    @Order(16)
    void register_ShouldPersistFirstAndLastName() {
        RegisterRequest request = createRegisterRequest("names@example.com", "Password123!");
        request.setFirstName("Amara");
        request.setLastName("Okafor");

        authService.register(request);

        User user = userRepository.findByEmail("names@example.com").orElse(null);
        assertThat(user).isNotNull();
        assertThat(user.getFirstName()).isEqualTo("Amara");
        assertThat(user.getLastName()).isEqualTo("Okafor");
    }

    @Test
    @Order(17)
    void resendVerification_ShouldInvalidatePreviousTokens() {
        registerUser("resend@example.com", "Password123!");
        User user = userRepository.findByEmail("resend@example.com").orElseThrow();
        String oldToken = emailVerificationTokenRepository.findByUser_Id(user.getId()).get(0).getToken();

        ResendVerificationRequest request = new ResendVerificationRequest();
        request.setEmail("resend@example.com");
        authService.resendVerification(request);

        EmailVerificationToken oldTokenEntity = emailVerificationTokenRepository.findByToken(oldToken).orElseThrow();
        assertThat(oldTokenEntity.isUsed()).isTrue();
        assertThat(emailVerificationTokenRepository.findByUser_Id(user.getId()))
                .anyMatch(token -> !token.isUsed());
    }

    @Test
    @Order(18)
    void login_ShouldRespectRememberMeRefreshDuration() {
        registerUser("remember@example.com", "Password123!");
        verifyEmail("remember@example.com");

        LoginRequest shortSession = createLoginRequest("remember@example.com", "Password123!");
        shortSession.setRememberMe(false);
        AuthResponse shortResponse = authService.login(shortSession);
        RefreshToken shortToken = refreshTokenRepository.findByToken(shortResponse.getRefreshToken()).orElseThrow();
        assertThat(shortToken.isRememberMe()).isFalse();
        assertThat(shortToken.getExpiresAt()).isAfter(java.time.LocalDateTime.now().plusHours(23));

        LoginRequest longSession = createLoginRequest("remember@example.com", "Password123!");
        longSession.setRememberMe(true);
        AuthResponse longResponse = authService.login(longSession);
        RefreshToken longToken = refreshTokenRepository.findByToken(longResponse.getRefreshToken()).orElseThrow();
        assertThat(longToken.isRememberMe()).isTrue();
        assertThat(longToken.getExpiresAt()).isAfter(java.time.LocalDateTime.now().plusDays(29));
    }
}