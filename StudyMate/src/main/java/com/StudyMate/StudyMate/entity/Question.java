package com.StudyMate.StudyMate.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_number")
    private Integer questionNumber; // Số thứ tự câu (101, 102...)

    @Column(columnDefinition = "TEXT")
    private String text; // Nội dung câu hỏi (VD: What is the man doing?)

    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_d")
    private String optionD; // Part 2 có thể để null

    @Column(name = "correct_answer", length = 1)
    private String correctAnswer; // Chỉ lưu "A", "B", "C", hoặc "D"

    @Column(columnDefinition = "TEXT")
    private String explanation; // Giải thích đáp án chi tiết

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private QuestionGroup group;
}
