// Global variables and constants
const apiWorks = "http://localhost:5678/api/works";
const apiCategories = "http://localhost:5678/api/categories";
const filter = document.getElementsByClassName("filter")[0];
const gallery = document.getElementsByClassName("gallery")[0];
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
  // Create a figure element
  const figure = document.createElement("figure");
  // Create an img element with work.imageURL as the src attribute
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  figure.appendChild(img);
  // Create a figcaption element with work title as text
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;
  figure.appendChild(figcaption);
  // Add figure to gallery
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
  const buttons = document
    .getElementsByClassName("filter")[0]
    .getElementsByTagName("button");
  Array.from(buttons).forEach((button) => {
    button.addEventListener("click", async (event) => {
      Array.from(buttons).forEach((btn) => {
        btn.classList.remove("active-filter");
      });
      button.classList.add("active-filter");
      btnId = event.target.id;
      gallery.innerHTML = "";
      const noWorkInCategory = document.getElementById("noWorkInCategory");
      const existingNoWorkMessage = document.getElementById("noWorkMessage");
      if (existingNoWorkMessage) {
        existingNoWorkMessage.remove();
      }
      if (btnId !== "0") {
        const worksByCategory = allWorks.filter((work) => {
          return work.categoryId == btnId;
        });
        if (worksByCategory.length === 0) {
          const noWorkMessage = document.createElement("p");
          noWorkMessage.textContent = "Aucun projet dans cette catégorie pour le moment.";
          noWorkMessage.id = "noWorkMessage";
          noWorkInCategory.appendChild(noWorkMessage);
        } else {
          worksByCategory.forEach((work) => {
            createWorks(work);
          });
        }
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

/***** CONTACT FORM *****/
// Global constants
const contactForm = document.getElementById("contactForm");
const nameContactForm = document.getElementById("name");
const emailContactForm = document.getElementById("email");
const messageContactForm = document.getElementById("message");
const buttonForm = document.getElementById("buttonForm");

// Function to validate email using a regular expression
function isValidEmail(emailContactForm) {
  let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  if (emailRegExp.test(emailContactForm)) {
    return true;
  }
  return false;
}

// Remove disabled if all conditions are respected
async function checkFormField() {
  if (
    nameContactForm.value.trim() !== "" &&
    isValidEmail(emailContactForm.value) &&
    emailContactForm.value.trim() !== "" &&
    messageContactForm.value.trim() !== ""
  ) {
    buttonForm.disabled = false;
  } else {
    buttonForm.disabled = true;
  }
}
checkFormField();

// Alert user that form doesn't work on submit. No refresh
function alertFormIsDisabled() {
  const formFields = [nameContactForm, emailContactForm, messageContactForm];
  formFields.forEach((input) => {
    input.addEventListener("input", () => {
      checkFormField();
    });
  });
  buttonForm.addEventListener("click", () => {
    alert(
      "Votre message n'a pas pu être envoyé car le formulaire est désactivé pour le moment. \n\nMerci de votre compréhension."
    );
  });
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    return;
  });
}
alertFormIsDisabled();

/***** *****/
/***** *****/
/***** ADMIN MODE *****/
/***** *****/
/***** *****/
// Admin mode global constants
const token = window.localStorage.getItem("token");
const userId = window.localStorage.getItem("userId");
const modalGallery = document.getElementsByClassName("modal-gallery")[0];

// Function which allows you to display all the functionalities of admin mode
function modeAdmin() {
  const logLink = document.getElementById("logLink");
  logLink.innerText = "logout";
  logLink.addEventListener("click", function (event) {
    // Confirmation before logout
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

  const topbar = document.getElementById("topbar");
  topbar.classList.remove("hidden");

  const header = document.getElementById("header");
  header.style.paddingTop = "calc(38px + 59px)";

  const modifyLink = document.getElementById("modifyLink");
  modifyLink.classList.remove("hidden");
}

/***** MODAL *****/
// Modal global constants
const inputPhotoAddPhoto = document.getElementById("photo");
const formAddPhoto = document.getElementById("formAddPhoto");
const inputTitreAddPhoto = document.getElementById("titre");
const inputCategorieAddPhoto = document.getElementById("categorie");
const imagePreview = document.getElementById("imagePreview");
const hiddenContentUpload = document.getElementById("hiddenContentUpload");

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
  // On click to closed icon
  btnCloseModal.onclick = function () {
    modal.style.display = "none";
  };
  // On click outside the modal area
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

// Build structure element of works in modal
function createWorksInModal(work) {
  // Create a figure element
  const figure = document.createElement("figure");
  // Create an img element with work.imageURL as the src attribute
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  // Create an element <span>+<i> for the delete icon
  const spanDeleteIcon = document.createElement("span");
  spanDeleteIcon.id = "#btnDeleteWork" + work.id;
  const icon = document.createElement("i");
  // Add classes for delete icon
  icon.className = "fa-solid fa-trash-can";

  spanDeleteIcon.appendChild(icon);
  figure.appendChild(spanDeleteIcon);
  figure.appendChild(img);
  modalGallery.appendChild(figure);
}

// Function to delete work
function deleteWork() {
  const allDeleteIcon = document.getElementsByClassName("fa-trash-can");
  Array.from(allDeleteIcon).forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      // Get id of work
      const id = icon.parentElement.id.replace("#btnDeleteWork", "");
      // Confirmation before delete
      const confirmDelete = confirm(
        "Êtes-vous sûr de vouloir supprimer ce travail ?"
      );
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
          // Remove parent element of the delete icon
          icon.parentElement.parentElement.remove();
          alert(`Le travail avec l'ID ${id} a été supprimé avec succès.`);
          updateWorkList();
          updateWorkListInModal();
        } catch (error) {
          console.error(
            "Une erreur est survenue lors de la suppression du travail :",
            error
          );
        }
      } else {
        event.preventDefault();
      }
    });
  });
}

