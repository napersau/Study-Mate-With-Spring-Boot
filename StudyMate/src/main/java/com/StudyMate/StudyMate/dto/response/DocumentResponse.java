package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.enums.DocCategory;
import lombok.Data;

import java.time.Instant;

@Data
public class DocumentResponse {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String thumbnail;
    private String content;
    private DocCategory category;
    private boolean isPublished;
    private int viewCount;
    private Instant createdAt;
    private Instant updatedAt;
}
