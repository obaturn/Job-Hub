package com.example.JobHub.auth.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class RefreshTokenCookieService {

    private final String cookieName;
    private final boolean secure;
    private final String sameSite;
    private final long shortExpirationDays;
    private final long longExpirationDays;

    public RefreshTokenCookieService(
            @Value("${app.refresh-cookie-name:jobhub_refresh_token}") String cookieName,
            @Value("${app.refresh-cookie-secure:false}") boolean secure,
            @Value("${app.cookie-same-site:Lax}") String sameSite,
            @Value("${jwt.short-refresh-token-expiration-days:1}") long shortExpirationDays,
            @Value("${jwt.refresh-token-expiration-days:30}") long longExpirationDays) {
        this.cookieName = cookieName;
        this.secure = secure;
        this.sameSite = sameSite;
        this.shortExpirationDays = shortExpirationDays;
        this.longExpirationDays = longExpirationDays;
    }

    public void write(HttpServletResponse response, String token, boolean rememberMe) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/api/v1/auth")
                .maxAge(Duration.ofDays(rememberMe ? longExpirationDays : shortExpirationDays))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public String read(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        for (Cookie cookie : request.getCookies()) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    public void clear(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/api/v1/auth")
                .maxAge(Duration.ZERO)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
