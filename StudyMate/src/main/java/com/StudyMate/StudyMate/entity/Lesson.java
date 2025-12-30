package com.StudyMate.StudyMate.entity;

import com.StudyMate.StudyMate.enums.LessonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title; // Tên bài học

    @Column(name = "order_index")
    private Integer orderIndex; // Thứ tự bài (Bài 1, Bài 2...)

    @Column(name = "is_free")
    private boolean isFree; // Học thử (Preview) được không?

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private LessonType type; // VIDEO, DOCUMENT, FLASHCARD, hay EXAM?

    // --- CÁC LIÊN KẾT DỮ LIỆU ---

    // 1. Nếu là VIDEO: Lưu link video (Youtube/Cloud)
    @Column(name = "video_url")
    private String videoUrl;
    @Column(name = "duration_seconds")
    private Integer duration; // Thời lượng video

    // 2. Nếu là DOCUMENT: Link tới bảng Document cũ
    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    // 3. Nếu là FLASHCARD: Link tới bảng Deck (Bộ thẻ)
    @ManyToOne
    @JoinColumn(name = "deck_id")
    private Decks deck; // (Giả sử entity Flashcard của bạn tên là Decks)

    // 4. Nếu là EXAM: Link tới bảng Exam
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;
}
