package com.example.JobHub.auth.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key signingKey;

    public JwtTokenProvider(@Value("${jwt.secret}") String jwtSecret) {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String createAccessToken(Long userId, String email, long expiresInMinutes) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(expiresInMinutes * 60);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("email", email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiresAt))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
