package com.tushar.online.service.impl;

import com.tushar.online.dto.request.QuestionRequest;
import com.tushar.online.dto.response.QuestionResponse;
import com.tushar.online.model.entity.Exam;
import com.tushar.online.model.entity.Question;
import com.tushar.online.repository.ExamRepository;
import com.tushar.online.repository.QuestionRepository;
import com.tushar.online.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Override
    public QuestionResponse addQuestion(QuestionRequest request) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Question question = new Question();
        question.setContent(request.getContent());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectOption(request.getCorrectOption());
        question.setExam(exam);

        Question savedQuestion = questionRepository.save(question);
        return mapToResponse(savedQuestion);
    }

    @Override
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        question.setContent(request.getContent());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectOption(request.getCorrectOption());
        question.setExam(exam);

        Question updatedQuestion = questionRepository.save(question);
        return mapToResponse(updatedQuestion);
    }

    @Override
    public List<QuestionResponse> getQuestionsByExamId(Long examId) {
        List<Question> questions = questionRepository.findByExamId(examId);
        return questions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    private QuestionResponse mapToResponse(Question q) {
        QuestionResponse response = new QuestionResponse();
        response.setId(q.getId());
        response.setContent(q.getContent());
        response.setOptionA(q.getOptionA());
        response.setOptionB(q.getOptionB());
        response.setOptionC(q.getOptionC());
        response.setOptionD(q.getOptionD());
        response.setCorrectOption(q.getCorrectOption());
        return response;
    }
}
