package org.example.restaurantbooksystem.classes;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L; // Add a serialVersionUID

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String username;
    private String email;
    private String password;
    private LocalDate birthyear;
    private String role;

    public User() {}

    public User(String username, String email, String password, LocalDate birthyear) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.birthyear = birthyear;
    }

    // Getter / Setters
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public LocalDate getBirthyear() {
        return birthyear;
    }
    public void setBirthyear(LocalDate birthyear) {
        this.birthyear = birthyear;
    }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    @Override
    public String toString() {
        return getId() + " " + getUsername() + " " + getEmail() + " " + getBirthyear() + " " + getRole();
    }
}
