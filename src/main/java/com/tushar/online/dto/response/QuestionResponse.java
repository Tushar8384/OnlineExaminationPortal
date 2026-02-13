package com.tushar.online.dto.response;

import lombok.Data;

@Data
public class QuestionResponse {
    private Long id;
    private String content;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    // Note: We usually DON'T send the 'correctOption' in the response to the student!
}
