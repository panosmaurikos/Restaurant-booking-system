"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  await verifyUser();
  await loadReservations();
  setupEventListeners();
});

const welcomeMessage = document.getElementById("welcome-message");

//  Σύνδεση event listeners
function setupEventListeners() {
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const filterBtn = document.getElementById("applyFiltersBtn");
  if (filterBtn) filterBtn.addEventListener("click", applyFilters);
}

//  Επαλήθευση χρήστη
async function verifyUser() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/verify", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      welcomeMessage.textContent = `Welcome, ${data.user.username}`;
    } else {
      console.error("Verification Failed");
      window.location.href = "/pages/login.html";
    }
  } catch (error) {
    console.error("Network Error:", error);
    window.location.href = "/pages/login.html";
  }
}

//  Logout χρήστη
async function logout() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      window.location.href = "/pages/login.html";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

//  Φόρτωση κρατήσεων
async function loadReservations(filters = {}) {
  try {
    const response = await fetch(
      "http://localhost:8080/api/reservation/filters",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch reservations");

    const data = await response.json();
    renderReservationsTable(data);
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
}

//  Εμφάνιση κρατήσεων στον πίνακα
function renderReservationsTable(reservations) {
  const table = document.getElementById("reservationsTable");
  table.innerHTML = `
      <tr>
        <th>Table Number</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Date</th>
        <th>Time</th>
        <th>Actions</th>
      </tr>
    `;

  reservations.forEach((reservation) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${reservation.tableNumber}</td>
        <td>${reservation.name}</td>
        <td>${reservation.email}</td>
        <td>${reservation.phone}</td>
        <td>${reservation.date}</td>
        <td>${reservation.time}</td>
        <td>
          <button class="logout-btn" data-id="${reservation.id}">Update</button>
          <button class="logout-btn" data-id="${reservation.id}">Cancel</button>
        </td>
      `;
    table.appendChild(row);
  });

  attachTableEventListeners();
}

//  Εφαρμογή φίλτρων
async function applyFilters() {
  const filters = {
    tableNumber: document.getElementById("table_number").value,
    name: document.getElementById("user_name").value,
    email: document.getElementById("email_address").value,
    phone: document.getElementById("telephone").value,
    date: document.getElementById("date_resv").value,
    time: document.getElementById("date_time").value,
  };

  await loadReservations(filters);
}

// Get the modals
const updateModal = document.getElementById("updateModal");
const cancelModal = document.getElementById("cancelModal");

// Get the <span> elements that close the modals
const closeButtons = document.querySelectorAll(".close");

// Get the elements to display reservation IDs
const updateReservationId = document.getElementById("updateReservationId");
const cancelReservationId = document.getElementById("cancelReservationId");

// When the user clicks on a button, open the corresponding modal
function attachTableEventListeners() {
  document.querySelectorAll(".logout-btn").forEach((btn) => {
    if (btn.textContent === "Update") {
      btn.addEventListener("click", async () => {
        const reservationId = btn.dataset.id;
        updateReservationId.textContent = reservationId;

        try {
          // Fetch reservation details
          const response = await fetch(
            `http://localhost:8080/api/reservation/returnable/${reservationId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("Failed to fetch reservations");
          const reservation = await response.json();

          // Populate the form fields with reservation data
          document.getElementById("updateTableNumber").value =
            reservation.tableNumber;
          document.getElementById("updatePeople").value = reservation.people;
          document.getElementById("updateSurname").value = reservation.surname;
          document.getElementById("updateName").value = reservation.name;
          document.getElementById("updatePhone").value = reservation.phone;
          document.getElementById("updateEmail").value = reservation.email;
          document.getElementById("updateNotes").value = reservation.notes;
          document.getElementById("updateDate").value = reservation.date;
          document.getElementById("updateTime").value = reservation.time;

          updateModal.style.display = "block";
        } catch (error) {
          console.error("Error fetching reservation details:", error);
          alert("Failed to fetch reservation details. Please try again.");
        }
      });
    } else if (btn.textContent === "Cancel") {
      btn.addEventListener("click", () => {
        cancelReservationId.textContent = btn.dataset.id;
        cancelModal.style.display = "block";
      });
    }
  });
}

// When the user clicks on <span> (x), close the modal
closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    updateModal.style.display = "none";
    cancelModal.style.display = "none";
  });
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target === updateModal) {
    updateModal.style.display = "none";
  }
  if (event.target === cancelModal) {
    cancelModal.style.display = "none";
  }
});

// Confirm Update button
document.getElementById("confirmUpdate").addEventListener("click", async () => {
  const reservationId = updateReservationId.textContent;

  // Get updated data from the form
  const updatedData = {
    id: reservationId,
    tableNumber: document.getElementById("updateTableNumber").value,
    people: document.getElementById("updatePeople").value,
    surname: document.getElementById("updateSurname").value,
    name: document.getElementById("updateName").value,
    phone: document.getElementById("updatePhone").value,
    email: document.getElementById("updateEmail").value,
    notes: document.getElementById("updateNotes").value,
    date: document.getElementById("updateDate").value,
    time: document.getElementById("updateTime").value,
  };

  try {
    // Send the updated data to the server
    const response = await fetch(
      `http://localhost:8080/api/reservation/update/${reservationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) throw new Error("Failed to update reservation");

    alert("Reservation updated successfully!");
    updateModal.style.display = "none";
    await loadReservations(); // Refresh the table
  } catch (error) {
    console.error("Error updating reservation:", error);
    alert("Failed to update reservation. Please try again.");
  }
});

// Confirm Cancel button
document.getElementById("confirmCancel").addEventListener("click", async () => {
  const reservationId = cancelReservationId.textContent;
  try {
    const response = await fetch(
      `http://localhost:8080/api/reservation/cancel/${reservationId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to delete the reservation");

    alert("Reservation canceled successfully!");
    cancelModal.style.display = "none";
    await loadReservations(); // Refresh the table
  } catch (error) {
    console.error("Error canceling reservation:", error);
    alert("Failed to cancel reservation. Please try again.");
  }
});
