package com.StudyMate.StudyMate.DataLoader;

import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class dich implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {

    }

//    private final FlashcardsRepository flashcardRepository;
//    private final ObjectMapper objectMapper;
//
//    // Tự tạo RestTemplate thủ công
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    @Value("${gemini.api.key}")
//    private String apiKey;
//
//    @Value("${gemini.api.url}")
//    private String apiUrl;
//
//    private static final int BATCH_SIZE = 15;
//
//    // Tăng thời gian nghỉ giữa các lần thành công lên 10 giây để an toàn với limit 5 RPM
//    private static final int NORMAL_SLEEP_MS = 10000;
//
//    @Override
//    public void run(String... args) throws Exception {
//        log.info("⚠️ BẮT ĐẦU JOB DỊCH 'BẤT TỬ' (SMART RETRY) - Deck ID = 1...");
//
//        long deckId = 1L;
//        // Lấy tất cả thẻ của Deck 1
//        List<Flashcards> allCards = flashcardRepository.findByDeckId(deckId);
//        log.info("Tổng số thẻ tìm thấy: {}", allCards.size());
//
//        int i = 0;
//        // Dùng vòng lặp WHILE để kiểm soát index
//        while (i < allCards.size()) {
//            int end = Math.min(i + BATCH_SIZE, allCards.size());
//            List<Flashcards> batch = allCards.subList(i, end);
//
//            log.info("🔄 Đang xử lý batch {}-{} (Tiến độ: {}%)...", i, end, (i * 100 / allCards.size()));
//
//            try {
//                // Gọi hàm xử lý
//                processBatch(batch);
//
//                log.info("✅ Batch {}-{} thành công. Nghỉ {}s...", i, end, NORMAL_SLEEP_MS/1000);
//
//                // CHỈ KHI THÀNH CÔNG MỚI TĂNG INDEX
//                i += BATCH_SIZE;
//
//                // Ngủ 10s để tránh bị Google ban (vì limit của bạn đang là 5 req/phút)
//                Thread.sleep(NORMAL_SLEEP_MS);
//
//            } catch (Exception e) {
//                // NẾU LỖI: KHÔNG TĂNG i -> Lần sau vòng lặp sẽ chạy lại đúng batch này
//
//                if (e.getMessage().contains("429") || e.getMessage().contains("Too Many Requests")) {
//                    log.warn("🛑 BỊ GOOGLE CHẶN (429). ĐANG ĐỢI 60 GIÂY ĐỂ HỒI MÁU...");
//                    // Ngủ 60s + 5s lẻ để chắc chắn hạn ngạch được reset
//                    Thread.sleep(65000);
//                } else {
//                    log.error("❌ Lỗi khác batch {}-{}: {}. Thử lại sau 10s...", i, end, e.getMessage());
//                    Thread.sleep(10000);
//                }
//                // Sau khi ngủ xong, vòng lặp quay lại đầu, i vẫn giữ nguyên -> Retry batch cũ
//            }
//        }
//        log.info("🎉 HOÀN TẤT TOÀN BỘ {} THẺ! KIỂM TRA DATABASE NGAY.", allCards.size());
//    }
//
//    private void processBatch(List<Flashcards> batch) {
//        // Lấy ID và TERM gửi đi
//        List<TranslateRequestDTO> requestDTOS = batch.stream()
//                .map(f -> new TranslateRequestDTO(f.getId(), f.getTerm()))
//                .toList();
//
//        try {
//            String jsonInput = objectMapper.writeValueAsString(requestDTOS);
//
//            String prompt = """
//                Bạn là từ điển Anh-Việt. Hãy cung cấp nghĩa tiếng Việt cho các từ vựng (term) sau.
//
//                Yêu cầu:
//                1. Nghĩa ngắn gọn, súc tích, đầy đủ các nét nghĩa chính.
//                2. Nếu từ có nhiều nghĩa hoặc từ loại, có thể liệt kê dạng "1. nghĩa một 2. nghĩa hai".
//                3. KHÔNG trả lời dài dòng, chỉ trả về JSON.
//
//                Input: %s
//                Output Schema: [{"id": 1, "definition": "nghĩa tiếng việt của từ..."}]
//                """.formatted(jsonInput);
//
//            String jsonResponse = callGeminiManual(prompt);
//            jsonResponse = cleanJson(jsonResponse);
//
//            List<TranslateResponseDTO> responses = objectMapper.readValue(jsonResponse, new TypeReference<>() {});
//            Map<Long, String> resultMap = responses.stream()
//                    .collect(Collectors.toMap(TranslateResponseDTO::getId, TranslateResponseDTO::getDefinition));
//
//            // Update vào DB
//            for (Flashcards card : batch) {
//                if (resultMap.containsKey(card.getId())) {
//                    card.setDefinition(resultMap.get(card.getId()));
//                }
//            }
//            flashcardRepository.saveAll(batch);
//
//        } catch (Exception e) {
//            // Ném lỗi ra ngoài để vòng lặp while bắt được và retry
//            throw new RuntimeException("Lỗi xử lý batch: " + e.getMessage());
//        }
//    }
//
//    private String callGeminiManual(String message) {
//        try {
//            Map<String, Object> body = Map.of(
//                    "contents", List.of(
//                            Map.of("parts", List.of(Map.of("text", message)))
//                    )
//            );
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//
//            String finalUrl = apiUrl + "?key=" + apiKey;
//            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, request, Map.class);
//
//            return extractText(response.getBody());
//
//        } catch (HttpClientErrorException e) {
//            // Bắt lỗi 429 từ RestTemplate để xử lý ở vòng lặp
//            throw new RuntimeException("Gemini HTTP Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
//        } catch (Exception e) {
//            throw new RuntimeException("Gemini Connection Error: " + e.getMessage());
//        }
//    }
//
//    @SuppressWarnings("unchecked")
//    private String extractText(Map<String, Object> body) {
//        try {
//            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
//            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
//            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
//            return parts.get(0).get("text").toString();
//        } catch (Exception e) {
//            return "[]";
//        }
//    }
//
//    private String cleanJson(String text) {
//        if (text.startsWith("```json")) return text.replace("```json", "").replace("```", "").trim();
//        if (text.startsWith("```")) return text.replace("```", "").trim();
//        return text.trim();
//    }
//
//    @Data
//    @RequiredArgsConstructor
//    static class TranslateRequestDTO {
//        private final Long id;
//        private final String term;
//    }
//
//    @Data
//    static class TranslateResponseDTO {
//        private Long id;
//        private String definition;
//    }
}