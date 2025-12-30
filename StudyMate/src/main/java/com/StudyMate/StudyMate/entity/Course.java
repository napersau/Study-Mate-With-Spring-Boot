package com.StudyMate.StudyMate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // Tên khóa học

    @Column(length = 1000)
    private String description; // Mô tả ngắn

    @Column(columnDefinition = "TEXT")
    private String content; // Giới thiệu chi tiết (HTML)

    @Column(name = "prices")
    private Double price; // Giá tiền (0 nếu miễn phí)

    @Column(name = "image_url")
    private String imageUrl; // Ảnh bìa khóa học

    private String level; // Trình độ (Beginner, Intermediate...)

    @Column(name = "total_students")
    private Integer totalStudents = 0; // Đếm số người học

    private Double rating; // Đánh giá trung bình (4.5 sao)

    private Boolean isPublished; // True: Đang mở bán, False: Bản nháp

    // Quan hệ: 1 Khóa học có nhiều Chương
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Section> sections;
}
