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
@Table(name = "exams")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // VD: ETS 2024 - Test 1

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_minutes")
    private Integer duration; // Thời gian tính bằng phút (VD: 120)

    @Column(name = "total_questions")
    private Integer totalQuestions; // Tổng số câu (VD: 200)

    // Quan hệ 1-N: Một đề thi có nhiều nhóm câu hỏi
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuestionGroup> questionGroups;
}