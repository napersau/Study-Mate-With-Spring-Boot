package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.MailRequest;
import jakarta.mail.MessagingException;

public interface EmailService {
    void sendSimpleMessage(MailRequest request) throws MessagingException;
}
