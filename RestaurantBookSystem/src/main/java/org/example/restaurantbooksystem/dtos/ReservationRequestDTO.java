package org.example.restaurantbooksystem.dtos;

import java.time.LocalDate;

public class ReservationRequestDTO {
    private Integer people;
    private String time;
    private LocalDate date;

    // Getters and Setters
    public Integer getPeople() {
        return people;
    }

    public void setPeople(Integer people) {
        this.people = people;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "ReservationRequestDTO{" +
                "people=" + people +
                ", time='" + time + '\'' +
                ", date=" + date +
                '}';
    }
}
