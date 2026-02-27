package com.StudyMate.StudyMate.dto.request;

import com.StudyMate.StudyMate.dto.response.SectionResponse;
import lombok.Data;

import java.util.List;

@Data
public class CourseRequest {
    private String title;
    private String description;
    private Double price;
    private String level; // Beginner, Advanced...
    private List<SectionRequest> sections;
}
