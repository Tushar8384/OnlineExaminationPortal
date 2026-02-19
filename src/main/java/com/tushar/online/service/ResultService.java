package com.tushar.online.service;

import com.tushar.online.dto.request.ExamSubmission;
import com.tushar.online.dto.response.ResultResponse;

import java.util.List;

public interface ResultService {
    ResultResponse submitExam(ExamSubmission submission, String userEmail);
    List<ResultResponse> getMyResults(String userEmail);
    List<ResultResponse> getResultsByExam(Long examId);
}
