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
@Table(name = "enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Học viên

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course; // Khóa học

    @Column(name = "enroll_date")
    private Instant enrollDate; // Ngày đăng ký

    @Column(name = "progress")
    private Double progress; // Tiến độ học (VD: 50.5%)

    @Column(name = "is_completed")
    private boolean isCompleted; // Đã học xong chưa?
}