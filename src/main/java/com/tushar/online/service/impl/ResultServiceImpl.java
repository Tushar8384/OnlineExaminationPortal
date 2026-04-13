package com.tushar.online.service.impl;

import com.tushar.online.dto.request.ExamSubmission;
import com.tushar.online.dto.response.ResultResponse;
import com.tushar.online.model.entity.Exam;
import com.tushar.online.model.entity.Question;
import com.tushar.online.model.entity.Result;
import com.tushar.online.model.entity.User;
import com.tushar.online.repository.ExamRepository;
import com.tushar.online.repository.QuestionRepository;
import com.tushar.online.repository.ResultRepository;
import com.tushar.online.repository.UserRepository;
import com.tushar.online.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResultServiceImpl implements ResultService {

    @Autowired
    private ResultRepository resultRepository;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public ResultResponse submitExam(ExamSubmission submission, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Exam exam = examRepository.findById(submission.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        List<Question> questions = questionRepository.findByExamId(submission.getExamId());
        if (questions.isEmpty()) {
            throw new RuntimeException("This exam has no questions configured yet.");
        }

        int totalQuestions = questions.size();
        int correctCount = 0;

        Map<Long, String> userAnswers = submission.getAnswers();

        for (Question q : questions) {
            String selectedOption = userAnswers.get(q.getId());
            if (selectedOption != null && selectedOption.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
            }
        }

        Result result = new Result(user, exam, totalQuestions, correctCount);
        result = resultRepository.save(result);

        String message = (result.getScorePercentage() >= 50) ? "Congratulations! You Passed." : "Better luck next time.";

        return new ResultResponse(
                result.getId(),
                exam.getTitle(),
                totalQuestions,
                correctCount,
                result.getScorePercentage(),
                message,
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail()
        );
    }

    @Override
    public List<ResultResponse> getMyResults(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return resultRepository.findByUserId(user.getId()).stream()
                .map(r -> new ResultResponse(
                        r.getId(),
                        r.getExam().getTitle(),
                        r.getTotalQuestions(),
                        r.getCorrectAnswers(),
                        r.getScorePercentage(),
                        r.getScorePercentage() >= 50 ? "Passed" : "Failed",
                        user.getFirstName() + " " + user.getLastName(),
                        user.getEmail()
                ))
                .collect(Collectors.toList());
    }

    // NEW: The Admin Method to get everyone's scores!
    @Override
    public List<ResultResponse> getResultsByExam(Long examId) {
        return resultRepository.findByExamId(examId).stream()
                .map(r -> new ResultResponse(
                        r.getId(),
                        r.getExam().getTitle(),
                        r.getTotalQuestions(),
                        r.getCorrectAnswers(),
                        r.getScorePercentage(),
                        r.getScorePercentage() >= 50 ? "Passed" : "Failed",
                        r.getUser().getFirstName() + " " + r.getUser().getLastName(),
                        r.getUser().getEmail()
                ))
                .collect(Collectors.toList());
    }
}
