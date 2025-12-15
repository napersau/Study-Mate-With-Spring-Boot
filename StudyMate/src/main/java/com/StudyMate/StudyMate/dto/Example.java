package com.StudyMate.StudyMate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Example {
    private String x; // Trong JSON của bạn, câu ví dụ nằm ở field tên là "x"
    private String cf; // Cụm từ đi kèm (nếu cần)
}
