package com.StudyMate.StudyMate.DataLoader;

import com.StudyMate.StudyMate.entity.Exam;
import com.StudyMate.StudyMate.entity.Question;
import com.StudyMate.StudyMate.entity.QuestionGroup;
import com.StudyMate.StudyMate.enums.ExamType;
import com.StudyMate.StudyMate.enums.PartType;
import com.StudyMate.StudyMate.repository.ExamRepository;
import com.StudyMate.StudyMate.repository.QuestionGroupRepository;
import com.StudyMate.StudyMate.repository.QuestionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ToeicDataLoader implements CommandLineRunner {

    private final ResourceLoader resourceLoader;
    private final ExamRepository examRepository;
    private final QuestionGroupRepository questionGroupRepository;
    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    // URL giả lập (Sau này thay bằng link Cloud thật)
    private final String BASE_MEDIA_URL = "https://storage.studymate.com/toeic/";

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Đang kiểm tra dữ liệu TOEIC...");
        importToeicExam();
        System.out.println("✅ Hoàn thành Seed Data TOEIC!");
    }

    @Transactional
    public void importToeicExam() {
        // 1. Kiểm tra xem Đề thi mẫu đã có chưa (Chống trùng lặp mỗi khi Restart)
        String examTitle = "ETS 2026 - Test 1 (Demo)";
        if (examRepository.existsByTitle(examTitle)) {
            System.out.println("⚠️ Đề thi '" + examTitle + "' đã tồn tại -> Bỏ qua.");
            return;
        }

        // 2. Tạo Đề thi gốc
        Exam exam = Exam.builder()
                .title(examTitle)
                .type(ExamType.TOEIC_FULL_TEST)
                .description("Đề thi thử nghiệm được nạp từ DataLoader")
                .duration(120)
                .totalQuestions(200)
                .build();
        exam = examRepository.save(exam);
        System.out.println("🔥 Đã tạo mới Exam ID: " + exam.getId());

        // 3. Import dữ liệu từ các file
        importFromCSV(exam, "toeic_part1.csv", PartType.PART_1);
        importFromJSON(exam, "part5Test1.json", PartType.PART_5);

        // Có thể thêm các part khác ở đây
        // importFromJSON(exam, "part6Test1.json", PartType.PART_6);
        // importFromJSON(exam, "part7Test1.json", PartType.PART_7);
    }

    /**
     * Import dữ liệu từ file CSV (dành cho Part 1, 2, 3, 4)
     */
    private void importFromCSV(Exam exam, String fileName, PartType partType) {
        try {
            Resource resource = resourceLoader.getResource("classpath:data/" + fileName);
            if (!resource.exists()) {
                System.out.println("❌ Không thấy file CSV: " + fileName);
                return;
            }

            try (Reader reader = new InputStreamReader(resource.getInputStream());
                 CSVReader csvReader = new CSVReader(reader)) {

                csvReader.readNext(); // Bỏ qua dòng Header (Tiêu đề cột)

                String[] line;
                int count = 0;
                while ((line = csvReader.readNext()) != null) {
                    // Mapping dữ liệu từ CSV
                    // line[0]=Q.No, [1]=Img, [2]=Audio, [3]=Ans, [4]=A, [5]=B, [6]=C, [7]=D, [8]=Exp

                    // BƯỚC A: Tạo Group cho mỗi câu hỏi (Part 1 thường mỗi câu là 1 group riêng)
                    QuestionGroup group = QuestionGroup.builder()
                            .type(partType)
                            .exam(exam)
                            .imageUrl(line.length > 1 && !line[1].isEmpty() ? BASE_MEDIA_URL + line[1] : null)
                            .audioUrl(line.length > 2 && !line[2].isEmpty() ? BASE_MEDIA_URL + line[2] : null)
                            .build();
                    group = questionGroupRepository.save(group);

                    // BƯỚC B: Tạo Question
                    Question question = Question.builder()
                            .questionNumber(Integer.parseInt(line[0]))
                            .text(getQuestionTextByPart(partType, line[0]))
                            .correctAnswer(line[3])
                            .optionA(line.length > 4 ? line[4] : null)
                            .optionB(line.length > 5 ? line[5] : null)
                            .optionC(line.length > 6 ? line[6] : null)
                            .optionD(line.length > 7 ? line[7] : null)
                            .explanation(line.length > 8 ? line[8] : "")
                            .group(group)
                            .build();
                    questionRepository.save(question);
                    count++;
                }
                System.out.println("   -> Đã import thành công " + count + " câu hỏi từ " + fileName);
            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi đọc file CSV " + fileName + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Import dữ liệu từ file JSON (dành cho Part 5, 6, 7)
     */
    private void importFromJSON(Exam exam, String fileName, PartType partType) {
        try {
            Resource resource = resourceLoader.getResource("classpath:data/" + fileName);
            if (!resource.exists()) {
                System.out.println("❌ Không thấy file JSON: " + fileName);
                return;
            }

            try (Reader reader = new InputStreamReader(resource.getInputStream())) {
                JsonNode rootNode = objectMapper.readTree(reader);

                // Tạo QuestionGroup
                QuestionGroup group = QuestionGroup.builder()
                        .type(partType)
                        .exam(exam)
                        .content(rootNode.has("content") && !rootNode.get("content").isNull()
                                ? rootNode.get("content").asText() : null)
                        .audioUrl(rootNode.has("audioUrl") && !rootNode.get("audioUrl").isNull()
                                ? rootNode.get("audioUrl").asText() : null)
                        .imageUrl(rootNode.has("imageUrl") && !rootNode.get("imageUrl").isNull()
                                ? rootNode.get("imageUrl").asText() : null)
                        .build();
                group = questionGroupRepository.save(group);

                // Tạo các Question
                JsonNode questionsNode = rootNode.get("questions");
                List<Question> questions = new ArrayList<>();

                for (JsonNode questionNode : questionsNode) {
                    Question question = Question.builder()
                            .questionNumber(questionNode.get("questionNumber").asInt())
                            .text(questionNode.get("text").asText())
                            .optionA(questionNode.get("optionA").asText())
                            .optionB(questionNode.get("optionB").asText())
                            .optionC(questionNode.get("optionC").asText())
                            .optionD(questionNode.has("optionD") && !questionNode.get("optionD").isNull()
                                    ? questionNode.get("optionD").asText() : null)
                            .correctAnswer(questionNode.get("correctAnswer").asText())
                            .explanation(questionNode.has("explanation") && !questionNode.get("explanation").isNull()
                                    ? questionNode.get("explanation").asText() : "")
                            .group(group)
                            .build();
                    questions.add(question);
                }

                // Batch save questions
                questionRepository.saveAll(questions);

                System.out.println("   -> Đã import thành công " + questions.size() + " câu hỏi từ " + fileName);

            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi đọc file JSON " + fileName + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Tạo text câu hỏi theo từng Part
     */
    private String getQuestionTextByPart(PartType partType, String questionNumber) {
        return switch (partType) {
            case PART_1 -> "Look at the picture marked Number " + questionNumber + " in your test book.";
            case PART_2 -> "You will hear a question or statement and three responses. Select the best response.";
            case PART_3 -> "You will hear a conversation between two or more people. Answer the question based on what you hear.";
            case PART_4 -> "You will hear a talk given by a single speaker. Answer the question based on what you hear.";
            default -> "Question " + questionNumber;
        };
    }
}