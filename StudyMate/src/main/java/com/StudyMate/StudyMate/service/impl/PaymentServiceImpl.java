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
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final VnpayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final CourseRepository courseRepository;
    private final SecurityUtil securityUtil;

    public PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request) {

        // 1. Lấy thông tin User và Khóa học
        User currentUser = securityUtil.getCurrentUser();
        Long courseId = Long.parseLong(request.getParameter("courseId"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        // ==========================================
        // SỰ THAY ĐỔI QUAN TRỌNG NHẤT Ở ĐÂY:
        // Tự tạo mã giao dịch ngẫu nhiên ở Backend
        // ==========================================
        String generatedTxnRef = VNPayUtil.getRandomNumber(8);

        // 2. TẠO ĐƠN HÀNG VỚI MÃ VỪA TẠO
        Order pendingOrder = Order.builder()
                .user(currentUser)
                .course(course)
                .vnpTxnRef(generatedTxnRef) // Dùng mã Backend tự tạo, KHÔNG LẤY TỪ REQUEST
                .amount(course.getPrice())
                .status("PENDING")
                .createdDate(Instant.now())
                .build();
        orderRepository.save(pendingOrder);

        // 3. LẤY CẤU HÌNH VNPAY
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();

        // ==========================================
        // GHI ĐÈ 2 THAM SỐ QUAN TRỌNG ĐỂ KHỚP VỚI DATABASE
        // ==========================================
        // Ghi đè mã giao dịch để VNPay nhận đúng mã vừa lưu DB
        vnpParamsMap.put("vnp_TxnRef", generatedTxnRef);

        // Bảo mật: Lấy giá tiền từ Database, nhân 100L. TUYỆT ĐỐI KHÔNG lấy từ request
        long amountInVnd = (long) (course.getPrice() * 100L);
        vnpParamsMap.put("vnp_Amount", String.valueOf(amountInVnd));

        // 4. Các tham số khác
        String bankCode = request.getParameter("bankCode");
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", "127.0.0.1"); // Fix IP như hướng dẫn trước đó

        // Build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        return PaymentDTO.VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }
}
