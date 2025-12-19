package com.StudyMate.StudyMate.entity;

import com.StudyMate.StudyMate.enums.DocCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.text.Normalizer;
import java.time.Instant;
import java.util.Locale;
import java.util.regex.Pattern;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "documents", indexes = {
        @Index(name = "idx_slug", columnList = "slug"), // Đánh index để tìm theo slug cho nhanh
        @Index(name = "idx_category", columnList = "category")
})
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 1. Validation ---
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề quá dài")
    @Column(name = "title",nullable = false)
    private String title;

    @Column(name = "slug",unique = true)
    private String slug;

    @Column(name = "description")
    @Size(max = 500, message = "Mô tả ngắn không quá 500 ký tự")
    private String description;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Lob
    @Column(name = "content",columnDefinition = "LONGTEXT")
    @NotBlank(message = "Nội dung bài học không được để trống")
    private String content;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private DocCategory category;

    // --- 2. Trạng thái & Thống kê ---
    @Builder.Default // Mặc định là false (Bản nháp)
    @Column(name = "is_published")
    private boolean isPublished = false;

    @Builder.Default
    @Column(name = "view_count")
    private int viewCount = 0;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;


    // --- Logic tự tạo Slug ---
    @PrePersist
    @PreUpdate
    public void generateSlug() {
        if (this.slug == null || this.slug.isEmpty()) {
            this.slug = toSlug(this.title);
        }
    }

    private String toSlug(String input) {
        if (input == null) return null;
        String nowhitespace = input.trim().replaceAll("\\s+", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("")
                .toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9-]", "")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

}
