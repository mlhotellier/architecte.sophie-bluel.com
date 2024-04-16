const form = document.querySelector("#form-connexion");
const dialog = document.querySelector("dialog");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorServer = document.getElementById("errorServer")
let errorDisplayed = false; // Ajoutez cette variable pour suivre l'état de l'affichage de l'erreur

form.addEventListener("submit", function (event) {
  // On empêche le comportement par défaut
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  

  // Validation de l'email avant l'envoi
  if (!isValidEmail(email)) {
    // Affichez un message d'erreur ou effectuez une autre action appropriée
    console.log("L'email n'est pas valide");
    return; // Arrêtez le traitement du formulaire si l'email n'est pas valide
  }

  // Création de l’objet du formulaire.
  const datas = {
    email: email,
    password: password,
  };
  // Création du body au format JSON
  const dataBody = JSON.stringify(datas);

  // Appel de la fonction fetch avec toutes les informations nécessaires
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
        if (!errorDisplayed) { // Vérifiez si le message d'erreur n'est pas déjà affiché
          dialog.classList.add("visible");
          errorDisplayed = true; // Marquez que le message d'erreur est affiché
        }
      }
    })
    .catch((error) => {
      if (!errorDisplayed) { // Vérifiez si le message d'erreur n'est pas déjà affiché
        const noDataText = document.createElement("p");
        const noDataTextRefresh = document.createElement("a");
        errorServer.classList.add("visible");
        errorServer.style.marginBottom = "20px";
        errorServer.style.textAlign = "center";
        noDataText.innerText= "Connexion impossible. Impossible d'obtenir une réponse du serveur.";
        noDataText.style.marginBottom = "10px";
        noDataTextRefresh.innerText ="Rafraîchir la page"
        noDataTextRefresh.href = window.location.href;
        errorServer.appendChild(noDataText);
        errorServer.appendChild(noDataTextRefresh)
        errorDisplayed = true;
      }
    });
});
// Fonction pour valider l'email à l'aide d'une expression régulière (optionnel)
function isValidEmail(email) {
  let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  if (emailRegExp.test(email)) {
    return true;
  }
  return false;
}


[emailInput, passwordInput].forEach(
  (inputForm) => {
    inputForm.addEventListener("input", hideDialog);
  });

// Fonction pour masquer la boîte de dialogue
function hideDialog() {
  dialog.classList.remove("visible");
}
