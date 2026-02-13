package com.tushar.online.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    private String correctOption; // e.g., "A", "B"

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;
}