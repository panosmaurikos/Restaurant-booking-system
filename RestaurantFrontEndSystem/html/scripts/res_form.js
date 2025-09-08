"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  await verifyUser();
});
const reservationDetails = JSON.parse(
  localStorage.getItem("reservationDetails")
);

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const formBtn = document.getElementById("confirmForm");
const backBtn = document.getElementById("back-page");
const birthDiv = document.querySelector(".birth");
const profileCheckbox = document.querySelector('input[name="profile"]');

let id;
let username;
let email;

let isAuthenticated = false;
const welcomeMessage = document.getElementById("welcome-message");

async function verifyUser() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/verify", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const isConnectedLabel = document.querySelector(".isConnected");
    const surnameField = document.getElementById("surname");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");

    if (response.ok) {
      const data = await response.json();

      isAuthenticated = true;
      id = data.user.id;
      username = data.user.username;
      email = data.user.email;

      console.log(email);

      welcomeMessage.textContent = `Welcome, ${username}`;
      loginBtn.style.display = "none";
      registerBtn.style.display = "none";
      logoutBtn.style.display = "block";
      isConnectedLabel.style.display = "none";
      surnameField.style.display = "none";
      nameField.style.display = "none";
      emailField.style.display = "none";

      surnameField.removeAttribute("required");
      nameField.removeAttribute("required");
      emailField.removeAttribute("required");
    } else {
      loginBtn.style.display = "block";
      registerBtn.style.display = "block";
      logoutBtn.style.display = "none";
      welcomeMessage.textContent = "";
      isConnectedLabel.style.display = "block";
      surnameField.style.display = "block";
      nameField.style.display = "block";
      emailField.style.display = "block";
    }
  } catch (error) {
    //console.error("Network Error:", error);
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";
    welcomeMessage.textContent = "";

    document.querySelector(".isConnected").style.display = "block";
    const surname = document.getElementById("surname");
    const name = document.getElementById("name");
    const email = document.getElementById("email");

    surname.style.display = "block";
    name.style.display = "block";
    email.style.display = "block";
  }
}

async function logout() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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

async function reservationFields() {
  let people,
    userId,
    tableNumber,
    date,
    time,
    surname,
    name,
    phone,
    notes,
    createAccount,
    birthDate;

  if (isAuthenticated) {
    people = reservationDetails.people;
    userId = id;
    tableNumber = 12;
    date = reservationDetails.date;
    time = reservationDetails.time;
    surname = username;
    name = username;
    phone = document.getElementById("phone").value.trim();
    email = email;
    notes = document.getElementById("notes").value.trim();
    createAccount = false;
  } else {
    people = reservationDetails.people;
    userId = null;
    tableNumber = reservationDetails.table;
    date = reservationDetails.date;
    time = reservationDetails.time;
    surname = document.getElementById("surname").value.trim();
    name = document.getElementById("name").value.trim();
    phone = document.getElementById("phone").value.trim();
    email = document.getElementById("email").value.trim();
    notes = document.getElementById("notes").value.trim();
    createAccount = document.querySelector('input[name="profile"]').checked;
    birthDate = document.getElementById("birthDate").value;
  }

  const fields = {
    tableNumber: tableNumber,
    userId: userId,
    people: parseInt(people),
    surname: surname,
    name: name,
    phone: phone,
    email: email,
    notes: notes,
    date: date,
    time: time,
    createAccount: createAccount,
    birthDate: birthDate,
  };

  await confirm(fields);
}

async function confirm(fields) {
  try {
    const response = await fetch(
      "http://localhost:8080/api/reservation/savereservation",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const reservationId = data.id;
      alert("Reservation Confirmed");
      window.location.href = `/pages/verification.html?reservationId=${reservationId}`;
    } else {
      alert("Failed");
    }
  } catch (error) {
    console.error(error);
  }
}

logoutBtn.addEventListener("click", logout);
backBtn.addEventListener("click", () => {
  window.location.href = "/pages/selection.html";
});

formBtn.addEventListener("submit", async function (event) {
  event.preventDefault();
  await reservationFields();
});

profileCheckbox.addEventListener("change", () => {
  if (profileCheckbox.checked) {
    birthDiv.style.display = "block";
  } else {
    birthDiv.style.display = "none";
  }
});
