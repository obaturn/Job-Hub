package com.example.JobHub.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private boolean rememberMe;

    public AuthResponse(String accessToken, String refreshToken, Long userId, String email) {
        this(accessToken, refreshToken, userId, email, null, null, false);
    }

    public AuthResponse(
            String accessToken,
            String refreshToken,
            Long userId,
            String email,
            String firstName,
            String lastName,
            boolean rememberMe) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.rememberMe = rememberMe;
    }
}
