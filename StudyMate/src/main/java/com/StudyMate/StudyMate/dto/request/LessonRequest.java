package com.StudyMate.StudyMate.dto.request;

import lombok.Data;

@Data
public class LessonRequest {
    private String title;
    private Integer orderIndex;
    private boolean isFree;
    private String type; // VIDEO, DOCUMENT, FLASHCARD, EXAM

    // Các field tùy chọn (chỉ gửi 1 trong các cái này)
    private String videoUrl;
    private Integer duration; // giây
    private Long documentId;  // Nếu là bài đọc
    private Long deckId;      // Nếu là flashcard
    private Long examId;      // Nếu là bài kiểm tra
}
