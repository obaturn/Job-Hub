package com.example.JobHub.email.impl;

import com.example.JobHub.email.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url:${app.base-url}}")
    private String frontendUrl;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationEmail(String to, String userName, String verificationToken) {
        String subject = "Welcome to JobHub — verify your email";
        String verificationLink = trimTrailingSlash(frontendUrl) + "/verification?token=" + encode(verificationToken);
        String htmlContent = buildVerificationEmailHtml(userName, verificationLink);
        sendEmail(to, subject, htmlContent);
    }

    @Override
    public void sendPasswordResetEmail(String to, String userName, String resetToken) {
        String subject = "Reset your JobHub password";
        String resetLink = trimTrailingSlash(frontendUrl) + "/reset-password?token=" + encode(resetToken);
        String htmlContent = buildPasswordResetEmailHtml(userName, resetLink);
        sendEmail(to, subject, htmlContent);
    }

    @Override
    public void sendPasswordChangedEmail(String to, String userName) {
        String subject = "Your JobHub password has been changed";
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
        String safeName = escapeHtml(userName);
        String safeLink = escapeHtml(verificationLink);
        return "<!DOCTYPE html>"
                + "<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>"
                + "<body style='margin:0;background:#f7f8f5;color:#050505;font-family:Arial,Helvetica,sans-serif;'>"
                + "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='background:#f7f8f5;padding:32px 16px;'>"
                + "<tr><td align='center'>"
                + "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='max-width:620px;border-collapse:separate;border-spacing:0;'>"
                + "<tr><td style='background:#042b19;padding:28px 32px;border-radius:16px 16px 0 0;'>"
                + "<span style='display:inline-block;width:30px;height:30px;line-height:30px;border-radius:50%;background:#ff5b0a;color:#ffffff;text-align:center;font-size:18px;font-weight:700;vertical-align:middle;'>↗</span>"
                + "<span style='color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.7px;vertical-align:middle;margin-left:8px;'>JobHub</span>"
                + "</td></tr>"
                + "<tr><td style='background:#ffffff;padding:42px 32px 36px;border:1px solid #e5e8e4;border-top:0;'>"
                + "<p style='margin:0 0 14px;color:#0b4d2d;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;'>Email verification</p>"
                + "<h1 style='margin:0 0 18px;color:#050505;font-size:32px;line-height:1.15;letter-spacing:-1px;'>Welcome, " + safeName + ".</h1>"
                + "<p style='margin:0;color:#5f6862;font-size:16px;line-height:1.65;'>Your JobHub account is ready. Confirm your email to activate your account and continue building a professional profile that makes your next career step clearer.</p>"
                + "<div style='margin:26px 0;padding:16px 18px;border-left:3px solid #ff5b0a;background:#fffaf6;color:#5f6862;font-size:14px;line-height:1.55;'>This is the first step toward turning your experience, skills, and direction into a professional identity people can trust.</div>"
                + "<a href='" + safeLink + "' style='display:inline-block;background:#ff5b0a;color:#ffffff;text-decoration:none;border-radius:10px;padding:15px 22px;font-size:15px;font-weight:700;'>Verify my email</a>"
                + "<p style='margin:24px 0 0;color:#98a39a;font-size:12px;line-height:1.6;'>This verification link expires in 24 hours and can only be used once.</p>"
                + "<p style='margin:18px 0 0;color:#5f6862;font-size:12px;line-height:1.6;'><strong>Can’t find it?</strong> Check your spam, junk, or Promotions folder, then search for ‘JobHub’.</p>"
                + "<p style='margin:18px 0 0;color:#98a39a;font-size:12px;line-height:1.6;'>If the button does not work, copy this link into your browser:<br><span style='word-break:break-all;color:#0b4d2d;'>" + safeLink + "</span></p>"
                + "<p style='margin:22px 0 0;color:#5f6862;font-size:13px;line-height:1.6;'>If you did not create a JobHub account, you can safely ignore this email.</p>"
                + "</td></tr>"
                + "<tr><td style='background:#022313;padding:22px 32px;border-radius:0 0 16px 16px;color:#92aa99;font-size:12px;line-height:1.6;'>JobHub · Your professional identity for every next step.</td></tr>"
                + "</table></td></tr></table></body></html>";
    }

    private String buildPasswordResetEmailHtml(String userName, String resetLink) {
        String safeName = escapeHtml(userName);
        String safeLink = escapeHtml(resetLink);
        return "<!DOCTYPE html>"
                + "<html><body style='font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f7f8f5;color:#050505;'>"
                + "<div style='background:#042b19;padding:24px;border-radius:14px 14px 0 0;'><span style='display:inline-block;width:28px;height:28px;line-height:28px;border-radius:50%;background:#ff5b0a;color:#ffffff;text-align:center;font-weight:700;'>↗</span><span style='color:#ffffff;font-size:21px;font-weight:700;margin-left:8px;'>JobHub</span></div>"
                + "<div style='background:#ffffff;border:1px solid #e5e8e4;border-top:0;padding:32px;'>"
                + "<p style='color:#0b4d2d;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;'>Account recovery</p>"
                + "<h2 style='color:#050505;'>Reset your password</h2>"
                + "<p style='color:#5f6862;line-height:1.6;'>Hello " + safeName + ", we received a request to reset your JobHub password.</p>"
                + "<a href='" + safeLink + "' style='display:inline-block;padding:13px 22px;background:#ff5b0a;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;'>Reset password</a>"
                + "<p style='color:#98a39a;font-size:12px;line-height:1.6;'>This link expires in 2 hours. If you did not request this, you can ignore this email.</p>"
                + "</div><div style='background:#022313;padding:18px 32px;border-radius:0 0 14px 14px;color:#92aa99;font-size:12px;'>JobHub · Your professional identity for every next step.</div>"
                + "</body></html>";
    }

    private String buildPasswordChangedEmailHtml(String userName) {
        return "<!DOCTYPE html>"
                + "<html><body style='font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f7f8f5;color:#050505;'>"
                + "<div style='background:#042b19;padding:24px;border-radius:14px 14px 0 0;'><span style='display:inline-block;width:28px;height:28px;line-height:28px;border-radius:50%;background:#ff5b0a;color:#ffffff;text-align:center;font-weight:700;'>↗</span><span style='color:#ffffff;font-size:21px;font-weight:700;margin-left:8px;'>JobHub</span></div>"
                + "<div style='background:#ffffff;border:1px solid #e5e8e4;border-top:0;padding:32px;'>"
                + "<p style='color:#0b4d2d;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;'>Security update</p>"
                + "<h2 style='color:#050505;'>Your password has been changed</h2>"
                + "<p style='color:#5f6862;line-height:1.6;'>Hello " + escapeHtml(userName) + ", your JobHub password has been successfully changed.</p>"
                + "<p style='color:#5f6862;line-height:1.6;'>If you did not make this change, please contact support immediately.</p>"
                + "</div><div style='background:#022313;padding:18px 32px;border-radius:0 0 14px 14px;color:#92aa99;font-size:12px;'>JobHub · Your professional identity for every next step.</div>"
                + "</body></html>";
    }

    private String trimTrailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
