package com.tushar.online.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ExamResponse {
    private Long id;
    private String title;
    private String description;
    private Integer maxMarks;
    private Integer durationMinutes;
    private String difficulty;
    private String category;
    private String instructions;
    private boolean isActive;
    // We might want to return questions only when taking the exam
    private List<QuestionResponse> questions;
}
