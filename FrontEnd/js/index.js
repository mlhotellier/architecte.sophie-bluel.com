// Constants for API URLs
const apiWorks = "http://localhost:5678/api/works";
const apiCategories = "http://localhost:5678/api/categories";

// Global variables
const filter = document.querySelector(".filter");
const gallery = document.querySelector(".gallery");
let btnId;

/***** WORKS *****/
// Get works from the API
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

// Build structure element of works
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

// Display works on gallery
async function displayWorks() {
  const works = await getWorks();
  gallery.innerHTML = "";
  works.forEach((work) => {
    createWorks(work);
  });
}

/***** CATEGORIES *****/
// Get categories from the API
async function getCategories() {
  try {
    const response = await fetch(apiCategories);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des travaux");
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

// Function that allows you to filter works by category
async function filterCategory() {
  const allWorks = await getWorks();

  const buttons = document.querySelectorAll(".filter button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      document.querySelectorAll(".filter button").forEach((btn) => {
        btn.classList.remove("active-filter");
      });

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
        displayWorks(allWorks);
      }
    });
  });
}

// Display categories on gallery
async function displayCategories() {
  const categories = await getCategories();
  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.innerText = categorie.name;
    button.id = categorie.id;
    filter.appendChild(button);
  });

  // Create and add in first the "All" button
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.classList.add("active-filter");
  allButton.id = "0";
  filter.insertBefore(allButton, filter.firstChild);

  filterCategory();
}

/***** *****/
/***** *****/
/***** Admin Mode *****/
/***** *****/
/***** *****/

// Admin mode global variables
const token = window.localStorage.getItem("token");
const userId = window.localStorage.getItem("userId");
const modalGallery = document.querySelector(".modal-gallery");

// Function which allows you to display all the functionalities of admin mode
function modeAdmin() {
  const logLink = document.querySelector("#logLink");
  logLink.innerText = "logout";
  logLink.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userId");
  });

  const topbar = document.querySelector("#topbar");
  topbar.classList.remove("hidden");

  const header = document.getElementById("header");
  header.style.paddingTop = "calc(38px + 59px)";

  const modifyLink = document.querySelector("#modifyLink");
  modifyLink.classList.remove("hidden");
}

/***** Modal *****/

// Modal global variables
const inputPhotoAddPhoto = document.getElementById("photo");
const formAddPhoto = document.querySelector("#formAddPhoto");
const inputTitreAddPhoto = document.getElementById("titre");
const inputCategorieAddPhoto = document.getElementById("categorie");
const imagePreview = document.getElementById("imagePreview");
const labelPhotoUploaded = document.getElementById("photoUploaded");

// Open modal function
function openModal() {
  const btnOpenModal = document.getElementById("modifyLink");

  btnOpenModal.onclick = function () {
    modal.style.display = "flex";
  };
}
openModal();

// Close modal function
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

// Display works in modal
async function displayWorksInModal() {
  modalGallery.innerHTML = "";
  const allWorks = await getWorks();
  allWorks.forEach((work) => {
    createWorksInModal(work);
  });
  deleteWork();
}
displayWorksInModal();

// Fonction qui crée la structure des works dans la modal
function createWorksInModal(work) {
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
}

