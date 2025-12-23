package com.StudyMate.StudyMate.dto.response;


import com.StudyMate.StudyMate.enums.PartType;
import lombok.Data;
import java.util.List;

@Data
public class QuestionGroupResponse {
    private Long id;
    private PartType type; // Loại phần thi (PART_1, PART_7...)
    private String content; // Nội dung bài đọc (HTML) cho Part 6, 7
    private String audioUrl; // Link file nghe (Part 1,2,3,4)
    private String imageUrl; // Link file ảnh (Part 1)
    private List<QuestionResponse> questions;
}
