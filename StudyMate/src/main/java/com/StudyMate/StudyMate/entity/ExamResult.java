package com.StudyMate.StudyMate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exam_results")
public class ExamResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tổng điểm quy đổi (VD: 850)
    private Integer score;

    // Điểm thành phần
    @Column(name = "listening_score")
    private Integer listeningScore;

    @Column(name = "reading_score")
    private Integer readingScore;

    @Column(name = "correct_count")
    private Integer correctCount; // Số câu đúng (VD: 180/200)

    @Column(name = "submit_time")
    private Instant submitTime; // Thời điểm nộp bài

    @Column(name = "time_taken")
    private Integer timeTaken; // Thời gian làm bài thực tế (giây)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Giả sử bạn đã có Entity User

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @OneToMany(mappedBy = "examResult", cascade = CascadeType.ALL)
    private List<ExamResultDetail> details;
}
