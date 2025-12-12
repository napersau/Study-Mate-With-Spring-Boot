package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.request.UserRequest;
import lombok.Data;

import java.time.Instant;

@Data
public class FlashcardsProgressResponse {
    private Long id;
    private Instant lastReviewedAt;
    private Instant nextReviewAt;
    private String status;
    private Integer boxNumber;
    private UserRequest user;
    private FlashcardsRequest flashcard;
}
