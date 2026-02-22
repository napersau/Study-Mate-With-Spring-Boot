package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.config.VnpayConfig;
import com.StudyMate.StudyMate.dto.PaymentDTO;
import com.StudyMate.StudyMate.entity.Course;
import com.StudyMate.StudyMate.entity.Order;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.repository.CourseRepository;
import com.StudyMate.StudyMate.repository.OrderRepository;
import com.StudyMate.StudyMate.service.PaymentService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import com.StudyMate.StudyMate.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    private final VnpayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final CourseRepository courseRepository;
    private final SecurityUtil securityUtil;

    @Override
    public PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request, Long courseId, String platform) {


        // 1. Lấy thông tin User và Khóa học
        User currentUser = securityUtil.getCurrentUser();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        // 2. TẠO ĐƠN HÀNG (TRẠNG THÁI PENDING) LƯU VÀO DATABASE
        String vnpTxnRef = VNPayUtil.getRandomNumber(8); // Tạo mã giao dịch ngẫu nhiên

        Order pendingOrder = Order.builder()
                .user(currentUser)
                .course(course)
                .vnpTxnRef(vnpTxnRef) // Gắn mã này vào Order
                .amount(course.getPrice())
                .status("PENDING") // CHƯA THANH TOÁN
                .createdDate(Instant.now())
                .build();
        orderRepository.save(pendingOrder); // Lưu xuống DB ngay lập tức!

        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        String ipAddress = VNPayUtil.getIpAddress(request); // Chuyển đổi IPv6 của localhost thành IPv4 chuẩn
        if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }
        vnpParamsMap.put("vnp_IpAddr", ipAddress);
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        log.info("=== VNPay Debug ===");
        log.info("HashData: {}", hashData);
        log.info("SecretKey length: {}", vnPayConfig.getSecretKey().length());
        log.info("SecureHash: {}", vnpSecureHash);
        log.info("PaymentURL: {}", paymentUrl);

        return PaymentDTO.VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }
}
