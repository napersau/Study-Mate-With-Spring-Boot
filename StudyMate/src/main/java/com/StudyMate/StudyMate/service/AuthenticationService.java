package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.AuthenticationRequest;
import com.StudyMate.StudyMate.dto.request.IntrospectRequest;
import com.StudyMate.StudyMate.dto.request.RefreshRequest;
import com.StudyMate.StudyMate.dto.response.AuthenticationResponse;
import com.StudyMate.StudyMate.dto.response.IntrospectResponse;

import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
//    void logout(LogoutRequest request) throws ParseException, JOSEException;
    AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;
}
