package com.StudyMate.StudyMate.dto.request;

import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.entity.Media;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class DecksRequest {
    private Long id;
    private String title;
    private String description;
    private Boolean isPublic;
    private Integer totalFlashcards;
    private Instant createdAt;
    private Instant updatedAt;
    private List<Flashcards> flashcardsList;
    private List<Media> mediaList;
}
