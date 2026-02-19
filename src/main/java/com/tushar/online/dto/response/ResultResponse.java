package com.tushar.online.dto.response;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultResponse {
    private Long resultId;
    private String examTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double scorePercentage;
    private String message;

    // NEW: So the Admin knows who took the test!
    private String studentName;
    private String studentEmail;
}