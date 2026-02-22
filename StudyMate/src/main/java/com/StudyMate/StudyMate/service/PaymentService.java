package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.PaymentDTO;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request, Long courseId, String platform);
}
