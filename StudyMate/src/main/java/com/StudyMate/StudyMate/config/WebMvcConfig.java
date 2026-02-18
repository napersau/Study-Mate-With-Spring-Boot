package com.StudyMate.StudyMate.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final ActivityTrackingInterceptorConfig activityTrackingInterceptorConfig;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(activityTrackingInterceptorConfig)
                .addPathPatterns("/api/**") // Áp dụng cho mọi API bắt đầu bằng /api
                .excludePathPatterns("/api/auth/**", "/api/public/**"); // Trừ API login/register
    }
}
