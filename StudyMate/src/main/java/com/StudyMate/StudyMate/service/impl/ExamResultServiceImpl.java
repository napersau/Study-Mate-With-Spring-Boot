package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.dto.request.ExamResultDetailRequest;
import com.StudyMate.StudyMate.dto.request.ExamResultRequest;
import com.StudyMate.StudyMate.dto.response.ExamResultResponse;
import com.StudyMate.StudyMate.entity.Exam;
import com.StudyMate.StudyMate.entity.ExamResult;
import com.StudyMate.StudyMate.entity.Question;
import com.StudyMate.StudyMate.repository.ExamRepository;
import com.StudyMate.StudyMate.repository.ExamResultRepository;
import com.StudyMate.StudyMate.service.ExamResultService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamResultServiceImpl implements ExamResultService {

    private final ExamResultRepository examResultRepository;
    private final ExamRepository examRepository;
    private final ModelMapper modelMapper;

    @Override
    public ExamResultResponse createExamResult(ExamResultRequest examResultRequest) {

        Exam exam = examRepository.findById(examResultRequest.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + examResultRequest.getExamId()));

        List<Question> allQuestions = exam.getQuestionGroups().stream()
                .flatMap(group -> group.getQuestions().stream())
                .toList();

        Map<Integer, Question> questionMap = allQuestions.stream()
                .collect(Collectors.toMap(Question::getQuestionNumber, Function.identity()));


        // Kiểm tra đáp án đúng
        int countCorrectAnswers = 0;
        for (ExamResultDetailRequest detailRequest : examResultRequest.getExamResultDetailRequestList()) {
            // Lấy question từ database theo questionNumber
            Question realQuestion = questionMap.get(detailRequest.getQuestion().getQuestionNumber());

            if (realQuestion != null && detailRequest.getSelectedOption() != null) {
                // So sánh với đáp án đúng từ database
                if (detailRequest.getSelectedOption().equals(realQuestion.getCorrectAnswer())) {
                    countCorrectAnswers++;
                }
            }
        }

        ExamResult examResult = ExamResult.builder()
                .exam(exam)
                .correctCount(countCorrectAnswers)
                .score(examResultRequest.getScore())
                .listeningScore(examResultRequest.getListeningScore())
                .readingScore(examResultRequest.getReadingScore())
                .submitTime(examResultRequest.getSubmitTime())
                .timeTaken(examResultRequest.getTimeTaken())
                .build();

        // Lưu examResult vào database
        ExamResult savedExamResult = examResultRepository.save(examResult);

        // Tạo response (cần implement ExamResultResponse)
        return modelMapper.map(savedExamResult, ExamResultResponse.class);
    }

    @Override
    public ExamResultResponse getExamResultById(Long id) {

        ExamResult examResult = examResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExamResult not found with id: " + id));

        return modelMapper.map(examResult, ExamResultResponse.class);
    }

}
