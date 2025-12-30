package com.StudyMate.StudyMate.dto.request;

import com.StudyMate.StudyMate.entity.Exam;
import com.StudyMate.StudyMate.entity.User;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class ExamResultRequest {
    private Integer score;
    private Integer listeningScore;
    private Integer readingScore;
    private Integer correctCount; // Số câu đúng (VD: 180/200)
    private Instant submitTime; // Thời điểm nộp bài
    private Integer timeTaken; // Thời gian làm bài thực tế (giây)
    private Long examId; // ID của đề thi
    private List<ExamResultDetailRequest> examResultDetailRequestList;
}
