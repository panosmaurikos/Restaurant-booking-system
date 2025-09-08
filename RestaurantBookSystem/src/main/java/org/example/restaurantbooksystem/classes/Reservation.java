package org.example.restaurantbooksystem.classes;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "reservations")
public class Reservation implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L; // Add a serialVersionUID

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "table_number")
    private Integer tableNumber;
    @Column(name = "user_id")
    private UUID userId;

    private Integer people;
    private String surname;
    private String name;
    private String phone;
    private String email;
    private String notes;
    private LocalDate date;
    private String time;
    private Boolean iscompleted;

    public Reservation() {}

    public Reservation(Integer tableNumber,UUID userId, Integer people, String surname, String name, String phone, String email, String notes, LocalDate date, String time) {
        this.tableNumber = tableNumber;
        this.userId = userId;
        this.people = people;
        this.surname = surname;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.notes = notes;
        this.date = date;
        this.time = time;
    }

    // Getters / Setters
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public Integer getTableNumber() {
        return tableNumber;
    }
    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }
    public UUID getUserId() {
        return userId;
    }
    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    public Integer getPeople() {
        return people;
    }
    public void setPeople(Integer people) {
        this.people = people;
    }
    public String getSurname() {
        return surname;
    }
    public void setSurname(String surname) {
        this.surname = surname;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public String getTime() {
        return time;
    }
    public void setTime(String time) {
        this.time = time;
    }
    public Boolean getIsCompleted() { return iscompleted; }
    public void setIsCompleted(Boolean iscompleted) { this.iscompleted = iscompleted; }

    @Override
    public String toString() {
        return "Reservation:" + getId() + ", " + getTableNumber() + ", " + getUserId() + ", " + getPeople() + ", " + getSurname() + ", " + getName() + ", " + getPhone() + ", " + getEmail() + ", " + getNotes() + ", " + getDate() + ", " + getTime() + ", " + getIsCompleted();
    }
}
