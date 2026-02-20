-- Database creation
CREATE DATABASE IF NOT EXISTS online_exam;
USE online_exam;

-- Create Users Table
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       firstName VARCHAR(255) NOT NULL,
                       lastName VARCHAR(255) null ,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) DEFAULT 'STUDENT'
);

-- Create Exams Table
CREATE TABLE exams (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       description TEXT,
                       duration_minutes INT NOT NULL
);

-- Create Questions Table
CREATE TABLE questions (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           exam_id BIGINT,
                           content TEXT NOT NULL,
                           option_a VARCHAR(255) NOT NULL,
                           option_b VARCHAR(255) NOT NULL,
                           option_c VARCHAR(255) NOT NULL,
                           option_d VARCHAR(255) NOT NULL,
                           correct_option VARCHAR(10) NOT NULL,
                           FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Create Results Table
CREATE TABLE results (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         exam_id BIGINT,
                         student_name VARCHAR(255) NOT NULL,
                         student_email VARCHAR(255) NOT NULL,
                         correct_answers INT NOT NULL,
                         total_questions INT NOT NULL,
                         score_percentage DOUBLE NOT NULL,
                         FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);