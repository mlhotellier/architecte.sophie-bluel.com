# Sophie Bluel - Architecte d'intérieur

Ce projet consiste en un site web pour Sophie Bluel, architecte d'intérieur, permettant de présenter ses réalisations, ses services et de faciliter le contact avec les clients potentiels. Projet 3 développeur web.

## Table des matières

1. [Description](#description)
2. [Fonctionnalités](#fonctionnalités)
3. [Installation](#installation)
4. [Technologies utilisées](#technologies-utilisées)
5. [Structure du projet](#structure-du-projet)
6. [Utilisation](#utilisation)
7. [Contributions](#contributions)
8. [Licence](#licence)
9. [Contact](#contact)

## Description

Le site Sophie Bluel - Architecte d'intérieur est une plateforme en ligne destinée à présenter le travail et les services de Sophie Bluel, une architecte d'intérieur expérimentée. Il permet aux visiteurs de découvrir ses projets, de prendre connaissance de ses compétences et de la contacter pour des collaborations potentielles.

## Fonctionnalités

### Affichage des travaux (Works) :

- La fonction `getWorks()` récupère les travaux à partir de l'API.
- La fonction `createWorks(work)` crée la structure HTML pour afficher chaque travail dans la galerie.
- La fonction `displayWorks()` affiche les travaux dans la galerie en appelant les fonctions précédentes.

### Filtrage par catégorie :

- La fonction `getCategories()` récupère les catégories à partir de l'API.
- La fonction `filterCategory()` permet de filtrer les travaux par catégorie lorsque l'utilisateur clique sur les boutons de filtre.

### Mode administrateur (Admin Mode) :

- La fonction `modeAdmin()` active le mode administrateur en changeant le lien de connexion en "logout" et en affichant la barre de navigation supplémentaire.
- Des fonctionnalités supplémentaires sont implémentées pour le mode administrateur, telles que la suppression de travaux.

### Modal :

- Les fonctions `openModal()` et `closeModal()` permettent d'ouvrir et de fermer la modal respectivement.
- La fonction `displayWorksInModal()` affiche les travaux dans la modal.
- La fonction `createWorksInModal(work)` crée la structure HTML pour afficher chaque travail dans la modal.

### Ajout de travaux (Add Photo) :

- La fonction `displayFormAddPhoto()` gère l'affichage et le masquage du formulaire d'ajout de travaux.
- La fonction `postNewphoto()` gère l'envoi du formulaire pour ajouter un nouveau travail à l'API.

### Vérifications et validations :

- Plusieurs fonctions sont implémentées pour vérifier et valider les données entrées par l'utilisateur, telles que la validation du titre du travail et du nom du fichier image.
- La fonction `formIsReady()` active le bouton de soumission du formulaire une fois que tous les champs sont remplis et valides.

### Autres fonctionnalités :

- Des fonctions sont également implémentées pour vérifier la disponibilité du serveur et l'authentification de l'utilisateur.

## Installation

Pour installer et exécuter localement ce projet, suivez les étapes suivantes :

1. Clonez ce dépôt GitHub sur votre machine locale : [Lien GitHub](https://github.com/OpenClassrooms-Student-Center/Portfolio-architecte-sophie-bluel.git)
2. Assurez-vous d'avoir Node.js installé sur votre machine.
3. Allez dans le repository `/Backend`.
4. Installez les dépendances en exécutant la commande `npm install`.
5. Lancez le serveur local en exécutant la commande `npm start`.
6. Ouvrez votre navigateur web et accédez à l'adresse `http://localhost:PORT`, où `PORT` est le numéro de port spécifié dans la configuration du serveur. (ici 5678).

## Technologies utilisées

- HTML
- CSS
- JavaScript
- Fetch API (Swagger) pour la communication avec le serveur
- LocalStorage pour le stockage des tokens d'authentification et des données utilisateur
- Node.js

## Structure du projet

- `index.html`: Page principale du site avec la présentation des projets, le formulaire de contact et le lien vers le mode administrateur.
- `login.html`: Page de connexion pour les utilisateurs avec un formulaire de connexion et la gestion des erreurs.
- `assets/`: Dossier contenant les ressources du site, telles que les images, les icônes et les fichiers CSS.
- `js/`: Dossier contenant les scripts JavaScript pour la logique de la page et les appels API.
- `mentions-legales.html`: Page contenant les mentions légales du site. Contenu factice.

## Utilisation

Une fois le serveur lancé, vous pouvez accéder au site web dans votre navigateur et parcourir les différents projets présentés. Vous pouvez également utiliser le formulaire de contact pour envoyer un message à Sophie Bluel.

Pour accéder au mode administrateur, vous devez vous connecter en cliquant sur le lien "login" dans la barre de navigation. Une fois connecté, vous aurez accès aux fonctionnalités d'administration telles que l'ajout, la modification et la suppression de projets.

## Contributions

Les contributions à ce projet sont les bienvenues ! Si vous souhaitez contribuer, veuillez soumettre une pull request avec vos modifications proposées. Assurez-vous de suivre les bonnes pratiques de développement et de tester vos modifications avant de les soumettre.

## Licence

Ce projet est sous licence MIT.

## Contact

Pour toute question ou demande de renseignements, n'hésitez pas à me contacter par e-mail à l'adresse mathislhotellier@gmail.com.
