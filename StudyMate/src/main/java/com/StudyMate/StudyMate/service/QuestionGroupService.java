package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.response.QuestionGroupResponse;

import java.util.List;

public interface QuestionGroupService {
    List<QuestionGroupResponse> getAllQuestionGroupsByTypeAndHasExamIsNull(String type);
}
