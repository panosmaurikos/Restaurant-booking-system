package org.example.restaurantbooksystem.repositories;

import org.example.restaurantbooksystem.classes.Reservation;
import org.example.restaurantbooksystem.dtos.ReservationFilterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ReservationDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Use parameterized query to prevent SQL injection
    public List<Reservation> findReservationsByFilters(ReservationFilterDTO filters) {
        StringBuilder query = new StringBuilder("SELECT * FROM reservations WHERE 1=1");
        List<Object> params = new ArrayList<>();

        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        String formatedTime = DateTimeFormatter.ofPattern("HH:mm").format(currentTime);

        query.append(" AND (date > ? OR (date = ? AND time > ?))");
        params.add(currentDate);
        params.add(currentDate);
        params.add(formatedTime);

        if (filters.getTableNumber() != null) {
            query.append(" AND table_number = ?");
            params.add(filters.getTableNumber());
        }
        if (filters.getName() != null && !filters.getName().isEmpty()) {
            query.append(" AND name LIKE ?");
            params.add("%" + filters.getName() + "%");
        }
        if (filters.getEmail() != null && !filters.getEmail().isEmpty()) {
            query.append(" AND email LIKE ?");
            params.add("%" + filters.getEmail() + "%");
        }
        if (filters.getPhone() != null && !filters.getPhone().isEmpty()) {
            query.append(" AND phone LIKE ?");
            params.add("%" + filters.getPhone() + "%");
        }
        if (filters.getDate() != null) {
            query.append(" AND date = ?");
            params.add(filters.getDate());
        }
        if (filters.getTime() != null && !filters.getTime().isEmpty()) {
            query.append(" AND time = ?");
            params.add(filters.getTime());
        }

        return jdbcTemplate.query(query.toString(), params.toArray(), new BeanPropertyRowMapper<>(Reservation.class));
    }

    public List<Integer> findReservedTables(Integer people, String time, LocalDate date) {
        String sql = "SELECT t.id " +
                "FROM tables t " +
                "JOIN reservations r ON t.id = r.table_number " +
                "WHERE t.people = ? " +
                "AND r.date = ? " +
                "AND (r.time::time BETWEEN (?::time - INTERVAL '2 hours') AND (?::time + INTERVAL '2 hours'))";

        return jdbcTemplate.query(sql, new Object[]{people, date, time, time}, (rs, rowNum) -> rs.getInt("id"));
    }
}
