package com.StudyMate.StudyMate.dto.request;

import com.StudyMate.StudyMate.enums.DocCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DocumentRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề quá dài (tối đa 255 ký tự)")
    private String title;
    @Size(max = 500, message = "Mô tả ngắn không quá 500 ký tự")
    private String description;
    private String thumbnail;
    @NotBlank(message = "Nội dung bài học không được để trống")
    private String content;
    private DocCategory category;
    private boolean isPublished; // Cho phép user chọn "Lưu nháp" hay "Đăng luôn"
}
