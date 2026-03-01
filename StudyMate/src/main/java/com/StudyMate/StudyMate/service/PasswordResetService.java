package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.ForgotPasswordRequest;

public interface PasswordResetService {
    void sendPasswordResetOtp(ForgotPasswordRequest request);
    boolean verifyOtp(ForgotPasswordRequest request);
    void resetPassword(ForgotPasswordRequest request);
}
