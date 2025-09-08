"use strict";

// DOM Elements
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const navItems = document.querySelectorAll(".nav-item");
const mainContent = document.getElementById("mainContent");

// Toggle sidebar
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// Navigation handling
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    // Get the page identifier
    const page = item.getAttribute("data-page");

    // Check if the clicked item is already active
    if (item.classList.contains("active")) {
      return; // Do nothing if the same item is clicked
    }

    // Remove active class from all items
    navItems.forEach((nav) => nav.classList.remove("active"));

    // Add active class to clicked item
    item.classList.add("active");

    // Clear the main content (set it to empty)
    clearMainContent();

    // Show the corresponding view
    if (page === "tables") {
      showTablesView();
    } else if (page === "reservations") {
      showReservationsView();
    } else if (page === "completed") {
      showCompletedView();
    } else if (page === "manage") {
      showManageView();
    } else if (page === "profile") {
      viewProfile();
    }
  });
});

// Clear main content (set it to empty)
function clearMainContent() {
  mainContent.innerHTML = ""; // Clear all content inside mainContent
}

const planData = {
  tables: [
    { id: 1, shape: "square-4", x: 300, y: 300, reserved: false },
    { id: 2, shape: "square-4", x: 700, y: 300, reserved: false },
    { id: 3, shape: "square-4", x: 1100, y: 300, reserved: false },
    { id: 6, shape: "square-4", x: 300, y: 900, reserved: false },
    { id: 7, shape: "square-4", x: 700, y: 900, reserved: false },
    { id: 8, shape: "square-4", x: 1100, y: 900, reserved: false },
    { id: 11, shape: "square-4", x: 300, y: 1500, reserved: false },
    { id: 12, shape: "square-4", x: 700, y: 1500, reserved: false },
    { id: 13, shape: "square-4", x: 1100, y: 1500, reserved: false },
    { id: 4, shape: "square-4", x: 1500, y: 300, reserved: false },
    { id: 9, shape: "square-4", x: 1500, y: 900, reserved: false },
    { id: 14, shape: "square-4", x: 1500, y: 1500, reserved: false },
    { id: 5, shape: "square-4", x: 1900, y: 300, reserved: false },
    { id: 10, shape: "square-4", x: 1900, y: 900, reserved: false },
    { id: 15, shape: "square-4", x: 1900, y: 1500, reserved: false },
  ],
};

const chairSize = {
  width: 60,
  height: 60,
  outerWidth: 60,
  outerHeight: 60,
};

const tableData = {
  "square-4": {
    shape: "rect",
    width: 200,
    height: 200,
    chairPositions: [
      { x: -0.05, y: 0.5, angle: 0 },
      { x: 0.5, y: -0.05, angle: 90 },
      { x: 1.05, y: 0.5, angle: 180 },
      { x: 0.5, y: 1.05, angle: 270 },
    ],
  },
};

let stage;
let layer;

function drawTable(tableConfig, reservedTableIds = []) {
  const data = tableData[tableConfig.shape];
  const group = new Konva.Group({
    x: tableConfig.x,
    y: tableConfig.y,
    draggable: false,
  });

  let tableShape;
  if (data.shape === "rect") {
    tableShape = new Konva.Rect({
      x: -data.width / 2,
      y: -data.height / 2,
      width: data.width,
      height: data.height,
      stroke: "black",
      strokeWidth: 6,
      fill:
          Array.isArray(reservedTableIds) &&
          reservedTableIds.includes(tableConfig.id)
              ? "red"
              : "green",
      cornerRadius: 20, // Change border radius here
    });
  } else {
    tableShape = new Konva.Circle({
      radius: data.radius,
      stroke: "silver",
      strokeWidth: 4,
      fill:
          Array.isArray(reservedTableIds) &&
          reservedTableIds.includes(tableConfig.id)
              ? "red"
              : "green",
    });
  }

  group.add(tableShape);

  // Add table ID text in the center of the table
  const tableIdText = new Konva.Text({
    x: -data.width / 2, // Start from the left edge of the table
    y: -data.height / 2, // Start from the top edge of the table
    width: data.width, // Set width to match the table width
    height: data.height, // Set height to match the table height
    text: tableConfig.id.toString(), // Display the table ID
    fontSize: 40, // Adjust font size as needed
    fontFamily: "Arial", // Adjust font family as needed
    fill: "white", // Text color
    align: "center", // Center the text horizontally
    verticalAlign: "middle", // Center the text vertically
  });

  group.add(tableIdText);

  // Draw chairs
  const outerWidth = data.shape === "rect" ? data.width : data.radius * 2;
  const outerHeight = data.shape === "rect" ? data.height : data.radius * 2;
  const outerRect = {
    x: -outerWidth / 2 - chairSize.outerWidth / 2,
    y: -outerHeight / 2 - chairSize.outerHeight / 2,
    width: outerWidth + chairSize.outerWidth,
    height: outerHeight + chairSize.outerHeight,
  };

  data.chairPositions.forEach((chairPos) => {
    const chairGroup = new Konva.Group({
      x: outerRect.x + outerRect.width * chairPos.x,
      y: outerRect.y + outerRect.height * chairPos.y,
      rotation: chairPos.angle,
    });

    const chair = new Konva.Rect({
      width: chairSize.width,
      height: chairSize.height,
      offsetX: chairSize.width / 2,
      offsetY: chairSize.height / 2,
      stroke: "black",
      strokeWidth: 5,
      fill: "transparent",
      cornerRadius: [0, 20, 20, 0],
    });

    chairGroup.add(chair);
    group.add(chairGroup);
  });

  layer.add(group);
}

