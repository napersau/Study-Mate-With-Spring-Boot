package com.StudyMate.StudyMate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Sense {
    private String definition;
    private List<Example> examples;
}
