package com.StudyMate.StudyMate.utils;

import com.StudyMate.StudyMate.entity.Media;
import com.StudyMate.StudyMate.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MediaUtil {
    private final MediaRepository mediaRepository;
    private final ModelMapper modelMapper;

    public void createMediaList(List<String> mediaUrls, Long sourceId, String sourceType, String type) {
        for (String mediaUrl : mediaUrls) {
            Media media = Media.builder()
                    .url(mediaUrl)
                    .sourceId(sourceId)
                    .sourceType(sourceType)
                    .type(type)
                    .createdDate(Instant.now())
                    .build();
            mediaRepository.save(media);
        }
    }
}
