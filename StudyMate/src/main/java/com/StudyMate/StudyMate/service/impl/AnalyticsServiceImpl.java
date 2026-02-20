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
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserGamificationRepository userGamificationRepository;
    private final UserStudyStatsRepository userStudyStatsRepository;
    private final SecurityUtil securityUtil;

    @Override
    public void recordDailyActivity(Long userId) {

        User user = securityUtil.getCurrentUser();

        // Lấy thời điểm đầu ngày hôm nay (UTC)
        Instant todayStart = Instant.now().truncatedTo(ChronoUnit.DAYS);

        // 1. Lấy hoặc tạo mới bảng Gamification
        UserGamification gamification = userGamificationRepository.findById(userId)
                .orElseGet(() -> {
                    UserGamification newGam = UserGamification.builder()
                            .user(user)
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
                    .user(user)
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

        // Tính ngày bắt đầu
        Instant startDate = Instant.now().minus(lastDays, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);

        // Lấy danh sách các ngày ĐÃ HỌC từ DB
        List<UserStudyStats> learnedStats = userStudyStatsRepository.findByUserIdAndStudyDateAfterOrderByStudyDateAsc(userId, startDate);

        List<DailyStudyStatResponse> responseList = new ArrayList<>();

        // TỐI ƯU MỚI: Dùng Map để lưu trữ cặp <Ngày, Tổng số giây>
        Map<Instant, Long> dailyDurationMap = learnedStats.stream()
                .collect(Collectors.toMap(
                        UserStudyStats::getStudyDate,
                        // Lấy số giây, nếu null thì mặc định là 0
                        stats -> stats.getDurationSeconds() != null ? stats.getDurationSeconds() : 0L,
                        // Nếu lỡ trong DB có 2 record trùng ngày (do lỗi nào đó), thì cộng gộp chúng lại
                        Long::sum
                ));

        // Vòng lặp từ ngày bắt đầu đến hôm nay để điền dữ liệu
        for (int i = 0; i <= lastDays; i++) { // Sửa nhẹ thành i <= lastDays để lấy trọn vẹn cả ngày hôm nay
            Instant checkDate = startDate.plus(i, ChronoUnit.DAYS);
            LocalDate localDate = checkDate.atZone(ZoneId.systemDefault()).toLocalDate();

            // Lấy thời gian học từ Map. Nếu ngày đó không có trong Map -> trả về 0L
            Long duration = dailyDurationMap.getOrDefault(checkDate, 0L);

            responseList.add(DailyStudyStatResponse.builder()
                    .date(localDate)
                    // Có học nếu tồn tại trong DB hoặc số giây > 0
                    .hasLearned(dailyDurationMap.containsKey(checkDate) || duration > 0)
                    .durationSeconds(duration) // Gắn thời gian học vào đây
                    .build());
        }

        return responseList;
    }

    @Override
    public void recordStudyTime(Long seconds) {
        User user = securityUtil.getCurrentUser();
        Instant todayStart = Instant.now().truncatedTo(ChronoUnit.DAYS);

        // Chặn gian lận: Nếu FE gửi số giây > 24 tiếng (86400s) thì lờ đi hoặc cap lại.
        if (seconds > 86400L) {
            seconds = 86400L;
        }

        // 2.1 Cập nhật bảng Study Stats (Cộng dồn giây)
        UserStudyStats stats = userStudyStatsRepository.findByUserIdAndStudyDate(user.getId(), todayStart)
                .orElseGet(() -> UserStudyStats.builder()
                        .user(user)
                        .studyDate(todayStart)
                        .durationSeconds(0L)
                        .build());

        // Cộng dồn thời gian cũ + mới
        stats.setDurationSeconds(stats.getDurationSeconds() + seconds);
        userStudyStatsRepository.save(stats);

        // 2.2 Đảm bảo Streak được cập nhật (phòng hờ user học xuyên đêm qua ngày mới)
        updateGamificationStreak(user, todayStart);
    }

    private void updateGamificationStreak(User user, Instant todayStart) {
        UserGamification gamification;
        try {
            gamification = userGamificationRepository.findById(user.getId()).orElse(null);
            if (gamification == null) {
                UserGamification newGam = UserGamification.builder()
                        .user(user)
                        .currentStreak(0)
                        .longestStreak(0)
                        .build();
                gamification = userGamificationRepository.save(newGam);
                userGamificationRepository.flush(); // Xử lý deadlock
            }
        } catch (Exception e) {
            gamification = userGamificationRepository.findById(user.getId()).orElse(null);
            if (gamification == null) return;
        }

        if (todayStart.equals(gamification.getLastLearnDate())) {
            return; // Hôm nay đã update streak rồi
        }

        Instant yesterdayStart = todayStart.minus(1, ChronoUnit.DAYS);

        if (yesterdayStart.equals(gamification.getLastLearnDate())) {
            gamification.setCurrentStreak(gamification.getCurrentStreak() + 1);
        } else {
            gamification.setCurrentStreak(1);
        }

        if (gamification.getCurrentStreak() > gamification.getLongestStreak()) {
            gamification.setLongestStreak(gamification.getCurrentStreak());
        }

        gamification.setLastLearnDate(todayStart);
        userGamificationRepository.save(gamification);
    }
}
