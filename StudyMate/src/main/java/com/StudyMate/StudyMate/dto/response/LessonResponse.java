package com.StudyMate.StudyMate.dto.response;

import com.StudyMate.StudyMate.entity.Decks;
import com.StudyMate.StudyMate.entity.Document;
import com.StudyMate.StudyMate.entity.Exam;
import com.StudyMate.StudyMate.entity.Section;
import com.StudyMate.StudyMate.enums.LessonType;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class LessonResponse {
    private Long id;
    private String title;
    private Integer orderIndex;
    private boolean isFree;
    private LessonType type;
    private String videoUrl;
    private Integer duration;
    private Document document;
    private Decks deck;
    private Exam exam;
}
