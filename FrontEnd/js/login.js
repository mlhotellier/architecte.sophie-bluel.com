const form = document.querySelector("#form-connexion");
form.addEventListener("submit", function (event) {
  // On empêche le comportement par défaut
  event.preventDefault();

  // Récupérer les valeurs des champs email et mot de passe
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Vérifier si les champs sont remplis
  if (email.trim() === "" || password.trim() === "") {
    alert("Veuillez remplir tous les champs.");
    return; // Arrêter l'exécution de la fonction si les champs ne sont pas remplis
  }

  // Validation de l'email (optionnel)
  if (!isValidEmail(email)) {
    alert("Veuillez saisir une adresse email valide.");
    return; // Arrêter l'exécution de la fonction si l'email n'est pas valide
  }

  // Création de l’objet du formulaire.
  const datas = {
    email: email,
    password: password,
  };
  // Création de la charge utile au format JSON
  const chargeUtile = JSON.stringify(datas);
  // console.log(chargeUtile)

  // Appel de la fonction fetch avec toutes les informations nécessaires
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: chargeUtile,
  })
    .then((response) => {
      if (response.ok) {
        // Si la requête a réussi, vous pouvez faire quelque chose comme afficher un message à l'utilisateur
        console.log("Connexion réussi avec succès !");
        response.json().then((data) => {
            localStorage.setItem("token", data.token); //Store token
            localStorage.setItem("userId", data.userId); //STORE userId
            window.location.replace("index.html");
        });
      } else {
        // Si la requête échoue, vous pouvez afficher un message d'erreur à l'utilisateur
        console.error("Échec de la connexion.");
        // Sélectionner la balise dialog dans le code html
        const dialog = document.querySelector("dialog");
        // Ajouter une class CSS pour rentrer visible le message d'erreur
        dialog.classList.add("visible");
      }
    })
    .catch((error) => {
      // Gestion des erreurs de la requête fetch, par exemple, problème de réseau, serveur inaccessible, etc.
      console.error(
        "Une erreur s'est produite lors de l'envoi du formulaire :",
        error
      );
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
