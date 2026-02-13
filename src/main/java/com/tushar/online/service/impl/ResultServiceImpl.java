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
        // 1. Fetch User and Exam
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Exam exam = examRepository.findById(submission.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // 2. Fetch all questions for this exam
        // (Optimized: fetch all at once instead of one by one in a loop)
        List<Question> questions = questionRepository.findByExamId(submission.getExamId());

        int totalQuestions = questions.size();
        int correctCount = 0;

        // 3. Compare Answers
        Map<Long, String> userAnswers = submission.getAnswers();

        for (Question q : questions) {
            String selectedOption = userAnswers.get(q.getId());
            // Check if selected option matches correct option (Case insensitive safety)
            if (selectedOption != null && selectedOption.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
            }
        }

        // 4. Save Result
        Result result = new Result(user, exam, totalQuestions, correctCount);
        resultRepository.save(result);

        // 5. Return Response
        String message = (result.getScorePercentage() >= 50) ? "Congratulations! You Passed." : "Better luck next time.";

        return new ResultResponse(
                result.getId(),
                exam.getTitle(),
                totalQuestions,
                correctCount,
                result.getScorePercentage(),
                message
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
                        r.getScorePercentage() >= 50 ? "Passed" : "Failed"
                ))
                .collect(Collectors.toList());
    }
}
