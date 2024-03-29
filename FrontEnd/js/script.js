// Remplacez l'URL par l'API que vous souhaitez intégrer
const apiUrl = 'http://localhost:5678/api/works';

// Récupération de la div où va s'intégrer le contenu
const gallery = document.querySelector('.gallery');
const filter = document.querySelector('.filter')

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(works => {
    // console.log("***** works *****",works)
    const categories = new Set(); 

    // Ajouter un bouton "Tous"
    const allButton = document.createElement('button');
    allButton.innerText = "Tous";
    allButton.addEventListener('click', function() {
        // Afficher tous les travaux
        displayWorks(works);
    });
    filter.appendChild(allButton);

    // Afficher tous les travaux initialement
    displayWorks(works);

    for (let i = 0; i < works.length; i++){
      const category = works[i].category
      // Vérifier si la catégorie a déjà été ajoutée
      if (!categories.has(category.name)) {
          // Ajouter la catégorie à l'ensemble des catégories ajoutées
          categories.add(category.name);

          // Créer un élément button
          const button = document.createElement('button');
          button.innerText = category.name;
  
          // Ajouter un gestionnaire d'événements 'click' au bouton
          button.addEventListener('click', function() {
            // Récupérer le texte du bouton cliqué
            const buttonText = button.innerText;

             // Filtrer les travaux en fonction de la catégorie cliquée
             const filteredWorks = works.filter(work => work.category.name === buttonText);
            
             // Afficher les travaux filtrés
             displayWorks(filteredWorks);
             console.log("filteredWorks",filteredWorks)
          });

          // Ajouter la button à la div
          filter.appendChild(button);
      }
    }
  })
  .catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });





function displayWorks(works) {    
    // Effacer la galerie
    gallery.innerHTML = '';

    // Pour chaque travail récupéré depuis l'API
    works.forEach(work => {
        // Créer un élément figure
        const figure = document.createElement('figure');

        // Créer un élément img avec l'URL du travail comme src
        const img = document.createElement('img');
        img.src = work.imageUrl; // Assurez-vous que votre API renvoie l'URL de l'image
        img.alt = work.title; // Assurez-vous que votre API renvoie le titre de l'image
        figure.appendChild(img);

        // Créer un élément figcaption avec le titre du travail comme texte
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title; // Assurez-vous que votre API renvoie le titre du travail
        figure.appendChild(figcaption);

        // Ajouter la figure à la galerie
        gallery.appendChild(figure);
    });
}