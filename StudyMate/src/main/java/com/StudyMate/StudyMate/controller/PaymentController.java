package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.PaymentDTO;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    @GetMapping("/vn-pay")
    public ApiResponse<PaymentDTO.VNPayResponse> pay(
            @RequestParam Long courseId, // BẮT BUỘC: Phải biết mua khóa học nào
            @RequestParam(defaultValue = "web") String platform, // Tùy chọn nền tảng
            HttpServletRequest request) {

        ApiResponse<PaymentDTO.VNPayResponse> apiResponse = new ApiResponse<>();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setMessage(HttpStatus.OK.getReasonPhrase());

        // Truyền courseId và platform xuống Service
        apiResponse.setResult(paymentService.createVnPayPayment(request, courseId, platform));
        return apiResponse;
    }


    @GetMapping("/vn-pay-callback")
    public ApiResponse<PaymentDTO.VNPayResponse> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        ApiResponse<PaymentDTO.VNPayResponse> apiResponse = new ApiResponse<>();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setMessage(HttpStatus.OK.getReasonPhrase());
        if (status.equals("00")) {
            apiResponse.setCode(HttpStatus.OK.value());
        } else {
            apiResponse.setCode(HttpStatus.BAD_REQUEST.value());
        }
        return apiResponse;
    }
}
