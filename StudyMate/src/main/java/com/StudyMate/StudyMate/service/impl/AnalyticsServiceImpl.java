package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.response.DailyStudyStatResponse;
import com.StudyMate.StudyMate.dto.response.UserGamificationResponse;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.entity.UserGamification;
import com.StudyMate.StudyMate.entity.UserStudyStats;
import com.StudyMate.StudyMate.repository.UserGamificationRepository;
import com.StudyMate.StudyMate.repository.UserRepository;
import com.StudyMate.StudyMate.repository.UserStudyStatsRepository;
import com.StudyMate.StudyMate.service.AnalyticsService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserGamificationRepository userGamificationRepository;
    private final UserStudyStatsRepository userStudyStatsRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    @Override
    public void recordDailyActivity(Long userId) {
        // Lấy thời điểm đầu ngày hôm nay (UTC)
        Instant todayStart = Instant.now().truncatedTo(ChronoUnit.DAYS);

        // 1. Lấy hoặc tạo mới bảng Gamification
        UserGamification gamification = userGamificationRepository.findById(userId)
                .orElseGet(() -> {
                    UserGamification newGam = UserGamification.builder()
                            .user(userRepository.getReferenceById(userId))
                            .currentStreak(0)
                            .longestStreak(0)
                            .build();
                    return userGamificationRepository.save(newGam);
                });

        // 2. CHỐT CHẶN: Nếu hôm nay đã ghi nhận rồi thì return luôn
        if (todayStart.equals(gamification.getLastLearnDate())) {
            return;
        }

        // 3. Logic tính Streak
        Instant yesterdayStart = todayStart.minus(1, ChronoUnit.DAYS);

        if (yesterdayStart.equals(gamification.getLastLearnDate())) {
            // Học liên tiếp
            gamification.setCurrentStreak(gamification.getCurrentStreak() + 1);
        } else {
            // Mất chuỗi hoặc mới học
            gamification.setCurrentStreak(1);
        }

        if (gamification.getCurrentStreak() > gamification.getLongestStreak()) {
            gamification.setLongestStreak(gamification.getCurrentStreak());
        }

        gamification.setLastLearnDate(todayStart);
        userGamificationRepository.save(gamification);

        // 4. Ghi log vào bảng Stats (để vẽ biểu đồ)
        if (userStudyStatsRepository.findByUserIdAndStudyDate(userId, todayStart).isEmpty()) {
            UserStudyStats newStats = UserStudyStats.builder()
                    .user(userRepository.getReferenceById(userId))
                    .studyDate(todayStart)
                    .durationSeconds(1L) // Đánh dấu là có học
                    .build();
            userStudyStatsRepository.save(newStats);
        }
    }

    @Override
    public UserGamificationResponse getUserGamification() {
        Long userId = securityUtil.getCurrentUser().getId();

        UserGamification gamification = userGamificationRepository.findById(userId)
                .orElse(UserGamification.builder()
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());

        // Kiểm tra xem hôm nay đã học chưa để FE hiển thị
        Instant todayStart = Instant.now().truncatedTo(ChronoUnit.DAYS);
        boolean isLearnedToday = todayStart.equals(gamification.getLastLearnDate());

        return UserGamificationResponse.builder()
                .currentStreak(gamification.getCurrentStreak())
                .longestStreak(gamification.getLongestStreak())
                .lastLearnDate(gamification.getLastLearnDate())
                .isLearnedToday(isLearnedToday)
                .build();
    }

    @Override
    public List<DailyStudyStatResponse> getStudyStats(int lastDays) {
        Long userId = securityUtil.getCurrentUser().getId();

        // Tính ngày bắt đầu (Ví dụ: Lấy 7 ngày trước)
        Instant startDate = Instant.now().minus(lastDays, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);

        // Lấy danh sách các ngày ĐÃ HỌC từ DB
        List<UserStudyStats> learnedStats = userStudyStatsRepository.findByUserIdAndStudyDateAfterOrderByStudyDateAsc(userId, startDate);

        // Tạo danh sách kết quả đầy đủ cho 'lastDays' ngày (kể cả ngày không học)
        List<DailyStudyStatResponse> responseList = new ArrayList<>();

        // Set chứa các ngày đã học để tra cứu cho nhanh
        Set<Instant> learnedDates = learnedStats.stream()
                .map(UserStudyStats::getStudyDate)
                .collect(Collectors.toSet());

        // Vòng lặp từ ngày bắt đầu đến hôm nay để điền dữ liệu
        for (int i = 0; i < lastDays; i++) {
            Instant checkDate = startDate.plus(i, ChronoUnit.DAYS);

            // Convert Instant sang LocalDate để trả về cho đẹp
            LocalDate localDate = checkDate.atZone(ZoneId.systemDefault()).toLocalDate();

            responseList.add(DailyStudyStatResponse.builder()
                    .date(localDate)
                    .hasLearned(learnedDates.contains(checkDate)) // true nếu ngày đó có trong DB
                    .build());
        }

        return responseList;
    }
}
