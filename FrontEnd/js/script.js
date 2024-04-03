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
    // console.log("***** allWorks *****", allWorks);
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
    //console.log("***** categories *****", categories);

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
      //console.log("***** Works :", allButton.innerText, " *****", allWorks);
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
          //console.log("***** Works :",filteredWorks[i].category.name," *****",filteredWorks);
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
// ***
// ***
//
// Mode édition
//
// ***
// ***
// ***

const modalGallery = document.querySelector(".modal-gallery");
const modalWorks = document.getElementById("modalWorks")
const modalAddWork = document.getElementById("modalAddWork")

// Récupération du token
const token = window.localStorage.getItem("token");

// Vérification si le token a été correctement récupéré
if (token) {
  // console.log(token)
  const logLink = document.querySelector('#logLink');
  // console.log(logLink)
  logLink.innerText = "Logout";
    logLink.addEventListener("click", function() {
      // Effacer le token du localStorage
      window.localStorage.removeItem("token");

      // Rafraîchir la page actuelle
      window.location.reload();
    });
  
  const topbar = document.querySelector("#topbar");
  // console.log(topbar);
  topbar.classList.remove("hidden");
  const header = document.getElementById("header")
  header.style.paddingTop ="calc(38px + 59px)"


  const modifyLink = document.querySelector("#modifyLink")
  // console.log(modifyLink);
  modifyLink.classList.remove("hidden");

  const modal = document.getElementById("modal")
  const btnOpenModal = document.getElementById("modifyLink");
  const btnCloseModal = document.getElementById("btnCloseModal");
  
  // Fonction d'ouverture de la modal
  btnOpenModal.onclick = function() {
    modal.style.display = "flex";
    displayWorksInModal(allWorks)
  }

  // Fonction de fermeture de la modal
  btnCloseModal.onclick = function() {
    modal.style.display = "none";
    removeWorksInModal();
  }
    // Fonction qui ferme la modal si l'utilisateur clique en dehors de la zone de la modale
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        removeWorksInModal();
      }
    }
  
  // Cibler le bouton "Ajouter une photo"
  const btnAddPhoto = document.getElementById("btnAddPhoto");

  // Ajouter un gestionnaire d'événements pour le clic sur le bouton "Ajouter une photo"
  btnAddPhoto.addEventListener("click", function() {
      console.log("Ajouter une photo cliqué !");
      // Ouvrir un formulaire pour ajoute une travail
      displayFormAddPhoto() 
      // POST api/works
  });

} else{
  console.error("Aucun token trouvé dans le localStorage. L'utilisateur n'est pas connecté.");
}


// Fonction qui permet d'afficher les travaux dans la modal
function displayWorksInModal(works) {
  // Pour chaque travail récupéré depuis l'API
  works.forEach((work) => {
    // Créer un élément figure
    const figure = document.createElement("figure");

    // Créer un élément img avec l'URL du travail comme src
    const img = document.createElement("img");
    img.src = work.imageUrl; // Assurez-vous que votre API renvoie l'URL de l'image
    
    
    // Ajouter l'image à la figure
    figure.appendChild(img);

    // Créer un élément <span>+<i> pour l'icône de suppression
    const spanDeleteIcon = document.createElement("span")
    spanDeleteIcon.id = "#btnDeleteWork"+work.id;
    const icon = document.createElement("i");
  
    // Ajoutez les classes pour l'icône trash can
    icon.className = "fa-solid fa-trash-can";

    // Ajouter l'icône de suppression au span
    spanDeleteIcon.appendChild(icon);

    // Ecouter l'évènement click du span
    spanDeleteIcon.addEventListener("click", function() {
        console.log("Bouton ",work.id," cliqué ", work.title);
        // Supprimer un travail 
        // DELETE api/works/:id
    });


    // Ajouter le span à l'image
    figure.appendChild(spanDeleteIcon)


    // Ajouter la figure à la galerie
    modalGallery.appendChild(figure);
  });
}

// Fonction qui permet de supprimer les travaux à la fermeture de la modal
function removeWorksInModal() {
  // Sélectionnez tous les éléments figure enfants de modalGallery et supprimez-les
  const figures = modalGallery.querySelectorAll("figure");
  figures.forEach(figure => {
      figure.remove();
  });
}


// Fonction qui permet d'afficher le formulaire d'ajout de travaux et cache la modal avec les travaux
function displayFormAddPhoto() {
  modalWorks.style.display = "none";
  modalAddWork.style.display = "block";

  // Retour à la page précédente
  const returnBtn = document.getElementById("returnBtn")
  returnBtn.addEventListener("click", function() {
    console.log("ici");
    modalWorks.style.display = "block";
    modalAddWork.style.display = "none";
  })

}