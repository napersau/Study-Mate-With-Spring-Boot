package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.service.AIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIServiceImpl implements AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String chatWithAI(String message) {
        try {
            log.info("API Key exists: {}", apiKey != null && !apiKey.isEmpty());
            log.info("API URL: {}", apiUrl);

            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", message)
                                    )
                            )
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            String url = apiUrl + "?key=" + apiKey;
            log.info("Calling Gemini API: {}", url);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, request, Map.class);

            log.info("Gemini response: {}", response.getBody());

            return extractText(response.getBody());
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            throw new RuntimeException("AI service error: " + e.getMessage());
        }
    }

    @Override
    public String translateText(String text) {
        try {
            // 1. Phải encode (mã hóa) text để chuyển các dấu cách, ký tự đặc biệt thành định dạng URL hợp lệ
            String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8.toString());

            // 2. Tạo URL gọi MyMemory API (en|vi là Anh -> Việt)
            // MẸO: Thêm tham số &de=email_cua_ban@gmail.com để được nâng hạn mức lên 10.000 từ/ngày miễn phí!
            String url = "https://api.mymemory.translated.net/get?q=" + encodedText + "&langpair=en|vi";

            log.info("Calling MyMemory Translation API: {}", url);

            // 3. Gọi API (Dùng phương thức GET)
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> body = response.getBody();

            // 4. Bóc tách JSON để lấy chữ đã dịch
            if (body != null && body.containsKey("responseData")) {
                Map<String, Object> responseData = (Map<String, Object>) body.get("responseData");
                String translatedResult = (String) responseData.get("translatedText");

                return translatedResult;
            }

            return "Không thể dịch (Lỗi trích xuất dữ liệu)";

        } catch (Exception e) {
            log.error("Lỗi khi gọi MyMemory API: ", e);
            // Xử lý fallback: Nếu API sập, có thể trả về chính chữ gốc hoặc báo lỗi
            return "Lỗi dịch thuật: " + e.getMessage();
        }
    }

    @Override
    public String explainAnswer(String question, String wrong, String correct) {
        return chatWithAI("""
                Question: %s
                Your answer: %s
                Correct answer: %s
                Explain clearly why the correct answer is right.
                """.formatted(question, wrong, correct));
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> body) {
        try {
            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) body.get("candidates");

            Map<String, Object> content =
                    (Map<String, Object>) candidates.get(0).get("content");

            List<Map<String, Object>> parts =
                    (List<Map<String, Object>>) content.get("parts");

            return parts.get(0).get("text").toString();
        } catch (Exception e) {
            return "AI response error";
        }
    }
}

