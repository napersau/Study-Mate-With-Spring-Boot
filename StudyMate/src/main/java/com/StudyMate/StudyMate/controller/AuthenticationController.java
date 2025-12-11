package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.GoogleAccountDTO;
import com.StudyMate.StudyMate.dto.request.AuthenticationRequest;
import com.StudyMate.StudyMate.dto.request.IntrospectRequest;
import com.StudyMate.StudyMate.dto.request.RefreshRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.AuthenticationResponse;
import com.StudyMate.StudyMate.dto.response.IntrospectResponse;
import com.StudyMate.StudyMate.repository.UserRepository;
import com.StudyMate.StudyMate.service.AuthenticationService;
import com.StudyMate.StudyMate.service.UserService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.openid.connect.sdk.LogoutRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import java.text.ParseException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        request.setLoginMethod("LoginNormal");
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .code(1000)
                .result(result)
                .build();
    }

    @PostMapping("/signingoogle")
    ApiResponse<AuthenticationResponse> loginSuccess(@AuthenticationPrincipal OAuth2User user) {

        String email = user.getAttribute("email");
        String name = user.getAttribute("name");

        // Kiểm tra xem user đã tồn tại hay chưa
        var existingUser = userRepository.findByUsername(email);
        if (existingUser.isEmpty()) {
            // Nếu chưa có, tạo tài khoản mới
            GoogleAccountDTO googleAccountDTO = new GoogleAccountDTO();
            googleAccountDTO.setEmail(email);
            googleAccountDTO.setName(name);
            userService.createByGoogleAccount(googleAccountDTO);
        }

        AuthenticationRequest authenticationRequest = new AuthenticationRequest();
        authenticationRequest.setUsername(email);
        authenticationRequest.setPassword(email);
        authenticationRequest.setLoginMethod("LoginGoogle");
        var result = authenticationService.authenticate(authenticationRequest);

        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .result(result)
                .build();

    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
//        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> reFreshToken(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .result(result)
                .build();
    }


}
