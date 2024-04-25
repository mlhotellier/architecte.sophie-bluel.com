// Global variables and constants
const form = document.getElementById("form-connexion");
const dialog = document.getElementsByTagName("dialog")[0];
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorServer = document.getElementById("errorServer")
let errorDisplayed = false;

// Function to validate email using a regular expression
function isValidEmail(email) {
  let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  return emailRegExp.test(email);
}

// Function to hide dialog
function hideDialog() {
  dialog.classList.remove("visible");
}

// Function to send fetch request on API
function sendResquest(email, password) {
  // Create JSON body
  const dataBody = JSON.stringify({ email, password });

  // Fetch request
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: dataBody,
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          localStorage.setItem("token", data.token); // Store token
          localStorage.setItem("userId", data.userId); // Store userId
          window.location.replace("index.html");
        });
      } else {
        if (!errorDisplayed) {
          dialog.classList.add("visible");
          errorDisplayed = true;
        }
      }
    })
    .catch((error) => {
      if (!errorDisplayed) {
        const noDataText = document.createElement("p");
        const noDataTextRefresh = document.createElement("a");
        errorServer.classList.add("visible");
        errorServer.style.marginBottom = "20px";
        errorServer.style.textAlign = "center";
        noDataText.innerText = "Connexion impossible. Impossible d'obtenir une réponse du serveur.";
        noDataText.style.marginBottom = "10px";
        noDataTextRefresh.innerText = "Rafraîchir la page"
        noDataTextRefresh.href = window.location.href;
        errorServer.appendChild(noDataText);
        errorServer.appendChild(noDataTextRefresh)
        errorDisplayed = true;
      }
    });
}

// Function to handle form submission event
function loginFormSubmit(event) {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!isValidEmail(email)) {
    return;
  }

  sendResquest(email, password);
}

// Add event listener for form submission on submit
form.addEventListener("submit", loginFormSubmit);

// Function to add input event listeners
function listenInputs() {
  [emailInput, passwordInput].forEach((inputForm) => {
    inputForm.addEventListener("input", () => {
      hideDialog();
      errorDisplayed = false;
    });
  });
}
listenInputs();
