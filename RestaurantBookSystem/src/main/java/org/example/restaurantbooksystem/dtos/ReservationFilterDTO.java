package org.example.restaurantbooksystem.dtos;

import java.time.LocalDate;

public class ReservationFilterDTO {
    private Integer tableNumber;
    private String name;
    private String email;
    private String phone;
    private LocalDate date;
    private String time;

    // Getters and setters
    public Integer getTableNumber() { return tableNumber; }
    public void setTableNumber(Integer tableNumber) { this.tableNumber = tableNumber; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public boolean isEmpty() {
        return tableNumber == null &&
                (name == null || name.isEmpty()) &&
                (email == null || email.isEmpty()) &&
                (phone == null || phone.isEmpty()) &&
                date == null &&
                (time == null || time.isEmpty());
    }

    @Override
    public String toString() {
        return getTableNumber() + getName() + getEmail() + getPhone() + getDate() + getTime();
    }
}
