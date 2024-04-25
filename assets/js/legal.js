// Global constants
const token = window.localStorage.getItem("token");
const userId = window.localStorage.getItem("userId");
const apiWorks = "http://localhost:5678/api/works";

// Async function to get works from the API
async function getWorks() {
  try {
    const response = await fetch(apiWorks);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des travaux");
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

// Function which allows you to display all the functionalities of admin mode
function modeAdmin() {
  const logLink = document.getElementById("logLink");
  if (logLink) {
    logLink.innerText = "logout";
    logLink.addEventListener("click", function (event) {
      const confirmLogout = confirm(
        "Êtes-vous sûr de vouloir vous déconnecter ?"
      );
      if (confirmLogout) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userId");
      } else {
        event.preventDefault();
      }
    });
  }

  const topbar = document.getElementById("topbar");
  if (topbar) {
    topbar.classList.remove("hidden");
  }

  const header = document.getElementById("header");
  if (header) {
    header.style.paddingTop = "calc(38px + 59px)";
  }
}

// Async function to test if the server is accessible
async function checkServerResponse() {
  try {
    const works = await getWorks();
    if (works.length === 0) {
      throw new Error(
        "Impossible de joindre le serveur. Veuillez réessayer plus tard."
      );
    }
  } catch (error) {
    if (token) {
      alert(error.message);
    }
  }
}
checkServerResponse();

// Async function to test if the user is logged in
async function checkAuthentication() {
  if (token) {
    modeAdmin();
  }
}
checkAuthentication();
