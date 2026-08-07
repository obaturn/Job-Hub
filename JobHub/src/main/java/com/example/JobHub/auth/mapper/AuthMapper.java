package com.example.JobHub.auth.mapper;

import com.example.JobHub.auth.dto.AuthResponse;
import com.example.JobHub.auth.entity.User;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class AuthMapper {

    public static AuthResponse toAuthResponse(String accessToken, String refreshToken, User user) {
        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                false);
    }
}