async function viewProfile() {
  // Create and append the header
  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
        <div class="letter">Manager Panel - My profile</div>
    `;
  mainContent.appendChild(header);

  // Create the profile dashboard
  const profileDashboard = document.createElement("div");
  profileDashboard.className = "profile-dashboard";

  // Display user data in a form
  profileDashboard.innerHTML = `
    <h2>Account</h2>
    <form id="profileForm">
      <div class="form-groups">
        <label for="userId">ID</label>
        <input type="text" id="userId" name="id" readonly>
      </div>
      <div class="form-groups">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" >
      </div>
      <div class="form-groups">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" >
      </div>
      <div class="form-groups">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter new password">
      </div>
      <div class="form-groups">
        <label for="repPassword">Repeat Password</label>
        <input type="password" id="repPassword" name="password" placeholder="Repeat new password">
      </div>
      <div class="form-groups">
        <label for="birthyear">Birth Year</label>
        <input type="date" id="birthyear" name="birthyear" >
      </div>
      <button type="submit" class="save-btn">Save Changes</button>
    </form>
  `;

  // Append the dashboard to the main content
  mainContent.appendChild(profileDashboard);

  document.getElementById('userId').value = userid;
  document.getElementById('username').value = username;
  document.getElementById('email').value = userEmail;

  // Handle form submission
  const profileForm = document.getElementById("profileForm");
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get updated values from the form
    const updatedUser = {
      id: userid, // ID cannot be changed
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      birthyear: document.getElementById("birthyear").value,
    };

    // Send updated data to the backend
    // const success = await updateUserData(updatedUser);
    // if (success) {
    //   alert("Profile updated successfully!");
    // } else {
    //   alert("Failed to update profile. Please try again.");
    // }
  });
}

async function showManageView() {
  // Create and append the header
  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
        <div class="letter">Manager Panel - Edit Users</div>
    `;
  mainContent.appendChild(header);

  const reservationsTable = document.createElement("table");
  reservationsTable.className = "reservations-table";
  reservationsTable.id = "manageTable";
  reservationsTable.innerHTML = `
          <thead>
              <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>BirthYear</th>
                  <th>Role</th>
                  <th>Action</th>
              </tr>
          </thead>
          <tbody>
          </tbody>
      `;
  mainContent.appendChild(reservationsTable);

  await loadUsers()
}

