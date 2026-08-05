package com.example.JobHub.email.service;

public interface EmailService {

    void sendVerificationEmail(String to, String userName, String verificationToken);

    void sendPasswordResetEmail(String to, String userName, String resetToken);

    void sendPasswordChangedEmail(String to, String userName);
}