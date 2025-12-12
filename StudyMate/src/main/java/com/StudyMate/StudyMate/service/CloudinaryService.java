package com.StudyMate.StudyMate.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    String uploadImg(MultipartFile file);
    String extractPublicIdFromUrl(String imageUrl);
    void deleteImage(String imageUrl);
}