// Fonction de supprimer d'un travail dans la modal
function deleteWork() {
  const allDeleteIcon = document.querySelectorAll(".fa-trash-can");
  allDeleteIcon.forEach((icon) => {
    icon.addEventListener("click", async () => {
      // Récupérer l'ID du travail associé à l'icône de suppression
      const id = icon.parentElement.id.replace("#btnDeleteWork", "");

      // Afficher une alerte pour confirmer la suppression
      const confirmDelete = confirm(
        "Êtes-vous sûr de vouloir supprimer ce travail ?"
      );

      // Si l'utilisateur confirme la suppression
      if (confirmDelete) {
        try {
          const response = await fetch(`${apiWorks}/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("La suppression du travail a échoué");
          }

          // Supprimer l'élément parent de l'icône de suppression
          icon.parentElement.parentElement.remove();
          alert(`Le travail avec l'ID ${id} a été supprimé avec succès.`);

          updateWorkList(); // Mettre à jour la liste des travaux après suppression
          updateWorkListInModal();
        } catch (error) {
          console.error(
            "Une erreur est survenue lors de la suppression du travail :",
            error
          );
        }
      }
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

// Fonction qui configure l'input select du formulaire
async function setInputSelect() {
  const categories = await getCategories();

  // Créer les options
  categories.forEach((categorie) => {
    // Créer une nouvelle option pour chaque catégorie
    const option = document.createElement("option");
    option.value = categorie.id; // Valeur de l'option
    option.textContent = categorie.name; // Texte de l'option
    // Ajouter l'option à l'élément select
    inputCategorieAddPhoto.appendChild(option);
  });
}

// Fonction qui permet de charger et prévisualiser l'image dans l'input files
function uploadImage() {
  inputPhotoAddPhoto.addEventListener("change", function () {
    const file = inputPhotoAddPhoto.files[0];

    // Vérification de la taille du fichier
    if (file && file.size > 4 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 4 Mo.");
      inputPhotoAddPhoto.value = "";
      return;
    }

    // Vérification du type MIME du fichier
    if (file && !["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert(
        "Le format de l'image n'est pas pris en charge. Veuillez choisir un fichier JPEG, PNG ou GIF."
      );
      inputPhotoAddPhoto.value = "";
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const image = new Image();
        image.src = reader.result;
        image.onload = function () {
          if (image.naturalWidth < image.naturalHeight) {
            imagePreview.src = reader.result;
            imagePreview.style.display = "block";
            labelPhotoUploaded.style.display = "none";
          } else {
            const confirmPaysage = confirm(
              "L'image semble être en mode paysage. Êtes-vous sûr de vouloir la télécharger ?"
            );
            if (confirmPaysage) {
              imagePreview.src = reader.result;
              imagePreview.style.display = "block";
              labelPhotoUploaded.style.display = "none";
            } else {
              inputPhotoAddPhoto.value = "";
            }
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "#";
      imagePreview.style.display = "none";
      labelPhotoUploaded.style.display = "flex";
    }
  });
}

function isValidTitle(title) {
  let titleRegExp = /^[a-zA-Z0-9- àâçéèêëîïôûùüÿñæœ]*$/;
  return titleRegExp.test(title);
}

// Fonction qui test si tous les champs sont remplis et valides. Si true il rend le bouton Valider cliquable.
function formIsReady() {
  
  inputTitreAddPhoto.addEventListener("input", function() {
    const errorRegexTitle = document.getElementById('errorRegexTitle');
    
    if (isValidTitle(inputTitreAddPhoto.value)) {
      errorRegexTitle.remove();
      inputTitreAddPhoto.removeAttribute("style");
    } else {
      errorRegexTitle.innerText = "Le titre contient des caractères non autorisés.";
      errorRegexTitle.style.color = "red";
      inputTitreAddPhoto.style.border = "red solid";
      inputTitreAddPhoto.style.borderRadius = "2px";
      return;
    }
  });

  // Ajouter un gestionnaire d'événements pour surveiller les changements dans les champs du formulaire
  [inputPhotoAddPhoto, inputTitreAddPhoto, inputCategorieAddPhoto].forEach(
    (input) => {
      input.addEventListener("input", function () {
        // Vérifier si les trois champs sont remplis et valides
        if (
          inputPhotoAddPhoto.value.trim() !== "" &&
          isValidTitle(inputTitreAddPhoto.value) &&
          inputTitreAddPhoto.value.trim() !== "" &&
          inputCategorieAddPhoto.value.trim() !== ""
        ) {
          // Si tous les champs sont remplis et valides, ajouter la classe CSS "validate" au bouton de soumission
          btnSubmitFormAdd.classList.add("validate");
          btnSubmitFormAdd.disabled = false;
        } else {
          // Sinon, retirer la classe CSS "validate" du bouton de soumission et le désactiver
          btnSubmitFormAdd.classList.remove("validate");
          btnSubmitFormAdd.disabled = true;
        }
      });
    }
  );

}


// Fonction qui envoie la requête pour ajouter un travail
async function sendRequest() {
  // Ajouter un gestionnaire d'événements pour l'événement de soumission du formulaire
  formAddPhoto.addEventListener("submit", function (event) {
    // Empêcher le comportement par défaut du formulaire (rechargement de la page)
    event.preventDefault();

    // Récupérer la valeur sélectionnée dans le menu déroulant des catégories
    const titleNewWork = document.getElementById("titre").value;
    const selectedCategory = document.getElementById("categorie").value;
    const image = document.getElementById("photo").files[0];
    const btnSubmitFormAdd = document.querySelector(".validate");

    // Créer un nouvel objet FormData
    const formData = new FormData();
    formData.append("title", titleNewWork);
    formData.append("category", selectedCategory);
    formData.append("image", image);

    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch(`${apiWorks}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ajoutez le token d'authentification
      },
      body: formData,
    })
      .then((response) => {
        // Vérifier si l'ajout a réussi
        if (!response.ok) {
          throw new Error("L'ajout du travail a échoué");
        }
        updateWorkList();
        updateWorkListInModal();
        alert(
          `Le travail "${titleNewWork}" a été ajouté avec succès à la catégorie ${selectedCategory}.`
        );
        // Vider les champs du formulaire après l'envoi réussi
        inputTitreAddPhoto.value = "";
        inputCategorieAddPhoto.value = "";
        inputPhotoAddPhoto.value = "";
        imagePreview.src = "";
        imagePreview.style.display = "none";
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

// Fonction qui gère l'affichage et la validation du formulaire pour ajouter une photo
async function postNewphoto() {
  setInputSelect();
  uploadImage();
  formIsReady();

  sendRequest();
}

// Fonction qui permet de mettre à jour la liste des works si suppression ou ajout d'un work
async function updateWorkList() {
  const works = await getWorks();

  // Mettre à jour la liste des travaux affichés
  if (btnId !== undefined && btnId !== "0") {
    // Filtrer les travaux en fonction de l'ID du bouton actif
    const worksByCategory = works.filter((work) => {
      return work.categoryId == btnId;
    });

    // Afficher les travaux filtrés
    gallery.innerHTML = "";
    worksByCategory.forEach((work) => {
      createWorks(work);
    });
  } else {
    // Si le bouton actif est "Tous", afficher tous les travaux
    displayWorks();
    filterCategory();
  }
}

// Fonction pour mettre à jour la liste des travaux dans la modal
async function updateWorkListInModal() {
  const works = await getWorks();

  displayWorksInModal(works);

  deleteWork();
  filterCategory();
}

/******/
/******/
/***** Test to see if the server is accessible *****/
/******/
/******/

async function checkServerResponse() {
  try {
    const works = await getWorks();
    const categories = await getCategories();
    if (works.length === 0 || categories.length === 0) {
      throw new Error(
        "Impossible de joindre le serveur. Veuillez réessayer plus tard."
      );
    } else {
      displayWorks();
      displayCategories();
    }
  } catch (error) {
    const noDataText = document.createElement("p");
    noDataText.innerText =
      "Impossible d'afficher les projets car le serveur est injoignable.";
    noDataText.classList.add("visible");
    filter.appendChild(noDataText);
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
