package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.FileUploadResponse;
import com.StudyMate.StudyMate.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/img", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileUploadResponse> uploadImg(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Uploading img file: {}, size: {}", file.getOriginalFilename(), file.getSize());

            String imageUrl = cloudinaryService.uploadImg(file);

            FileUploadResponse response = FileUploadResponse.builder()
                    .url(imageUrl)
                    .fileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .build();

            return ApiResponse.<FileUploadResponse>builder()
                    .code(1000)
                    .message("Img uploaded successfully")
                    .result(response)
                    .build();

        } catch (IllegalArgumentException e) {
            log.error("Invalid avatar file: {}", e.getMessage());
            return ApiResponse.<FileUploadResponse>builder()
                    .code(1001)
                    .message(e.getMessage())
                    .build();

        } catch (Exception e) {
            log.error("Failed to upload img", e);
            return ApiResponse.<FileUploadResponse>builder()
                    .code(1002)
                    .message("Upload failed: " + e.getMessage())
                    .build();
        }
    }

    @DeleteMapping("/delete")
    public ApiResponse<Void> deleteImage(@RequestParam("imageUrl") String imageUrl) {
        try {
            log.info("Deleting image: {}", imageUrl);
            cloudinaryService.deleteImage(imageUrl);

            return ApiResponse.<Void>builder()
                    .code(1000)
                    .message("Image deleted successfully")
                    .build();

        } catch (Exception e) {
            log.error("Failed to delete image: {}", imageUrl, e);
            return ApiResponse.<Void>builder()
                    .code(1002)
                    .message("Delete failed: " + e.getMessage())
                    .build();
        }
    }
}
