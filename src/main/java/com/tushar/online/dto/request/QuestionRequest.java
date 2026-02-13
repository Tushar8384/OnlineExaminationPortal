package com.tushar.online.dto.request;

import lombok.Data;

@Data
public class QuestionRequest {
    private String content;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption;
    private Long examId; // To link the question to an exam
}
