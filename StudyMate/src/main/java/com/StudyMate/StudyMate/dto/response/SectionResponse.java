package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.entity.Course;
import lombok.Data;

import java.util.List;

@Data
public class SectionResponse {
    private Long id;
    private String title;
    private Integer orderIndex;
    private Course course;
    private List<LessonResponse> lessons;
}
