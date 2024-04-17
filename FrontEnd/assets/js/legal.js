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
    // Utilisation de getElementById pour sélectionner l'élément avec l'ID "logLink"
    const logLink = document.getElementById("logLink");
    if (logLink) {
        logLink.innerText = "logout";
        logLink.addEventListener("click", function (event) {
            const confirmLogout = confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
            if (confirmLogout) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("userId");
            } else {
                event.preventDefault();
            }
        });
    }
  
    // Utilisation de getElementById pour sélectionner l'élément avec l'ID "topbar"
    const topbar = document.getElementById("topbar");
    if (topbar) {
        topbar.classList.remove("hidden");
    }
  
    // Utilisation de getElementById pour sélectionner l'élément avec l'ID "header"
    const header = document.getElementById("header");
    if (header) {
        header.style.paddingTop = "calc(38px + 59px)";
    }
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