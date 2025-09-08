package org.example.restaurantbooksystem.repositories;

import org.example.restaurantbooksystem.classes.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    Reservation findReservationById(UUID id);

    @Query("SELECT r FROM Reservation r WHERE " +
            "(r.date > :dateToday) OR " +
            "(r.date = :dateToday AND r.time >= :timeNow) " +
            "ORDER BY r.date ASC, r.time ASC LIMIT 10")
    List<Reservation> findUpcomingReservations(@Param("dateToday") LocalDate dateToday, @Param("timeNow") String timeNow);

    List<Reservation> findAllByIscompletedAndDateEqualsAndTimeBefore(Boolean iscompleted, LocalDate date, String timeAfter);

    @Query(value = """
    SELECT table_number 
    FROM reservations 
    WHERE date = :date 
      AND TO_TIMESTAMP(time, 'HH24:MI') 
          BETWEEN TO_TIMESTAMP(:startTime, 'HH24:MI') 
              AND TO_TIMESTAMP(:endTime, 'HH24:MI')
    """, nativeQuery = true)
    List<Integer> findTableNumberByDateAndTimeRange(
            @Param("date") LocalDate date,
            @Param("startTime") String startTime,
            @Param("endTime") String endTime
    );
}