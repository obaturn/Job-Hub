package com.example.JobHub.auth.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PropertyUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public String getJwtSecret() {
        return jwtSecret;
    }
}
