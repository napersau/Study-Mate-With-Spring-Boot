package com.StudyMate.StudyMate.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class SectionRequest {
    private Long id;
    private String title;
    private Integer orderIndex;
    private List<LessonRequest> lessons;
}
