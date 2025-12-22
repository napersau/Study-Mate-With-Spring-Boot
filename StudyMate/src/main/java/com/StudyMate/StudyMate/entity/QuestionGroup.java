package com.StudyMate.StudyMate.entity;

import com.StudyMate.StudyMate.enums.PartType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "question_groups")
public class QuestionGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PartType type; // Loại phần thi (PART_1, PART_7...)

    @Column(columnDefinition = "TEXT")
    private String content; // Nội dung bài đọc (HTML) cho Part 6, 7

    @Column(name = "audio_url")
    private String audioUrl; // Link file nghe (Part 1,2,3,4)

    @Column(name = "image_url")
    private String imageUrl; // Link file ảnh (Part 1)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    // Quan hệ 1-N: Một bài đọc/nghe có nhiều câu hỏi nhỏ
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Question> questions;
}
