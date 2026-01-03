package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.dto.response.QuestionGroupResponse;
import com.StudyMate.StudyMate.entity.QuestionGroup;
import com.StudyMate.StudyMate.enums.PartType;
import com.StudyMate.StudyMate.repository.QuestionGroupRepository;
import com.StudyMate.StudyMate.service.QuestionGroupService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionGroupServiceImpl implements QuestionGroupService {

    private final QuestionGroupRepository questionGroupRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<QuestionGroupResponse> getAllQuestionGroupsByTypeAndHasExamIsNull(String type) {

        List<QuestionGroup> questionGroupList = questionGroupRepository.findByTypeAndExamIsNull(PartType.valueOf(type));

        return questionGroupList.stream()
                .map(questionGroup
                        -> modelMapper.map(questionGroup, QuestionGroupResponse.class)).toList();
    }
}
