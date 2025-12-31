package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private final ChatClient chatClient;

    // Tính năng 1: Chatbot gia sư
    @Override
    public String chatWithAI(String userMessage) {
        // System prompt: Định hình tính cách cho AI
        String systemText = """
                Bạn là StudyMate AI - một gia sư tiếng Anh nhiệt tình và am hiểu.
                Hãy trả lời ngắn gọn, súc tích và tập trung vào việc giải thích ngữ pháp/từ vựng.
                Nếu người dùng hỏi ngoài lề, hãy khéo léo đưa họ về bài học.
                """;

        return chatClient.prompt()
                .system(systemText)
                .user(userMessage)
                .call()
                .content();
    }

    // Tính năng 2: Dịch từ/Cụm từ (Instant Translate)
    @Override
    public String translateText(String text) {
        String promptText = "Dịch cụm từ hoặc câu sau sang tiếng Việt sát nghĩa ngữ cảnh nhất: {text}. Chỉ trả về kết quả dịch, không giải thích thêm.";

        PromptTemplate template = new PromptTemplate(promptText);
        Prompt prompt = template.create(Map.of("text", text));

        return chatClient.prompt(prompt)
                .call()
                .content();
    }


    // Tính năng 3: Giải thích tại sao sai
    @Override
    public String explainAnswer(String question, String wrongAnswer, String correctAnswer) {
        String promptText = String.format("""
                Tôi đang làm câu trắc nghiệm: %s
                Tôi chọn: %s
                Nhưng đáp án đúng là: %s
                Hãy giải thích ngắn gọn tại sao tôi sai và tại sao đáp án kia đúng?
                """, question, wrongAnswer, correctAnswer);

        return chatClient.prompt()
                .user(promptText)
                .call()
                .content();
    }
}

