package com.StudyMate.StudyMate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

// 1. Class đại diện cho object ngoài cùng của JSON (Một từ vựng)
@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Bỏ qua các field trong JSON mà ta không khai báo (như pos, phonetic...)
public class DictionaryEntry {

    private String word;

    // JSON là "phonetic_text" (snake_case) -> Java là phoneticText (camelCase)
    // Cần dùng @JsonProperty để map đúng tên
    @JsonProperty("phonetic_text")
    private String phoneticText;

    @JsonProperty("phonetic_am")
    private String phoneticAm; // Link audio

    @JsonProperty("phonetic_text_am")
    private String phoneticTextAm; // Phiên âm Mỹ

    private List<Sense> senses;
}
