package com.StudyMate.StudyMate.service;

public interface AIService {
    String chatWithAI(String userMessage);
    String translateText(String text);
    String explainAnswer(String question, String wrongAnswer, String correctAnswer);
}
