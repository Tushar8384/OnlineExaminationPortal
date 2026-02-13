# 🎓 Online Examination System API

A robust RESTful API for an Online Examination System built with **Spring Boot 3** and **Spring Security**. This system allows Admins to create exams and manage questions, while Students can take exams and receive real-time grading.

## 🚀 Features

* **Role-Based Access Control (RBAC):** Distinct roles for `ADMIN` and `STUDENT`.
* **JWT Authentication:** Secure, stateless authentication using JSON Web Tokens.
* **Exam Management:** Create, update, and delete exams (Admin only).
* **Question Bank:** Add multiple-choice questions to specific exams.
* **Automated Grading:** Instant score calculation upon submission.
* **Result History:** Students can view their past performance.
* **Global Exception Handling:** Clean JSON error responses.

---

## 🛠️ Tech Stack

* **Java:** 17+
* **Framework:** Spring Boot 3.x
* **Security:** Spring Security 6 + JWT (jjwt)
* **Database:** MySQL (Production) / H2 (Dev)
* **ORM:** Spring Data JPA (Hibernate)
* **Tools:** Maven, Lombok, Postman

---

## ⚙️ Setup & Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/online-exam-system.git](https://github.com/your-username/online-exam-system.git)
    cd online-exam-system
    ```

2.  **Configure Database:**
    Update `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/online_exam_db
    spring.datasource.username=root
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    ```

3.  **Run the Application:**
    ```bash
    mvn spring-boot:run
    ```

---

## 🔌 API Endpoints

### 1. Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login & get JWT Token | Public |

### 2. Exams
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/exams` | Create a new exam | Admin |
| `GET` | `/api/exams` | List all available exams | Admin, Student |
| `GET` | `/api/exams/{id}` | Get exam details | Admin, Student |
| `DELETE` | `/api/exams/{id}` | Delete an exam | Admin |

### 3. Questions
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/questions` | Add a question to an exam | Admin |
| `GET` | `/api/questions/exam/{id}` | Get questions for an exam | Admin, Student |
| `DELETE` | `/api/questions/{id}` | Delete a question | Admin |

### 4. Results
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/results/submit` | Submit answers & get score | Student |
| `GET` | `/api/results/history` | View past results | Student |

---

## 🧪 Testing Guide (Postman)

### Step 1: Create an Admin
Since the registration endpoint defaults to `STUDENT`, you must manually update the role in the database for your first Admin.
1. Register a user via `/api/auth/register`.
2. Run SQL: `UPDATE users SET role = 'ADMIN' WHERE email = 'your_email';`

### Step 2: Get Token
1. Login via `/api/auth/login`.
2. Copy the `token` from the response.
3. In future requests, go to the **Authorization** tab -> Select **Bearer Token** -> Paste the token.

### Step 3: Admin Actions
1. **Create Exam:** POST `/api/exams`
   ```json
   {
     "title": "Java Basics",
     "description": "Core Java Concepts",
     "maxMarks": 100,
     "durationMinutes": 60
   }