package com.StudyMate.StudyMate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Ai mua?

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course; // Mua khóa nào?

    @Column(name = "vnp_txn_ref", unique = true)
    private String vnpTxnRef; // Mã giao dịch gửi sang VNPay (bắt buộc để đối soát)

    @Column(name = "amount", nullable = false)
    private Double amount; // Số tiền thanh toán

    // Trạng thái: PENDING (Đang chờ), PAID (Đã thanh toán), FAILED (Thất bại)
    @Column(nullable = false)
    private String status;

    @Column(name = "created_date")
    private Instant createdDate;

    @Column(name = "pay_date")
    private Instant payDate;
}