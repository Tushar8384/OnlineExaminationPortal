CREATE DATABASE IF NOT EXISTS exam;
USE exam;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS exams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    max_marks INT,
    duration_minutes INT,
    difficulty VARCHAR(50),
    category VARCHAR(100),
    instructions VARCHAR(2000),
    is_active BIT(1) NOT NULL DEFAULT b'1'
);

CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255),
    optiona VARCHAR(255),
    optionb VARCHAR(255),
    optionc VARCHAR(255),
    optiond VARCHAR(255),
    correct_option VARCHAR(255),
    exam_id BIGINT,
    CONSTRAINT fk_questions_exam FOREIGN KEY (exam_id) REFERENCES exams(id)
);

CREATE TABLE IF NOT EXISTS results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_questions INT,
    correct_answers INT,
    score_percentage DOUBLE,
    submission_date DATETIME(6),
    exam_id BIGINT,
    user_id BIGINT,
    CONSTRAINT fk_results_exam FOREIGN KEY (exam_id) REFERENCES exams(id),
    CONSTRAINT fk_results_user FOREIGN KEY (user_id) REFERENCES users(id)
);
