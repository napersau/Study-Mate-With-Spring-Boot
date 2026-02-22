package com.StudyMate.StudyMate.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Configuration
@EnableWebSecurity
//@EnableMethodSecurity
public class SecurityConfig {


    @Value("${jwt.signerKey}")
    private String signerKey;

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    private final String[] PUBLIC_ENDPOINTS = {"/api/v1/users","/api/v1/auth/**","/api/v1/users/**", "/api/v1/email/**", "/api/v1/ai/**"
    ,"/oauth2/**","/login/oauth2/**"};

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request ->
                        request
                                // Public endpoints - ĐẶT TRƯỚC, cụ thể hơn
                                .requestMatchers(HttpMethod.POST, "/api/v1/users").permitAll()  // Đăng ký
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()  // Login
                                .requestMatchers(HttpMethod.PUT, "/api/v1/email/**").permitAll()  // Reset password
                                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()  // OAuth

                                // Protected endpoints - ĐẶT SAU
                                .requestMatchers(HttpMethod.GET, "/api/v1/users").hasRole("ADMIN")  // Get all users
                                .requestMatchers(HttpMethod.POST, "/api/v1/users/update/{userId}").hasRole("ADMIN")  // Update user
                                .requestMatchers("/api/v1/users/**").hasAnyRole("USER", "ADMIN")  // Other user endpoints
                                // Flashcards
                                .requestMatchers("/api/v1/flashcards/**").hasAnyRole("USER", "ADMIN")  // Other user endpoints

                                .requestMatchers("/api/v1/decks/**").hasAnyRole("USER", "ADMIN")  // Other user endpoints

                                .requestMatchers("/api/v1/flashcards-progress/**").hasAnyRole("USER", "ADMIN")  // Other user endpoints

                                .requestMatchers("/api/v1/documents/**").hasAnyRole("USER", "ADMIN")

                                .requestMatchers("/api/v1/exams/**").hasAnyRole("USER", "ADMIN")

                                .requestMatchers("/api/v1/exam-results/**").hasAnyRole("USER", "ADMIN")

                                .requestMatchers("/api/v1/courses/**").hasAnyRole("USER", "ADMIN")

                                .requestMatchers("/api/v1/analytics/**").hasAnyRole("USER", "ADMIN")

                                .requestMatchers("/api/v1/order/**").hasAnyRole("USER", "ADMIN")

                                .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            response.sendRedirect("http://localhost:3000/auth/signingoogle");
                        })
                );

        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtConverter())));

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

//    @Bean
//    public CorsFilter corsFilter() {
//
//        CorsConfiguration corsConfiguration = new CorsConfiguration();
//        corsConfiguration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
//        corsConfiguration.setAllowedMethods(Collections.singletonList("*"));
//        corsConfiguration.addAllowedHeader("*");
//        corsConfiguration.setAllowCredentials(true); // Cho phép gửi credentials (JWT)
//
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", corsConfiguration);
//        return new CorsFilter(source);
//    }

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // ✅ Cho tất cả origin (Android + Web)
        corsConfiguration.setAllowedOriginPatterns(Collections.singletonList("*"));

        corsConfiguration.setAllowedMethods(Collections.singletonList("*"));
        corsConfiguration.addAllowedHeader("*");

        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }

    @Bean
    JwtAuthenticationConverter jwtConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        // "SCOPE_" -> "ROLE_"
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        // Custom converter để đọc role từ "scope.name"
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            // Lấy claim "scope"
            Map<String, Object> scope = jwt.getClaim("scope");
            if (scope != null && scope.containsKey("name")) {
                String roleName = "ROLE_" + scope.get("name"); // -> ROLE_ADMIN
                authorities.add(new SimpleGrantedAuthority(roleName));
                System.out.println("ROLE: " + roleName);
            }

            return authorities;
        });

        return converter;
    }



    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}