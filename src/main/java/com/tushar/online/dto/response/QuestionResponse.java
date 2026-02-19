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

    // We NEED to send this now so the React frontend can show the Review screen!
    private String correctOption;
}