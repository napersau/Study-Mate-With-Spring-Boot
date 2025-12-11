package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.GoogleAccountDTO;
import com.StudyMate.StudyMate.dto.request.UserRequest;
import com.StudyMate.StudyMate.dto.response.UserResponse;
import com.StudyMate.StudyMate.entity.Role;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.exception.AppException;
import com.StudyMate.StudyMate.exception.ErrorCode;
import com.StudyMate.StudyMate.repository.RoleRepository;
import com.StudyMate.StudyMate.repository.UserRepository;
import com.StudyMate.StudyMate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse createUser(UserRequest userCreateRequest) {

        if(userRepository.existsByUsername(userCreateRequest.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = modelMapper.map(userCreateRequest, User.class);
        user.setPassword(passwordEncoder.encode(userCreateRequest.getPassword()));
        user.setActive(true);
        Role role = roleRepository.findById(Long.valueOf(2)).get();
        user.setRole(role);


        return modelMapper.map(userRepository.save(user), UserResponse.class);
    }

    //    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserResponse.class))
                .toList();
    }

    //    @PostAuthorize("returnObject.username == authentication.name")
    @Override
    public UserResponse findUserById(Long userId) {
        return modelMapper.map(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found")), UserResponse.class);
    }

    @Override
    public UserResponse updateUser(Long id,UserRequest userUpdateRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));
        BeanUtils.copyProperties(userUpdateRequest, user, getNullPropertyNames(userUpdateRequest));

        return modelMapper.map(userRepository.save(user), UserResponse.class);
    }

    private String[] getNullPropertyNames(Object source) {
        return Arrays.stream(source.getClass().getDeclaredFields())
                .filter(field -> {
                    field.setAccessible(true);
                    try {
                        return field.get(source) == null;
                    } catch (IllegalAccessException e) {
                        return false;
                    }
                })
                .map(field -> field.getName())
                .toArray(String[]::new);
    }


    @Override
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));


        return modelMapper.map(user, UserResponse.class);
    }

    @Override
    public UserResponse createByGoogleAccount(GoogleAccountDTO googleAccountDTO) {
        Optional<User> existingUser = userRepository.findByUsername(googleAccountDTO.getEmail());

        if (existingUser.isPresent()) {
            return modelMapper.map(existingUser.get(), UserResponse.class);
        }

        Role role = roleRepository.findById(2L).orElseThrow(() -> new RuntimeException("Role Not Found"));

        User user = new User();
        user.setUsername(googleAccountDTO.getEmail());
        user.setPassword(passwordEncoder.encode(googleAccountDTO.getEmail()));
        user.setFullName(googleAccountDTO.getName());
        user.setRole(role);
        user.setActive(true);
        user.setGoogleAccountId(1);
        User savedUser = userRepository.save(user);

        return modelMapper.map(savedUser, UserResponse.class);
    }

    @Override
    public UserResponse changePassword(Long id, UserRequest userRequest) {
        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));
        boolean authenticated =  passwordEncoder.matches(userRequest.getOldPassword(), user.getPassword());
        if(!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        else{
            user.setPassword(passwordEncoder.encode(userRequest.getNewPassword()));
        }
        userRepository.save(user);
        return modelMapper.map(user, UserResponse.class);
    }
}
