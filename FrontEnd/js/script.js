// Remplacez l'URL par l'API que vous souhaitez intégrer
const apiWorks = "http://localhost:5678/api/works";
const apiCategories = "http://localhost:5678/api/categories";

// Utilisation de la variable globale allWorks pour qu'elle soit accessible de partout
let allWorks;

// Récupération de la div où va s'intégrer le contenu
const filter = document.querySelector(".filter");
const gallery = document.querySelector(".gallery");

// Récuperer les works
fetch(apiWorks)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Réponse du réseau non valide");
    }
    return response.json();
  })
  .then((works) => {
    // Assigner les travaux récupérés depuis l'API à la variable works
    allWorks = works;
    console.log("***** allWorks *****", allWorks);
    // Afficher tous les travaux
    displayWorks(allWorks);
  })
  .catch((error) => {
    console.error(
      "Un problème est survenu lors de votre opération fetch :",
      error
    );
  });

// Récuperer les catégories
fetch(apiCategories)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Réponse du réseau non valide");
    }
    return response.json();
  })
  .then((categories) => {
    console.log("***** categories *****", categories);

    // Ajouter un bouton "Tous"
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.classList.add("active-filter");
    allButton.addEventListener("click", function () {
      // Supprimer la classe 'active-filter' de tous les boutons de filtrage
      document.querySelectorAll(".filter button").forEach((btn) => {
        btn.classList.remove("active-filter");
      });

      // Ajouter la classe 'active-filter' au bouton "Tous"
      allButton.classList.add("active-filter");

      // Afficher tous les travaux
      displayWorks(allWorks);
      console.log("***** Works :", allButton.innerText, " *****", allWorks);
    });
    filter.appendChild(allButton);

    for (let i = 0; i < categories.length; i++) {
      // Créer un élément button
      const button = document.createElement("button");
      button.innerText = categories[i].name;

      // Ajouter un gestionnaire d'événements 'click' au bouton
      button.addEventListener("click", function () {
        // Récupérer le texte du bouton cliqué
        const buttonText = button.innerText;

        // Supprimer la classe 'active-filter' de tous les boutons de filtrage
        document.querySelectorAll(".filter button").forEach((btn) => {
          btn.classList.remove("active-filter");
        });

        // Ajouter la classe 'active-filter' au bouton cliqué
        button.classList.add("active-filter");

        // Vérifier si les travaux ont été récupérés
        if (allWorks) {
          // Filtrer les travaux en fonction de la catégorie cliquée
          const filteredWorks = allWorks.filter(
            (work) => work.category.name === buttonText
          );

          // Afficher les travaux filtrés
          displayWorks(filteredWorks);
          console.log(
            "***** Works :",
            filteredWorks[i].category.name,
            " *****",
            filteredWorks
          );
        }
      });

      // Ajouter la button à la div
      filter.appendChild(button);
    }
  })
  .catch((error) => {
    console.error(
      "Un problème est survenu lors de votre opération fetch :",
      error
    );
  });

// Fonction qui permet d'afficher les travaux
function displayWorks(works) {
  // Effacer la galerie
  gallery.innerHTML = "";

  // Pour chaque travail récupéré depuis l'API
  works.forEach((work) => {
    // Créer un élément figure
    const figure = document.createElement("figure");

    // Créer un élément img avec l'URL du travail comme src
    const img = document.createElement("img");
    img.src = work.imageUrl; // Assurez-vous que votre API renvoie l'URL de l'image
    img.alt = work.title; // Assurez-vous que votre API renvoie le titre de l'image
    figure.appendChild(img);

    // Créer un élément figcaption avec le titre du travail comme texte
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title; // Assurez-vous que votre API renvoie le titre du travail
    figure.appendChild(figcaption);

    // Ajouter la figure à la galerie
    gallery.appendChild(figure);
  });
}

// ***
// Mode édition
// ***

// Récupération du token
const token = window.localStorage.getItem("token");

// Vérification si le token a été correctement récupéré
if (token) {
  // console.log(token)
  const logLink = document.querySelector('#logLink');
  console.log(logLink)
  logLink.innerText = "Logout";
    logLink.addEventListener("click", function() {
      // Effacer le token du localStorage
      window.localStorage.removeItem("token");

      // Rafraîchir la page actuelle
      window.location.reload();
    });
  
  const topbar = document.querySelector("#topbar");
  console.log(topbar);
  topbar.classList.remove("hidden");

  const modifyLink = document.querySelector("#modifyLink")
  console.log(modifyLink);
  modifyLink.classList.remove("hidden");

} else{
  console.error("Aucun token trouvé dans le localStorage. L'utilisateur n'est pas connecté.");
}


