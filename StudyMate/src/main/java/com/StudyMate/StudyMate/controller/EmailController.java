package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.request.ForgotPasswordRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailController {

    private final PasswordResetService passwordResetService;

    // API gửi OTP để reset password
    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.sendPasswordResetOtp(request);
            return ApiResponse.<String>builder()
                    .code(1000)
                    .message("OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.")
                    .result("OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .code(1000)
                    .message(e.getMessage())
                    .result("Lỗi khi gửi OTP: " + e.getMessage())
                    .build();
        }
    }

    // API verify OTP
    @PostMapping("/verify-otp")
    public ApiResponse<String> verifyOtp(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            boolean isValid = passwordResetService.verifyOtp(request);

            ApiResponse<String> response = new ApiResponse<>();
            if (isValid) {
                response.setResult("OTP hợp lệ. Bạn có thể đặt lại mật khẩu.");
            } else {
                response.setMessage("OTP không hợp lệ hoặc đã hết hạn");
                return ApiResponse.<String>builder()
                        .code(1000)
                        .message("OTP không hợp lệ hoặc đã hết hạn")
                        .result("OTP không hợp lệ hoặc đã hết hạn")
                        .build();
            }

            return ApiResponse.<String>builder()
                    .code(1000)
                    .message("OTP hợp lệ. Bạn có thể đặt lại mật khẩu.")
                    .result("OTP hợp lệ. Bạn có thể đặt lại mật khẩu.")
                    .build();
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>();
            response.setMessage(e.getMessage());
            return ApiResponse.<String>builder()
                    .code(1000)
                    .message(e.getMessage())
                    .result("Lỗi khi xác thực OTP: " + e.getMessage())
                    .build();
        }
    }

    // API reset password
    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request);

            ApiResponse<String> response = new ApiResponse<>();
            response.setResult("Mật khẩu đã được đặt lại thành công.");

            return ApiResponse.<String>builder()
                    .code(1000)
                    .message("Mật khẩu đã được đặt lại thành công.")
                    .result("Mật khẩu đã được đặt lại thành công.")
                    .build();
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>();
            response.setMessage(e.getMessage());
            return ApiResponse.<String>builder()
                    .code(1000)
                    .message(e.getMessage())
                    .result("Lỗi khi đặt lại mật khẩu: " + e.getMessage())
                    .build();
        }
    }
}
