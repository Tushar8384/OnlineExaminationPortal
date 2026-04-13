package com.tushar.online.service;

import com.tushar.online.dto.request.QuestionRequest;
import com.tushar.online.dto.response.QuestionResponse;

import java.util.List;

public interface QuestionService {
    QuestionResponse addQuestion(QuestionRequest request);
    QuestionResponse updateQuestion(Long id, QuestionRequest request);
    List<QuestionResponse> getQuestionsByExamId(Long examId);
    void deleteQuestion(Long id);
}
