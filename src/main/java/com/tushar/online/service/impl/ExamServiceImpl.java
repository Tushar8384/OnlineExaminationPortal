package com.tushar.online.service.impl;

import com.tushar.online.dto.request.ExamRequest;
import com.tushar.online.dto.response.ExamResponse;
import com.tushar.online.model.entity.Exam;
import com.tushar.online.repository.ExamRepository;
import com.tushar.online.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Override
    public ExamResponse createExam(ExamRequest request) {
        Exam exam = new Exam();
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setMaxMarks(request.getMaxMarks());
        exam.setDurationMinutes(request.getDurationMinutes());
        exam.setDifficulty(request.getDifficulty());
        exam.setCategory(request.getCategory());
        exam.setInstructions(request.getInstructions());
        exam.setActive(true);

        Exam savedExam = examRepository.save(exam);
        return mapToResponse(savedExam);
    }

    @Override
    public ExamResponse getExamById(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + id));
        return mapToResponse(exam);
    }

    @Override
    public List<ExamResponse> getAllExams() {
        return examRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteExam(Long id) {
        if (!examRepository.existsById(id)) {
            throw new RuntimeException("Exam not found");
        }
        examRepository.deleteById(id);
    }

    // Helper method to convert Entity -> DTO
    private ExamResponse mapToResponse(Exam exam) {
        ExamResponse response = new ExamResponse();
        response.setId(exam.getId());
        response.setTitle(exam.getTitle());
        response.setDescription(exam.getDescription());
        response.setMaxMarks(exam.getMaxMarks());
        response.setDurationMinutes(exam.getDurationMinutes());
        response.setDifficulty(exam.getDifficulty());
        response.setCategory(exam.getCategory());
        response.setInstructions(exam.getInstructions());
        response.setActive(exam.isActive());
        return response;
    }
}
