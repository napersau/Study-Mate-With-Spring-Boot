package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.entity.Media;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class DecksResponse {
    private Long id;
    private String title;
    private String description;
    private Boolean isPublic;
    private Integer totalFlashcards;
    private Instant createdAt;
    private Instant updatedAt;
    private List<FlashcardsResponse> flashcardsList;
    private List<MediaResponse> mediaList;
}
