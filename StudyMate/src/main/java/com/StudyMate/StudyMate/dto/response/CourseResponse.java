package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.entity.Section;
import lombok.Data;

import java.util.List;

@Data
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String content;
    private Double price;
    private String imageUrl;
    private String level;
    private Integer totalStudents = 0;
    private boolean isPublished;
    private List<SectionResponse> sections;
}
