// Constantes pour les URLs de l'API
const apiWorks = "http://localhost:5678/api/works";
const apiCategories = "http://localhost:5678/api/categories";

// Variables globales
const filter = document.querySelector(".filter");
const gallery = document.querySelector(".gallery");

/***** WORKS *****/
// Récupérer les works depuis l'API
async function getWorks() {
  const reponse = await fetch(apiWorks);
  return await reponse.json();
}
getWorks();

// Afficher les works sur la page
async function displayWorks() {
  const works = await getWorks();
  works.forEach((work) => {
    createWorks(work);
  });
}
displayWorks();

// Créer la structure des works
function createWorks(work) {
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
}

/***** CATEGORIES *****/
// Récupérer les catégories depuis l'API
async function getCategories() {
  const reponse = await fetch(apiCategories);
  return await reponse.json();
}
getCategories();

// Fonction qui permet d'afficher les catégories sur la page
async function displayCategories() {
  const categories = await getCategories();
  // console.log(categories);
  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.innerText = categorie.name;
    button.id = categorie.id;
    filter.appendChild(button);
  });
}
displayCategories();

// Fonction qui permet de filtrer les works par catégorie
async function filterCategoy() {
  const allWorks = await getWorks();
  // console.log(allWorks);

  // Ajouter un bouton "Tous" en premier
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
  });
  filter.insertBefore(allButton, filter.firstChild);

  // Ajouter les autres boutons de filtrage
  const buttons = document.querySelectorAll(".filter button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Supprimer la classe 'active-filter' de tous les boutons de filtrage
      document.querySelectorAll(".filter button").forEach((btn) => {
        btn.classList.remove("active-filter");
      });

      // Ajouter la classe 'active-filter' au bouton cliqué
      button.classList.add("active-filter");

      btnId = event.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const worksByCategory = allWorks.filter((work) => {
          return work.categoryId == btnId;
        });
        worksByCategory.forEach((work) => {
          createWorks(work);
        });
      } else {
        displayWorks();
      }
    });
  });
}
filterCategoy();

/***** *****/
/***** *****/
/***** Mode edition *****/
/***** *****/
/***** *****/

const token = window.localStorage.getItem("token");
const userId = window.localStorage.getItem("userId");
const modalGallery = document.querySelector(".modal-gallery");

// Fonction qui permet d'afficher toute les fonctionnalités du mode admin
function modeAdmin() {
  const logLink = document.querySelector("#logLink");
  // console.log(logLink)
  logLink.innerText = "Logout";
  logLink.addEventListener("click", function () {
    // Effacer le token du localStorage
    window.localStorage.removeItem("token");
  });

  const topbar = document.querySelector("#topbar");
  // console.log(topbar);
  topbar.classList.remove("hidden");
  const header = document.getElementById("header");
  header.style.paddingTop = "calc(38px + 59px)";

  const modifyLink = document.querySelector("#modifyLink");
  // console.log(modifyLink);
  modifyLink.classList.remove("hidden");
}

/***** Modal *****/

// Fonction d'ouverture de la modal
function openModal() {
  const btnOpenModal = document.getElementById("modifyLink");

  btnOpenModal.onclick = function () {
    modal.style.display = "flex";
  };
}
openModal();

// Fonction de fermeture de la modal
function closeModal() {
  const btnCloseModal = document.getElementById("btnCloseModal");

  // Si l'utilisateur clique sur sur le bouton fermer
  btnCloseModal.onclick = function () {
    modal.style.display = "none";
  };

  // Si l'utilisateur clique en dehors de la zone de la modale
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
closeModal();

//Affichage des works dans la modal
async function displayWorksInModal() {
  modalGallery.innerHTML = "";
  const allWorks = await getWorks();
  // (allWorks);

  // Pour chaque travail récupéré depuis l'API
  allWorks.forEach((work) => {
    // Créer un élément figure
    const figure = document.createElement("figure");

    // Créer un élément img avec l'URL du travail comme src
    const img = document.createElement("img");
    img.src = work.imageUrl; // Assurez-vous que votre API renvoie l'URL de l'image
    img.alt = work.title;

    // Créer un élément <span>+<i> pour l'icône de suppression
    const spanDeleteIcon = document.createElement("span");
    spanDeleteIcon.id = "#btnDeleteWork" + work.id;
    const icon = document.createElement("i");

    // Ajoutez les classes pour l'icône trash can
    icon.className = "fa-solid fa-trash-can";

    // Ajouter l'icône de suppression au span
    spanDeleteIcon.appendChild(icon);

    // Ajouter le span à l'image
    figure.appendChild(spanDeleteIcon);

    // Ajouter l'image à la figure
    figure.appendChild(img);

    // Ajouter la figure à la galerie
    modalGallery.appendChild(figure);
  });
  deleteWork();
}
displayWorksInModal();

// Fonction de supprimer d'un travail dans la modal
function deleteWork() {
  const allDeleteIcon = document.querySelectorAll(".fa-trash-can");
  // console.log(allDeleteIcon);
  allDeleteIcon.forEach((icon) => {
    icon.addEventListener("click", async () => {
      // Récupérer l'ID du travail associé à l'icône de suppression
      const id = icon.parentElement.id.replace("#btnDeleteWork", "");

      // Envoyer une requête DELETE à l'API pour supprimer le travail
      fetch(`${apiWorks}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajoutez le token d'authentification
        },
      })
        .then((response) => {
          // Vérifier si la suppression a réussi
          if (!response.ok) {
            throw new Error("La suppression du travail a échoué");
          }
          icon.parentElement.parentElement.remove();
          updateWorkList();
          alert(`Le travail avec l'ID ${id} a été supprimé avec succès.`);
        })
        .catch((error) => {
          console.error(
            "Une erreur est survenue lors de la suppression du travail :",
            error
          );
        });
    });
  });
}