// Show Tables View
async function showTablesView() {
  // Create the container for the map
  const tablesView = document.createElement("div");
  // Create and append the header
  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
        <div class="letter">Manager Panel - Available Tables now</div>
    `;
  tablesView.innerHTML = `<div class="centered"><div id="container" class="map-class"></div></div>`;
  mainContent.appendChild(header);
  mainContent.appendChild(tablesView);

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0'); // Ensures 2 digits (e.g., "05" instead of "5")
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensures 2 digits
  const currentTime = `${hours}:${minutes}`;

  const message = document.createElement("div");
  message.innerHTML = `<h3>Here you can view the available tables at time: <b>${currentTime}</b>.</h3>`
  mainContent.appendChild(message);

  // Initialize the Konva stage and layer
  stage = new Konva.Stage({
    container: "container",
    width: 650,
    height: 550,
    scaleX: 0.3,
    scaleY: 0.3,
  });

  layer = new Konva.Layer();
  stage.add(layer);

  // Fetch reserved tables
  const reservedTableIds = await fetchReservedTables();

  // Draw all tables with reservation status
  planData.tables.forEach((table) => drawTable(table, reservedTableIds));
  layer.draw();
}

// Show Completed View
function showCompletedView() {
  // Create and append the header
  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
        <div class="letter">Manager Panel - Completed Reservations</div>
    `;
  mainContent.appendChild(header);

  const reservationsTable = document.createElement("table");
  reservationsTable.className = "reservations-table";
  reservationsTable.id = "reservationsTable";
  reservationsTable.innerHTML = `
          <thead>
              <tr>
                  <th>Table Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Action</th>
              </tr>
          </thead>
          <tbody>
          </tbody>
      `;
  mainContent.appendChild(reservationsTable);

  loadCheckIn();
}

document.addEventListener("DOMContentLoaded", async () => {
  await verifyUser();
  showReservationsView();
});

const welcomeMessage = document.getElementById("welcome-message");

// Get the modals
const updateModal = document.getElementById("updateModal");
const cancelModal = document.getElementById("cancelModal");
const editModal = document.getElementById("editModal");

// Get the <span> elements that close the modals
const closeButtons = document.querySelectorAll(".close");

// Get the elements to display reservation IDs
const updateReservationId = document.getElementById("updateReservationId");
const cancelReservationId = document.getElementById("cancelReservationId");
const editUserId = document.getElementById("updateUserId");

// Setup event listeners for the reservations view
function setupEventListeners() {
  const applyFiltersBtn = document.getElementById("applyFiltersBtn");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", applyFilters);
  }
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearFilters);
  }
}

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

async function clearFilters() {
  document.getElementById("table_number").value = "";
  document.getElementById("user_name").value = "";
  document.getElementById("email_address").value = "";
  document.getElementById("telephone").value = "";
  document.getElementById("date_resv").value = "";
  document.getElementById("date_time").value = "";

  await loadReservations();
}

// API CALLS

async function logout() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("You logged out successfully");
      window.location.href = "/pages/login.html";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

let userid;
let username;
let userRole;
let userEmail;


async function verifyUser() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/verify", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      userid = data.user.id;
      username = data.user.username;
      userRole = data.user.role;
      userEmail = data.user.email;
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

async function loadCheckIn() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/reservation/checkin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch reservations");

    const data = await response.json();
    loadReservationsForChekIn(data);
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
}

async function fetchReservedTables() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/reservation/availabletables",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reserved tables");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching reserved tables:", error);
    return [];
  }
}

async function loadUsers() {
  try {
    const response = await fetch(
        "http://localhost:8080/api/user/all",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
    );

    if (!response.ok) throw new Error("Failed to fetch reservations");

    const data = await response.json();
    loadFetchedUsers(data);
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
}

function loadFetchedUsers(users) {
  const table = document.getElementById("manageTable");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing rows

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.birthyear}</td>
          <td>${user.role}</td>
          <td>
            <button class="list-btns" data-id="${user.id}" 
                    style="background: #b25c2a; color: white; border: none; padding: 8px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;">Edit</button>
          </td>
        `;
    tbody.appendChild(row);
  });

  // Attach event listeners to the buttons in the table
  attachTableEventListeners();
}

// Show Reservations View
function showReservationsView() {

  // Create and append the header
  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
        <div class="letter">Manager Panel - Open Reservations</div>
    `;
  mainContent.appendChild(header);

  // Create and append the filter container
  const filterContainer = document.createElement("div");
  filterContainer.className = "filter-container";
  filterContainer.innerHTML = `
          <h3>Filter Reservations</h3>
          <div class="filter-grid">
              <div class="filter-group">
                  <label for="table_number">Table Number</label>
                  <input type="text" id="table_number" placeholder="Table Number" />
              </div>
              <div class="filter-group">
                  <label for="user_name">Name</label>
                  <input type="text" id="user_name" placeholder="Name" />
              </div>
              <div class="filter-group">
                  <label for="email_address">Email</label>
                  <input type="email" id="email_address" placeholder="Email" />
              </div>
              <div class="filter-group">
                  <label for="telephone">Telephone</label>
                  <input type="tel" id="telephone" placeholder="Phone" />
              </div>
              <div class="filter-group">
                  <label for="date_resv">Date</label>
                  <input type="date" id="date_resv" />
              </div>
              <div class="filter-group">
                  <label for="date_time">Time</label>
                  <input type="time" id="date_time" />
              </div>
          </div>
          <button id="applyFiltersBtn" class="apply-btn">Apply Filters</button>
          <button id="clearFiltersBtn" class="apply-btn">Clear Filters</button>
      `;
  mainContent.appendChild(filterContainer);

  // Create and append the reservations table
  const reservationsTable = document.createElement("table");
  reservationsTable.className = "reservations-table";
  reservationsTable.id = "reservationsTable";
  reservationsTable.innerHTML = `
          <thead>
              <tr>
                  <th>Table Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
          </tbody>
      `;
  mainContent.appendChild(reservationsTable);

  // Create and append the footer
  const footer = document.createElement("div");
  footer.className = "footer";
  footer.innerHTML = `
        <p>&copy; 2025 Restaurant Reservation System. All rights reserved.</p>
        
    `;
  mainContent.appendChild(footer);

  // Load reservations and apply filters
  loadReservations();
  setupEventListeners();
}

