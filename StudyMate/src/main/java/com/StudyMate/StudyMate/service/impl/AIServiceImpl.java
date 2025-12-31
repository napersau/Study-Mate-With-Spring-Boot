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
        return chatWithAI(
                "Translate the following text into Vietnamese: " + text
        );
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

