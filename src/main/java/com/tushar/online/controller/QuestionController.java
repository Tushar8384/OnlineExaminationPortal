package com.tushar.online.controller;

import com.tushar.online.dto.request.QuestionRequest;
import com.tushar.online.dto.response.QuestionResponse;
import com.tushar.online.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponse> addQuestion(@RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.addQuestion(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable Long id, @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(questionService.getQuestionsByExamId(examId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok("Question deleted successfully");
    }
}
