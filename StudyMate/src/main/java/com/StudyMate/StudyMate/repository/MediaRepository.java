package com.StudyMate.StudyMate.repository;


import com.StudyMate.StudyMate.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findBySourceTypeAndSourceIdIn(
            String sourceType,
            List<Long> sourceIds
    );
}
