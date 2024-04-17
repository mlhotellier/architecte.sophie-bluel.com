// Get works from the API
const apiWorks = "http://localhost:5678/api/works";
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

// Admin mode global variables
const token = window.localStorage.getItem("token");
const userId = window.localStorage.getItem("userId");

// Function which allows you to display all the functionalities of admin mode
function modeAdmin() {
    const logLink = document.querySelector("#logLink");
    logLink.innerText = "logout";
    logLink.addEventListener("click", function (event) {
      // Demande de confirmation avant de déconnecter l'utilisateur
      const confirmLogout = confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
      if (confirmLogout) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userId");
      } else {
        event.preventDefault(); // Annuler l'action par défaut du lien
      }
    });
  
    const topbar = document.querySelector("#topbar");
    topbar.classList.remove("hidden");
  
    const header = document.getElementById("header");
    header.style.paddingTop = "calc(38px + 59px)";
  }

/******/
/******/
/***** Test to see if the server is accessible *****/
/******/
/******/

async function checkServerResponse() {
    try {
      const works = await getWorks();
      if (works.length === 0){
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
  
  /******/
  /******/
  /***** Test to see if the user is logged in *****/
  /******/
  /******/
  async function checkAuthentication() {
    if (token) {
      modeAdmin();
    }
  }
  checkAuthentication();