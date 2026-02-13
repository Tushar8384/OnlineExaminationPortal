package com.tushar.online.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "results")
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double scorePercentage;

    private LocalDateTime submissionDate = LocalDateTime.now();

    public Result(User user, Exam exam, Integer totalQuestions, Integer correctAnswers) {
        this.user = user;
        this.exam = exam;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.scorePercentage = (double) correctAnswers / totalQuestions * 100;
    }
}