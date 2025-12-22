package com.StudyMate.StudyMate.DataLoader;

import com.StudyMate.StudyMate.entity.Exam;
import com.StudyMate.StudyMate.entity.Question;
import com.StudyMate.StudyMate.entity.QuestionGroup;
import com.StudyMate.StudyMate.enums.PartType;
import com.StudyMate.StudyMate.repository.ExamRepository;
import com.StudyMate.StudyMate.repository.QuestionGroupRepository;
import com.StudyMate.StudyMate.repository.QuestionRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.Reader;

@Component
@RequiredArgsConstructor
public class ToeicDataLoader implements CommandLineRunner {

    private final ResourceLoader resourceLoader;
    private final ExamRepository examRepository;
    private final QuestionGroupRepository questionGroupRepository;
    private final QuestionRepository questionRepository;

    // URL giả lập (Sau này thay bằng link Cloud thật)
    private final String BASE_MEDIA_URL = "https://storage.studymate.com/toeic/";

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Đang kiểm tra dữ liệu TOEIC...");
        importToeicExam();
        System.out.println("✅ Hoàn thành Seed Data TOEIC!");
    }

    private void importToeicExam() {
        // 1. Kiểm tra xem Đề thi mẫu đã có chưa (Chống trùng lặp mỗi khi Restart)
        String examTitle = "ETS 2024 - Test 1 (Demo)";
        if (examRepository.existsByTitle(examTitle)) {
            System.out.println("⚠️ Đề thi '" + examTitle + "' đã tồn tại -> Bỏ qua.");
            return;
        }

        // 2. Tạo Đề thi gốc
        Exam exam = Exam.builder()
                .title(examTitle)
                .description("Đề thi thử nghiệm được nạp từ DataLoader")
                .duration(120)
                .totalQuestions(200)
                .build();
        exam = examRepository.save(exam);
        System.out.println("🔥 Đã tạo mới Exam ID: " + exam.getId());

        // 3. Đọc file CSV và nạp Part 1
        String fileName = "toeic_part1.csv";
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
                    // Mapping dữ liệu từ CSV (dựa theo thứ tự cột file CSV mẫu ở trên)
                    // line[0]=Q.No, [1]=Img, [2]=Audio, [3]=Ans, [4]=A, [5]=B, [6]=C, [7]=D, [8]=Exp

                    // BƯỚC A: Tạo Group
                    QuestionGroup group = QuestionGroup.builder()
                            .type(PartType.PART_1)
                            .exam(exam)
                            .imageUrl(BASE_MEDIA_URL + line[1])
                            .audioUrl(BASE_MEDIA_URL + line[2])
                            .build();
                    group = questionGroupRepository.save(group);

                    // BƯỚC B: Tạo Question
                    Question question = Question.builder()
                            .questionNumber(Integer.parseInt(line[0]))
                            .text("Look at the picture marked Number " + line[0] + " in your test book.")
                            .correctAnswer(line[3])
                            .optionA(line[4])
                            .optionB(line[5])
                            .optionC(line[6])
                            .optionD(line[7])
                            .explanation(line[8])
                            .group(group)
                            .build();
                    questionRepository.save(question);
                    count++;
                }
                System.out.println("   -> Đã import thành công " + count + " câu hỏi Part 1.");
            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi đọc file CSV: " + e.getMessage());
            e.printStackTrace();
        }
    }
}