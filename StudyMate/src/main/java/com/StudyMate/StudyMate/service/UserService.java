package com.StudyMate.StudyMate.service;


import com.StudyMate.StudyMate.dto.GoogleAccountDTO;
import com.StudyMate.StudyMate.dto.request.UserRequest;
import com.StudyMate.StudyMate.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest userCreateRequest);
    List<UserResponse> getUsers();
    UserResponse findUserById(Long userId);
    UserResponse updateUser(Long id,UserRequest userUpdateRequest);
    UserResponse getMyInfo();
    UserResponse createByGoogleAccount(GoogleAccountDTO googleAccountDTO);
    UserResponse changePassword(Long id, UserRequest userRequest);
}
