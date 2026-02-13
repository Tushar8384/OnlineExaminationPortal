package com.tushar.online.service;

import com.tushar.online.dto.request.ExamRequest;
import com.tushar.online.dto.response.ExamResponse;

import java.util.List;

public interface ExamService {
    ExamResponse createExam(ExamRequest request);
    ExamResponse getExamById(Long id);
    List<ExamResponse> getAllExams();
    void deleteExam(Long id);
}