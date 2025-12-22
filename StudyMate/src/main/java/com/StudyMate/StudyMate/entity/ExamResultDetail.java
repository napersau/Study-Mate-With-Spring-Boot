package com.StudyMate.StudyMate.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exam_result_details")
public class ExamResultDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "selected_option", length = 1)
    private String selectedOption; // User chọn gì: A, B, C, D (hoặc null nếu bỏ qua)

    @Column(name = "is_correct")
    private boolean isCorrect; // Đúng hay sai

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id")
    private ExamResult examResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
}
