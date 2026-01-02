package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.dto.request.ExamRequest;
import com.StudyMate.StudyMate.dto.response.ExamResponse;
import com.StudyMate.StudyMate.entity.Exam;
import com.StudyMate.StudyMate.entity.QuestionGroup;
import com.StudyMate.StudyMate.enums.ExamType;
import com.StudyMate.StudyMate.exception.AppException;
import com.StudyMate.StudyMate.exception.ErrorCode;
import com.StudyMate.StudyMate.repository.ExamRepository;
import com.StudyMate.StudyMate.repository.QuestionGroupRepository;
import com.StudyMate.StudyMate.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final ModelMapper modelMapper;
    private final QuestionGroupRepository questionGroupRepository;

    @Override
    public List<ExamResponse> getAllExams() {

        List<Exam> exams = examRepository.findAll();
        return exams.stream().map(exam
                -> modelMapper.map(exam, ExamResponse.class)).toList();
    }

    @Override
    public List<ExamResponse> getExamsByType(String examType) {

        List<Exam> exams = examRepository.findExamsByType(ExamType.valueOf(examType));
        return exams.stream().map(exam
                -> modelMapper.map(exam, ExamResponse.class)).toList();
    }

    @Override
    public ExamResponse getExamById(Long id) {

        Exam exam = examRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.EXAM_NOT_FOUND));

        return modelMapper.map(exam, ExamResponse.class);
    }

    @Override
    public ExamResponse updateExam(Long id, ExamRequest examRequest) {

        Exam exam = examRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.EXAM_NOT_FOUND));
        exam.setDescription(examRequest.getDescription());
        exam.setTitle(examRequest.getTitle());
        exam.setType(examRequest.getType());
        exam = examRepository.save(exam);
        return modelMapper.map(exam, ExamResponse.class);
    }

    @Override
    public ExamResponse createExam(ExamRequest examRequest) {

        List<QuestionGroup> questionGroupList = questionGroupRepository.findByIdIn(examRequest.getQuestionGroupsIds());

        Exam exam = Exam.builder()
                .title(examRequest.getTitle())
                .description(examRequest.getDescription())
                .type(examRequest.getType())
                .questionGroups(questionGroupList)
                .build();

        examRepository.save(exam);

        questionGroupList.forEach(questionGroup -> questionGroup.setExam(exam));

        return modelMapper.map(exam, ExamResponse.class);
    }

}
