package com.tushar.online.dto.request;

import lombok.Data;

@Data
public class ExamRequest {
    private String title;
    private String description;
    private Integer maxMarks;
    private Integer durationMinutes;
    private String difficulty;
    private String category;
    private String instructions;
}
