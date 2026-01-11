package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.response.UserGamificationResponse;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.entity.UserGamification;
import com.StudyMate.StudyMate.repository.UserGamificationRepository;
import com.StudyMate.StudyMate.service.AnalyticsService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserGamificationRepository userGamificationRepository;
    private final ModelMapper modelMapper;
    private final SecurityUtil securityUtil;

    @Override
    public UserGamificationResponse getUserGamification() {

        User user = securityUtil.getCurrentUser();

        UserGamification userGamification = userGamificationRepository.findById(user.getId()).orElse(null);

        return modelMapper.map(userGamification, UserGamificationResponse.class);
    }
}
