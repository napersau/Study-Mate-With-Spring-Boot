package com.StudyMate.StudyMate.DataLoader;

import com.StudyMate.StudyMate.dto.DictionaryEntry;
import com.StudyMate.StudyMate.dto.Sense;
import com.StudyMate.StudyMate.entity.Decks;
import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.repository.DecksRepository;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.StudyMate.StudyMate.utils.MediaUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ResourceLoader resourceLoader;
    private final FlashcardsRepository flashcardRepository;
    private final DecksRepository deckRepository;
    private final ObjectMapper objectMapper;
    private final MediaUtil mediaUtil;

    @Override
    public void run(String... args) throws Exception {
//        System.out.println("🚀 Bắt đầu quy trình kiểm tra và nhập dữ liệu A-Z...");
//        importAllDataFiles();
        System.out.println("✅ Hoàn thành quy trình nhập liệu!");
    }

//    private void importAllDataFiles() {
//        // 1. Tạo Deck mặc định
//        Decks defaultDeck = deckRepository.findDeckByTitle("Từ vựng Oxford");
//        if (defaultDeck == null) {
//            defaultDeck = Decks.builder().title("Từ vựng Oxford").build();
//            defaultDeck = deckRepository.save(defaultDeck);
//        }
//
//        // 2. Tự động sinh danh sách file từ 'a' đến 'z'
//        // Thay vì gõ tay String[], ta dùng List và vòng lặp
//        List<String> fileNames = new ArrayList<>();
//        for (char c = 'a'; c <= 'z'; c++) {
//            fileNames.add(c + "_words.json");
//        }
//
//        // 3. Duyệt qua từng file
//        for (String fileName : fileNames) {
//            System.out.println("📂 Đang xử lý file: " + fileName);
//            try {
//                Resource resource = resourceLoader.getResource("classpath:data/" + fileName);
//
//                // Kiểm tra file có tồn tại không trước khi đọc (tránh lỗi nếu thiếu file nào đó)
//                if (!resource.exists()) {
//                    System.out.println("⚠️ Không tìm thấy file: " + fileName + " -> Bỏ qua.");
//                    continue;
//                }
//
//                try (InputStream inputStream = resource.getInputStream()) {
//                    List<DictionaryEntry> entries = objectMapper.readValue(
//                            inputStream,
//                            new TypeReference<List<DictionaryEntry>>(){}
//                    );
//
//                    // Xử lý và lưu dữ liệu của file hiện tại
//                    processAndSaveEntries(entries, defaultDeck);
//                }
//            } catch (IOException e) {
//                System.err.println("❌ Lỗi khi đọc file " + fileName + ": " + e.getMessage());
//            }
//        }
//    }
//
//    // Hàm này vừa xử lý vừa lưu luôn (để lấy ID cho MediaUtil)
//    private void processAndSaveEntries(List<DictionaryEntry> entries, Decks deck) {
//        int skippedCount = 0;
//        int savedCount = 0;
//
//        for (DictionaryEntry entry : entries) {
//            // --- LOGIC CHỐNG LẶP ---
//            // Kiểm tra xem từ này đã có trong DB chưa
//            if (flashcardRepository.existsByTerm(entry.getWord())) {
//                skippedCount++;
//                continue; // Bỏ qua, chuyển sang từ tiếp theo
//            }
//
//            if (entry.getSenses() == null || entry.getSenses().isEmpty()) continue;
//
//            StringBuilder fullDefinition = new StringBuilder();
//            StringBuilder fullExample = new StringBuilder();
//
//            for (int i = 0; i < entry.getSenses().size(); i++) {
//                Sense sense = entry.getSenses().get(i);
//                fullDefinition.append((i + 1)).append(". ").append(sense.getDefinition()).append("\n");
//
//                if (sense.getExamples() != null && !sense.getExamples().isEmpty()) {
//                    fullExample.append((i + 1)).append(". ").append(sense.getExamples().get(0).getX()).append("\n");
//                }
//            }
//
//            Flashcards card = Flashcards.builder()
//                    .term(entry.getWord())
//                    .pronunciation(entry.getPhoneticTextAm())
//                    .definition(fullDefinition.toString().trim())
//                    .example(fullExample.toString().trim())
//                    .deck(deck)
//                    .build();
//
//            // Lưu mới
//            card = flashcardRepository.save(card);
//            savedCount++;
//
//            // Lưu Media
//            String phoneticUrl = entry.getPhoneticAm();
//            if (phoneticUrl != null && !phoneticUrl.isEmpty()) {
//                mediaUtil.createMediaList(List.of(phoneticUrl), card.getId(), "flashcards", "audio");
//            }
//        }
//        System.out.println("   -> Kết quả: Thêm mới " + savedCount + " từ, Bỏ qua " + skippedCount + " từ đã có.");
//    }
}