// Function that displays the work addition form and hides the modal with the list of works
function displayFormAddPhoto() {
  const btnAddPhoto = document.getElementById("btnAddPhoto");

  // Listen on clic on button "Ajouter une photo"
  btnAddPhoto.addEventListener("click", function () {
    // Display form screen to add a work
    modalWorks.style.display = "none";
    modalAddWork.style.display = "block";
    // Display works list screen
    const returnBtn = document.getElementById("returnBtn");
    returnBtn.addEventListener("click", function () {
      modalWorks.style.display = "block";
      modalAddWork.style.display = "none";
    });
  });
  postNewphoto();
}
displayFormAddPhoto();

// Function that set up form selec input
async function setInputSelect() {
  const categories = await getCategories();

  // Create option elements
  categories.forEach((categorie) => {
    const option = document.createElement("option");
    option.value = categorie.id;
    option.textContent = categorie.name;
    inputCategorieAddPhoto.appendChild(option);
  });
}

// Function to validate name file using a regular expression
function isValidNameFile(file) {
  let fileRegExp = /^[a-zA-Z0-9-_.\s]{1,255}\.(jpg|jpeg|png|gif)$/i;
  return fileRegExp.test(file);
}

// Function to validate title file using a regular expression
function isValidTitle(title) {
  const titleRegExp = /^[a-zA-Z0-9- àâçéèêëîïôûùüÿñæœ]*$/;
  return titleRegExp.test(title);
}

// Function that resets input photo
function resetInputPhoto(){
  imagePreview.src = "#";
  inputPhotoAddPhoto.value = "";
  imagePreview.style.display = "none";
  hiddenContentUpload.style.display = "flex";
}

// Function that allows loading and previewing the image in the file input
function uploadImage() {
  inputPhotoAddPhoto.addEventListener("change", function () {
    const file = inputPhotoAddPhoto.files[0];
    const errorRegexNameFile = document.getElementById("errorRegexNameFile");
    // Checking if no file is selected
    if (!file) {
      resetInputPhoto();
      return;
    }
    // Checking weight of file
    if (file && file.size > 4 * 1024 * 1024) {
      errorRegexNameFile.innerText =
        "La taille du fichier doit être inférieure 4 Mo.";
      errorRegexNameFile.style.color = "red";
      errorRegexNameFile.style.display = "block";
      alert(
        "L'image est trop lourde. \n\nLe poids de l'image doit être inférieur à 4 Mo."
      );
      resetInputPhoto();
      return;
    }
    // Checking type MIME of file
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      errorRegexNameFile.innerText =
        "Le format de l'image n'est pas accepté.";
      errorRegexNameFile.style.color = "red";
      errorRegexNameFile.style.display = "block";
      alert(
        "Le format de l'image n'est pas pris en charge. \n\nVeuillez choisir un fichier JPG, JPEG, ou PNG."
      );
      resetInputPhoto();
      return;
    }
    // Checking name of file
    if (file && !isValidNameFile(file.name)) {
      errorRegexNameFile.innerText =
        "Le titre du fichier contient des caractères non autorisés.";
      errorRegexNameFile.style.color = "red";
      errorRegexNameFile.style.display = "block";
      alert(
        "Le nom du fichier n'est pas valide. \n\nVeuillez utiliser uniquement des caractères autorisés :\n- caractère alphanumérique (pas d'accents),\n- tiret bas,\n- tiret,\n- point ou espace.\n\nLe fichier doit comporter entre 1 et 255 caractères."
      );
      resetInputPhoto();
      return;
    }
    // Checking format of file and load preview
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const image = new Image();
        image.src = reader.result;
        image.onload = function () {
          if (image.naturalWidth < image.naturalHeight) {
            imagePreview.src = reader.result;
            imagePreview.style.display = "block";
            hiddenContentUpload.style.display = "none";
            errorRegexNameFile.style.display = "none";
          } else {
            const confirmPaysage = confirm(
              "L'image semble être en mode paysage. \n\nÊtes-vous sûr de vouloir la télécharger ?"
            );
            if (confirmPaysage) {
              imagePreview.src = reader.result;
              imagePreview.style.display = "block";
              hiddenContentUpload.style.display = "none";
              errorRegexNameFile.style.display = "none";
            } else {
              resetInputPhoto();
            }
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      resetInputPhoto();
    }
  });
}

