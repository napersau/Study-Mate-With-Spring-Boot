package com.StudyMate.StudyMate.dto.response;


import lombok.Data;

@Data
public class QuestionResponse {
    private Long id;
    private Integer questionNumber; // Số thứ tự câu (101, 102...)
    private String text; // Nội dung câu hỏi (VD: What is the man doing?)
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD; // Part 2 có thể để null
    private String correctAnswer; // Chỉ lưu "A", "B", "C", hoặc "D"
    private String explanation; // Giải thích đáp án chi tiết
}