// Fonction qui permet d'afficher le formulaire d'ajout de works et cache la modal avec la liste des travaux
function displayFormAddPhoto() {
  const btnAddPhoto = document.getElementById("btnAddPhoto");

  // Ajouter un gestionnaire d'événements pour le clic sur le bouton "Ajouter une photo"
  btnAddPhoto.addEventListener("click", function () {
    // Ouvrir un formulaire pour ajoute une travail
    modalWorks.style.display = "none";
    modalAddWork.style.display = "block";

    // Retour à la page précédente
    const returnBtn = document.getElementById("returnBtn");
    returnBtn.addEventListener("click", function () {
      modalWorks.style.display = "block";
      modalAddWork.style.display = "none";
    });
  });
  postNewphoto();
}
displayFormAddPhoto();

// Fonction qui permet d'ajouter une photo
async function postNewphoto() {
  const formAddPhoto = document.querySelector("#formAddPhoto");
  const inputPhotoAddPhoto = document.getElementById("photo");
  const inputTitreAddPhoto = document.getElementById("titre");
  const inputCategorieAddPhoto = document.getElementById("categorie");
  const imagePreview = document.getElementById("imagePreview");
  const categories = await getCategories();
  const labelPhotoUploaded = document.getElementById("photoUploaded");



  // Créer une option vide par défaut
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = ""; // Texte par défaut
  inputCategorieAddPhoto.appendChild(defaultOption);

  categories.forEach((categorie) => {
    // Créer une nouvelle option pour chaque catégorie
    const option = document.createElement("option");
    option.value = categorie.id; // Valeur de l'option
    option.textContent = categorie.name; // Texte de l'option
    // Ajouter l'option à l'élément select
    inputCategorieAddPhoto.appendChild(option);
  });

  inputPhotoAddPhoto.addEventListener("change", function () {
    const file = inputPhotoAddPhoto.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        imagePreview.src = reader.result;
        imagePreview.style.display = "block";
        labelPhotoUploaded.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "#";
      imagePreview.style.display = "none";
      labelPhotoUploaded.style.display = "flex";
    }
  });

  // Ajouter un gestionnaire d'événements pour surveiller les changements dans les champs du formulaire
  [inputPhotoAddPhoto, inputTitreAddPhoto, inputCategorieAddPhoto].forEach(
    (input) => {
      input.addEventListener("input", function () {
        // Vérifier si les trois champs sont remplis
        if (
          inputPhotoAddPhoto.value.trim() !== "" &&
          inputTitreAddPhoto.value.trim() !== "" &&
          inputCategorieAddPhoto.value.trim() !== ""
        ) {
          // Si tous les champs sont remplis, ajouter la classe CSS "validate" au bouton de soumission
          btnSubmitFormAdd.classList.add("validate");
        } else {
          // Sinon, retirer la classe CSS "validate" du bouton de soumission
          btnSubmitFormAdd.classList.remove("validate");
        }
      });
    }
  );

  // Ajouter un gestionnaire d'événements pour l'événement de soumission du formulaire
  formAddPhoto.addEventListener("submit", function (event) {
    // Empêcher le comportement par défaut du formulaire (rechargement de la page)
    event.preventDefault();

    // Récupérer la valeur sélectionnée dans le menu déroulant des catégories
    const titleNewWork = document.getElementById("titre").value;
    const selectedCategory = document.getElementById("categorie").value;
    const image = document.getElementById("photo").files[0];
    const btnSubmitFormAdd = document.querySelector(".validate")


    // Créer un nouvel objet FormData
    const formData = new FormData();
    formData.append('title', titleNewWork);
    formData.append('category', selectedCategory);
    formData.append('image', image);

    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch(`${apiWorks}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ajoutez le token d'authentification
       },
      body: formData ,
    })
      .then((response) => {
        // Vérifier si la suppression a réussi
        if (!response.ok) {
          throw new Error("La suppression du travail a échoué");
        }
        updateWorkList();
        alert(`Le travail "${titleNewWork}" a été ajouté avec succès à la catégorie ${selectedCategory}.`);
        // Vider les champs du formulaire après l'envoi réussi
        inputTitreAddPhoto.value = '';
        inputCategorieAddPhoto.value = '';
        inputPhotoAddPhoto.value = '';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        btnSubmitFormAdd.classList.remove("validate");
        labelPhotoUploaded.style.display = "flex";
      })
      .catch((error) => {
        console.error(
          "Une erreur est survenue lors de l'ajout du travail :",
          error
        );
      });
  });

  
}

// Fonction pour vérifier si le formulaire est identique à un travail déjà existant
function isDuplicateWork(title, categoryId, works) {
  return works.some((work) => work.title === title && work.categoryId === categoryId);
}

// Fonction qui permet de mettre à jour la liste des works si suppression d'un
// Fonctionne sur la page d'acceuil & dans la modal
async function updateWorkList() {
  const works = await getWorks();
  gallery.innerHTML = ""; // Effacer le contenu actuel de la galerie
  // Afficher les travaux mis à jour sur la page
  works.forEach((work) => {
    createWorks(work);
  });
}

/******/
/******/
/***** Test pour savoir si l'utilisateur est connecté *****/
/******/
/******/
function checkAuthentication() {
  if (token) {
    modeAdmin();
  }
}
checkAuthentication();
