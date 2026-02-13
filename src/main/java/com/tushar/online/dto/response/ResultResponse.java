package com.tushar.online.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultResponse {
    private Long resultId;
    private String examTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double scorePercentage;
    private String message;
}