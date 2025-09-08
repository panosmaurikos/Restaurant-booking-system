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

### Ports
Ensure ports `8080`, `8081`, `5432` and `6379` are available on your machine.

## Steps to Run the Project

### Run Docker Compose:

Use the provided `docker-compose.yml` file to start the application:

```
docker-compose up --build
```

This will:

- Start the frontend server at http://localhost:8081/.
- Start the backend server at http://localhost:8080/.
- Start the PostgreSQL database at localhost:5432.
- Start the Redis server at localhost:6379.

### Access the Application:

Open your browser and navigate to:

- Login Page: http://localhost:8081/pages/login.html
- Guest Reservation: http://localhost:8081/pages/selection.html

**Default Manager Credentials**:

- `Email: admin@reservation.gr`
- `Password: admin`

### Stop the Application:

To stop the application, press Ctrl+C in the terminal where Docker Compose is running, or run:
```
docker-compose down
```

### Project Structure

**Frontend**
- Served at http://localhost:8081/.
- Contains HTML, CSS, and JavaScript files for the user interface.
- Static files are served by the frontend server.

**Backend**
- Served at http://localhost:8080/.
- Java Spring Boot application handling API requests, authentication, and database interactions.

**Database**
- PostgreSQL running at localhost:5432.
- Stores user data, reservations, and other application data.

**Redis**
- Redis running at localhost:6379.
- Cache queries for better performance.

# Troubleshooting

**Port Conflicts**:
- Ensure no other services are using ports 8080, 8081, 5432 or 6379.
- If conflicts occur, stop the conflicting services or update the ports in the docker-compose.yml file.

**Docker Issues**:
- Ensure Docker is running and has sufficient resources (CPU, memory).
- Restart Docker if the containers fail to start.

**Database Connection Issues**:
- Verify that the PostgreSQL container is running.
- Check the backend logs for connection errors.

**Frontend/Backend Communication**:
- Ensure the frontend is correctly pointing to the backend API at http://localhost:8080.