// Function that checks if all fields are filled and valid. If true, makes the submit button clickable
function formIsReady() {
  const errorRegexTitle = document.getElementById("errorRegexTitle");
  // Add an event listener for error message on the title input.
  inputTitreAddPhoto.addEventListener("input", function () {
    if (isValidTitle(inputTitreAddPhoto.value)) {
      errorRegexTitle.style.display = "none";
      inputTitreAddPhoto.removeAttribute("style");
    } else {
      errorRegexTitle.innerText =
        "Le titre contient des caractères non autorisés.";
      errorRegexTitle.style.color = "red";
      errorRegexTitle.style.display = "block";
      inputTitreAddPhoto.style.border = "red solid";
      inputTitreAddPhoto.style.borderRadius = "2px";
      return;
    }
  });
  // Add an event listener to checks changes in the form fields
  [inputPhotoAddPhoto, inputTitreAddPhoto, inputCategorieAddPhoto].forEach(
    (input) => {
      input.addEventListener("input", function () {
        // Check if all fields are filled and valid
        if (
          inputPhotoAddPhoto.value.trim() !== "" &&
          isValidTitle(inputTitreAddPhoto.value) &&
          inputTitreAddPhoto.value.trim() !== "" &&
          inputCategorieAddPhoto.value.trim() !== ""
        ) {
          // Add class and attribut on submit button
          btnSubmitFormAdd.classList.add("validate");
          btnSubmitFormAdd.disabled = false;
        } else {
          // Remove class and attribut on submit button
          btnSubmitFormAdd.classList.remove("validate");
          btnSubmitFormAdd.disabled = true;
        }
      });
    }
  );
}

// Function that sends fetch request to add a work
async function sendRequest() {
  // Add an event listener for the form submission even
  formAddPhoto.addEventListener("submit", function (event) {
    event.preventDefault();
    // Get input values
    const titleNewWork = document.getElementById("titre").value;
    const selectedCategory = document.getElementById("categorie").value;
    const image = document.getElementById("photo").files[0];
    const btnSubmitFormAdd = document.getElementsByClassName("validate")[0];

    // Create object
    const formData = new FormData();
    formData.append("title", titleNewWork);
    formData.append("category", selectedCategory);
    formData.append("image", image);

    // Send fetch request on API
    fetch(`${apiWorks}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("L'ajout du travail a échoué");
        }
        const existingNoWorkMessage = document.getElementById("noWorkMessage");
        if (existingNoWorkMessage) {
          existingNoWorkMessage.remove();
        }
        updateWorkList();
        updateWorkListInModal();
        alert(
          `Le travail "${titleNewWork}" a été ajouté avec succès à la catégorie ${selectedCategory}.`
        );
        // Clear the form fields after submission
        inputTitreAddPhoto.value = "";
        inputCategorieAddPhoto.value = "";
        inputPhotoAddPhoto.value = "";
        imagePreview.src = "";
        imagePreview.style.display = "none";
        btnSubmitFormAdd.classList.remove("validate");
        hiddenContentUpload.style.display = "flex";
      })
      .catch((error) => {
        console.error(
          "Une erreur est survenue lors de l'ajout du travail :",
          error
        );
        // Create 
      });
  });
}

// Function that handles the display and validation of the form to add a photo
async function postNewphoto() {
  setInputSelect();
  uploadImage();
  formIsReady();

  sendRequest();
}

// Updates works list on page after addition or deletion of work
async function updateWorkList() {
  const works = await getWorks();

  if (btnId !== undefined && btnId !== "0") {
    // Filter works based on the ID of the active button
    const worksByCategory = works.filter((work) => {
      return work.categoryId == btnId;
    });
    // Display filtered works
    gallery.innerHTML = "";
    if (worksByCategory.length === 0) {
      const noWorkInCategory = document.getElementById("noWorkInCategory");
      const existingNoWorkMessage = document.getElementById("noWorkMessage");
      if (existingNoWorkMessage) {
        existingNoWorkMessage.remove();
      }
      const noWorkMessage = document.createElement("p");
      noWorkMessage.textContent = "Aucun projet dans cette catégorie pour le moment.";
      noWorkMessage.id = "noWorkMessage";
      noWorkInCategory.appendChild(noWorkMessage);
    } else {
      worksByCategory.forEach((work) => {
        createWorks(work);
      });
    }
  } else {
    // If active button is "Tous", display all works
    displayWorks();
  }
  filterCategory();
}

// Updates works in modal after addition or deletion of work
async function updateWorkListInModal() {
  const works = await getWorks();
  displayWorksInModal(works);
  deleteWork();
  filterCategory();
}


/******/
/******/
/***** TESTS *****/
/******/
/******/
// Async function to test if the server is accessible
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

// Async function to test if the user is logged in
async function checkAuthentication() {
  const contact = document.getElementById("contact");
  const portfolio = document.getElementById("portfolio");
  if (token) {
    modeAdmin();
    portfolio.style.paddingTop = "59px";
    contact.style.paddingTop = "59px";
  } else {
    portfolio.style.paddingTop = null;
    contact.style.paddingTop = null;
  }
}
checkAuthentication();