function loadReservationsForChekIn(reservations) {
  const table = document.getElementById("reservationsTable");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing rows

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
            <button class="list-btns" data-id="${reservation.id}" 
                    style="background: #b25c2a; color: white; border: none; padding: 8px 10px; border-radius: 4px; margin-right: 5px;">Checked In</button>
          </td>
        `;
    tbody.appendChild(row);
  });
}

// Render reservations table
function renderReservationsTable(reservations) {
  const table = document.getElementById("reservationsTable");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing rows

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
            <button class="list-btns" data-id="${reservation.id}" 
                    style="background: #b25c2a; color: white; border: none; padding: 8px 10px; border-radius: 8px; margin-right: 5px; cursor: pointer;">Update</button>
            <button class="list-btns" data-id="${reservation.id}"
                    style="background: #3c3226; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer;">Cancel</button>
          </td>
        `;
    tbody.appendChild(row);
  });

  // Attach event listeners to the buttons in the table
  attachTableEventListeners();
}

// Attach event listeners to the buttons in the reservations table
function attachTableEventListeners() {
  document.querySelectorAll(".list-btns").forEach((btn) => {
    if (btn.textContent === "Update") {
      btn.addEventListener("click", async () => {
        const reservationId = btn.dataset.id;
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

          updateReservationId.textContent = btn.dataset.id;
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
    }else if (btn.textContent === "Edit") {
      btn.addEventListener("click", async () => {
        const userId = btn.dataset.id;
        try {
          // Fetch reservation details
          const response = await fetch(
              `http://localhost:8080/api/user/returnable/${userId}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }
          );

          if (!response.ok) throw new Error("Failed to fetch User");
          const user = await response.json();

          // Populate the form fields with user's data
          document.getElementById("updateUsername").value = user.username;
          document.getElementById("updateUserEmail").value = user.email;
          document.getElementById("updateUserDate").value = user.birthyear;
          document.getElementById("updateUserRole").value = user.role;

          editUserId.textContent = user.id;
          editModal.style.display = "block";
        } catch (error) {
          console.error("Error fetching User details:", error);
          alert("Failed to fetch User details. Please try again.");
        }
      });
    }
  });
}

// When the user clicks on <span> (x), close the modal
closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    updateModal.style.display = "none";
    cancelModal.style.display = "none";
    editModal.style.display = "none";
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
  if (event.target === editModal) {
    editModal.style.display = "none";
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

// Confirm Edit button
document.getElementById("confirmEdit").addEventListener("click", async () => {
  const userId = editUserId.textContent;

  // Get updated data from the form
  const updatedData = {
    id: userId,
    username: document.getElementById("updateUsername").value,
    email: document.getElementById("updateUserEmail").value,
    birthyear: document.getElementById("updateUserDate").value,
    role: document.getElementById("updateUserRole").value,
  };

  try {
    // Send the updated data to the server
    const response = await fetch(
        `http://localhost:8080/api/user/update/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
    );

    if (!response.ok) throw new Error("Failed to update User");

    alert("User updated successfully!");
    updateModal.style.display = "none";
    await loadUsers();
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to update User. Please try again.");
  }
});
