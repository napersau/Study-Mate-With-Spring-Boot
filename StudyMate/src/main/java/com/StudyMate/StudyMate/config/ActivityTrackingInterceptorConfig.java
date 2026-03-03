package com.StudyMate.StudyMate.config;

import com.StudyMate.StudyMate.service.AnalyticsService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

        // Kiểm tra user đã đăng nhập chưa trước khi lấy thông tin
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return true; // Chưa đăng nhập -> bỏ qua tracking
        }

        // Lấy ID user hiện tại
        try {
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
        } catch (Exception e) {
            // Không chặn request nếu có lỗi khi lấy thông tin user
            System.err.println("Lỗi lấy thông tin user trong interceptor: " + e.getMessage());
        }

        return true;
    }
}
