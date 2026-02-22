package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.entity.Course;
import com.StudyMate.StudyMate.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.Instant;

@Data
public class OrderResponse {
    private Long id;
    private User user; // Ai mua?
    private Course course; // Mua khóa nào?
    private String vnpTxnRef; // Mã giao dịch gửi sang VNPay (bắt buộc để đối soát)
    private Double amount;
    private String status;
    private Instant createdDate;
    private Instant payDate;
}
