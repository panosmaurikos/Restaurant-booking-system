# Online Restaurant Table Booking Service

This project is an online booking system for restaurant tables. It allows users to reserve tables by selecting a date, time, and table from a restaurant map, and then completing a form to finalize the reservation. Managers can view and manage reservations, including filtering, updating, and canceling them. The system also generates a ticket with a QR code for users to present at the restaurant entrance and complete their reservation.

## Features

### **User Side**

1. **Login**: Users can log in to access the booking system.
2. **Date and Time Selection**: Users can select a date and time from a calendar.
3. **Table Selection**: Users can choose a table from an interactive restaurant map based on the selected date and time.
4. **Reservation Form**: Users complete a form with necessary details (e.g., name, contact info, special requests).
5. **Reservation Confirmation**: After completing the reservation, users receive a ticket via email with a QR code.
6. **Ticket Management**: Users can save or print the ticket to present at the restaurant.

### **Manager Side**

1. **Upcoming Reservations**: Managers can view a list of all upcoming reservations.
2. **Filter Reservations**: Managers can filter reservations by date, time, or table number.
3. **Restaurant Map**: Managers can view the current restaurant map with available and occupied tables.
4. **Reservation Management**:
   - **Update**: Managers can update the time or table number for a reservation.
   - **Cancel**: Managers can cancel a reservation.
5. **Real-Time Updates**: The restaurant map and reservation list are updated in real-time.
6. **Manage Users**: Managers can change user details, such as roles.


## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Java Spring Boot
- **Database**: PostgreSQL
- **Services**: Gmail API, GitHub OAuth, Redis

# How to Run

## Prerequisites

### Docker
Ensure Docker is installed and running on your machine.

[Download Docker](https://www.docker.com/get-started)


## Steps to Run the Project

### Run Docker Compose:

Use the provided `docker-compose.yml` file to start the application:

```
docker-compose up --build
```

Use default admin credentials:
`Username:` admin@reservation.gr
`Password:` admin