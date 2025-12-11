package com.StudyMate.StudyMate.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserRequest {
    @Size(min = 3, message = "USERNAME_INVALID")
    private String username;
    @Size(min = 6, message = "PASSWORD_INVALID" )
    private String password;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String oldPassword;
    private String newPassword;
}
