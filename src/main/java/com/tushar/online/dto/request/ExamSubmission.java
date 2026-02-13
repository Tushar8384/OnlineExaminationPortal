package com.tushar.online.dto.request;

import lombok.Data;
import java.util.Map;

@Data
public class ExamSubmission {
    private Long examId;
    // Map<QuestionId, SelectedOption>
    // Example: { 1: "A", 2: "C", 3: "B" }
    private Map<Long, String> answers;
}