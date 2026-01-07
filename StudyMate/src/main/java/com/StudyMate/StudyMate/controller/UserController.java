package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.request.UserRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.UserResponse;
import com.StudyMate.StudyMate.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserRequest userCreateRequest) {
        UserResponse response = userService.createUser(userCreateRequest);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(response)
                .message("Create user successfully")
                .build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .code(1000)
                .result(userService.getUsers())
                .message("Get all users successfully")
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") Long userId) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(userService.findUserById(userId))
                .message("Get user successfully")
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable("userId") Long userId, @RequestBody @Valid UserRequest userUpdateRequest) {
        UserResponse response = userService.updateUser(userId, userUpdateRequest);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(response)
                .message("Update user successfully")
                .build();
    }

    @PutMapping("/password/{userId}")
    ApiResponse<UserResponse> changePassword(@PathVariable("userId") Long userId, @RequestBody @Valid UserRequest userUpdateRequest) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(userService.changePassword(userId, userUpdateRequest))
                .message("Change password successfully")
                .build();
    }

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(userService.getMyInfo())
                .message("Get my info successfully")
                .build();
    }

}
