package com.tushar.online.model.entity;


import com.tushar.online.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // Will be encrypted

    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Role role;
}