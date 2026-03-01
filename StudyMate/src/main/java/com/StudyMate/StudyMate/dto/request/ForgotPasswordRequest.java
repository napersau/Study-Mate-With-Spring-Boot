package com.StudyMate.StudyMate.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @Email(message = "Email không hợp lệ")
    private String email;

    private String otp;

    private String newPassword;
}
