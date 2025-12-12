package com.StudyMate.StudyMate.dto.request;

import lombok.Data;

@Data
public class MediaRequest {
    private String url;
    private String type;
    private Long sourceId;
}
