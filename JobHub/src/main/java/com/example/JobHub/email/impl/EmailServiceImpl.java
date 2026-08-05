package com.example.JobHub.email.impl;

import com.example.JobHub.email.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationEmail(String to, String userName, String verificationToken) {
        String subject = "Verify your email address";
        String verificationLink = baseUrl + "/api/v1/auth/verify-email?token=" + verificationToken;
        String htmlContent = buildVerificationEmailHtml(userName, verificationLink);
        sendEmail(to, subject, htmlContent);
    }

    @Override
    public void sendPasswordResetEmail(String to, String userName, String resetToken) {
        String subject = "Reset your password";
        String resetLink = baseUrl + "/api/v1/auth/reset-password?token=" + resetToken;
        String htmlContent = buildPasswordResetEmailHtml(userName, resetLink);
        sendEmail(to, subject, htmlContent);
    }

    @Override
    public void sendPasswordChangedEmail(String to, String userName) {
        String subject = "Your password has been changed";
        String htmlContent = buildPasswordChangedEmailHtml(userName);
        sendEmail(to, subject, htmlContent);
    }

    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    private String buildVerificationEmailHtml(String userName, String verificationLink) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>"
                + "<h2 style='color: #333;'>Welcome, " + userName + "!</h2>"
                + "<p>Thank you for registering. Please verify your email address by clicking the button below:</p>"
                + "<a href='" + verificationLink + "' style='display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;'>Verify Email</a>"
                + "<p style='color: #888; margin-top: 20px;'>This verification link expires in 24 hours.</p>"
                + "</body>"
                + "</html>";
    }

    private String buildPasswordResetEmailHtml(String userName, String resetLink) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>"
                + "<h2 style='color: #333;'>Password Reset Request</h2>"
                + "<p>Hello " + userName + ",</p>"
                + "<p>We received a request to reset your password. Click the button below to reset it:</p>"
                + "<a href='" + resetLink + "' style='display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px;'>Reset Password</a>"
                + "<p style='color: #888; margin-top: 20px;'>This reset link expires in 2 hours. If you did not request this, you can ignore this email.</p>"
                + "</body>"
                + "</html>";
    }

    private String buildPasswordChangedEmailHtml(String userName) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>"
                + "<h2 style='color: #333;'>Password Changed</h2>"
                + "<p>Hello " + userName + ",</p>"
                + "<p>Your password has been successfully changed. If you did not make this change, please contact support immediately.</p>"
                + "</body>"
                + "</html>";
    }
}