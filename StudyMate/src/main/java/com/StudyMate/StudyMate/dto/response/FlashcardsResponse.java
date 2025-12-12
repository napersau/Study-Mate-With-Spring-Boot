package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.dto.request.MediaRequest;
import lombok.Data;

import java.util.List;

@Data
public class FlashcardsResponse {
    private Long id;
    private String term;
    private String definition;
    private String pronunciation;
    private String example;
    private List<MediaResponse> mediaList;
}
