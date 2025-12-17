package com.StudyMate.StudyMate.dto.request;


import lombok.Data;

import java.time.Instant;


@Data
public class FlashcardsProgressRequest {
    private Long id;
    private Instant lastReviewedAt;
    private Instant nextReviewAt;
    private String status;
    private Integer boxNumber;
    private UserRequest user;
    private String judge;
    private int flashcardsId;
}
