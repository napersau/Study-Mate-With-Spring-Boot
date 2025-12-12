package com.StudyMate.StudyMate.dto.request;
import com.StudyMate.StudyMate.dto.response.MediaResponse;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class FlashcardsRequest {
    private Long id;
    private String term;
    private String definition;
    private String pronunciation;
    private String example;
    private List<MediaRequest> mediaList;
}
