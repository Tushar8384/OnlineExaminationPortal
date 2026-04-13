package com.tushar.online.controller;

import com.tushar.online.dto.request.ExamSubmission;
import com.tushar.online.dto.response.ResultResponse;
import com.tushar.online.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping("/submit")
    public ResponseEntity<ResultResponse> submitExam(@RequestBody ExamSubmission submission, Principal principal) {
        // 'Principal' contains the email of the currently logged-in user (from the JWT)
        return ResponseEntity.ok(resultService.submitExam(submission, principal.getName()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ResultResponse>> getMyHistory(Principal principal) {
        return ResponseEntity.ok(resultService.getMyResults(principal.getName()));
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResultResponse>> getExamResultsForAdmin(@PathVariable Long examId) {
        return ResponseEntity.ok(resultService.getResultsByExam(examId));
    }
}
