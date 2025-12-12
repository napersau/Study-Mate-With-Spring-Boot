package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.service.CloudinaryService;
import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;

    @Override
    public String uploadImg(MultipartFile file) {
        try {
            validateImageFile(file);

            Map<String, Object> uploadParams = Map.of(
                    "folder", "study_mate/img",
                    "public_id", "img_" + UUID.randomUUID().toString(),
                    "resource_type", "image",
                    "transformation", new Transformation()
                            .width(400).height(400)
                            .crop("fill")
                            .gravity("face")
                            .quality("auto")
                            .fetchFormat("auto")
            );

            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    uploadParams
            );

            String imageUrl = uploadResult.get("secure_url").toString();
            log.info("Img uploaded successfully: {}", imageUrl);
            return imageUrl;

        } catch (Exception e) {
            log.error("Failed to upload avatar", e);
            throw new RuntimeException("Upload img failed: " + e.getMessage());
        }
    }



    @Override
    public void deleteImage(String imageUrl) {
        try {
            // Extract public_id from URL
            String publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId != null) {
                Map deleteResult = cloudinary.uploader().destroy(publicId, Map.of());
                log.info("Image deleted successfully: {}", publicId);
            }
        } catch (Exception e) {
            log.error("Failed to delete image: {}", imageUrl, e);
        }
    }

    @Override
    public String extractPublicIdFromUrl(String imageUrl) {
        try {
            // Extract public_id from Cloudinary URL
            // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/social_media/avatars/avatar_uuid.jpg
            String[] parts = imageUrl.split("/");
            for (int i = 0; i < parts.length; i++) {
                if ("upload".equals(parts[i]) && i + 2 < parts.length) {
                    // Skip version if present (starts with 'v')
                    int startIndex = parts[i + 1].startsWith("v") ? i + 2 : i + 1;
                    StringBuilder publicId = new StringBuilder();
                    for (int j = startIndex; j < parts.length; j++) {
                        if (j > startIndex) publicId.append("/");
                        // Remove file extension from last part
                        String part = parts[j];
                        if (j == parts.length - 1 && part.contains(".")) {
                            part = part.substring(0, part.lastIndexOf("."));
                        }
                        publicId.append(part);
                    }
                    return publicId.toString();
                }
            }
        } catch (Exception e) {
            log.error("Failed to extract public_id from URL: {}", imageUrl, e);
        }
        return null;
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Check file size (5MB limit)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("Unknown file type");
        }

        if (!contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Check allowed image types
        String[] allowedTypes = {"image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"};
        boolean isAllowedType = false;
        for (String allowedType : allowedTypes) {
            if (contentType.equalsIgnoreCase(allowedType)) {
                isAllowedType = true;
                break;
            }
        }

        if (!isAllowedType) {
            throw new IllegalArgumentException("File type not supported. Allowed: JPEG, PNG, GIF, WebP");
        }
    }


}
