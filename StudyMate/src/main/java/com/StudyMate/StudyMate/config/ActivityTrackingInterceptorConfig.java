package com.StudyMate.StudyMate.config;

import com.StudyMate.StudyMate.service.AnalyticsService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class ActivityTrackingInterceptorConfig implements HandlerInterceptor {

    private final AnalyticsService analyticsService;
    private final SecurityUtil securityUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Chỉ xử lý nếu request gọi vào Controller (bỏ qua file tĩnh, css, js...)
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        // Lấy ID user hiện tại
        Long userId = securityUtil.getCurrentUser().getId();

        // Nếu đã đăng nhập -> Ghi nhận hoạt động
        if (userId != null) {
            try {
                analyticsService.recordDailyActivity(userId);
            } catch (Exception e) {
                // Log lỗi nhưng không chặn request của user
                System.err.println("Lỗi tracking activity: " + e.getMessage());
            }
        }

        return true;
    }
}
