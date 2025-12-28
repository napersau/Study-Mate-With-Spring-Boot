package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.entity.Exam;
import com.StudyMate.StudyMate.entity.ExamResultDetail;
import com.StudyMate.StudyMate.entity.User;

import java.time.Instant;
import java.util.List;

public class ExamResultResponse {
    private Long id;
    private Integer score;
    private Integer listeningScore;
    private Integer readingScore;
    private Integer correctCount; // Số câu đúng (VD: 180/200)
    private Instant submitTime; // Thời điểm nộp bài
    private Integer timeTaken; // Thời gian làm bài thực tế (giây)
    private User user; // Giả sử bạn đã có Entity User
    private Exam exam;
    private List<ExamResultDetail> details;
}
