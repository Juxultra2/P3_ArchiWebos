// Définir l'URL de l'API pour les travaux et les catégories
const apiUrlWorks = 'http://localhost:5678/api/works';
const apiUrlCategories = 'http://localhost:5678/api/categories';

// Fonction pour récupérer les projets depuis l'API
async function fetchWorks() {
    try {
        // Utiliser la constante apiUrl pour l'appel à l'API
        const response = await fetch(apiUrlWorks);
        // Vérifie si la réponse est correcte
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse la réponse en JSON
        const works = await response.json();
        // Affiche les travaux récupérés
        displayWorks(works);
        console.log(works);
    } catch (error) {
        console.error('Error fetching works:', error);
    }
}

// Fonction pour afficher les projets dans la galerie
function displayWorks(works) {
    // Sélectionne l'élément de la galerie par classe
    const worksContainer = document.querySelector('.gallery');

    // Supprime tout le contenu actuel de la galerie
    worksContainer.innerHTML = '';

    // Ajoute chaque projet récupéré
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        worksContainer.appendChild(figure);
    });
}




// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        const response = await fetch(apiUrlCategories);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Fonction pour afficher les catégories dans le menu de filtres
function displayCategories(categories) {
    const filterContainer = document.getElementById('filters');
    filterContainer.innerHTML = ''; // Efface tous les filtres existants

    // Ajout d'un bouton pour afficher tous les travaux
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => fetchWorks());
    filterContainer.appendChild(allButton);

    // Ajout des boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => fetchWorksByCategory(category.id));
        filterContainer.appendChild(button);
    });
}



// Fonction pour récupérer les travaux par catégorie depuis l'API
async function fetchWorksByCategory(categoryId) {
    try {
        const response = await fetch(apiUrlWorks);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const works = await response.json();
        const filteredWorks = works.filter(work => work.categoryId === categoryId);
        displayWorks(filteredWorks);
    } catch (error) {
        console.error('Error fetching works by category:', error);
    }
}



// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
    const worksContainer = document.querySelector('.gallery');
    worksContainer.innerHTML = '';
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        worksContainer.appendChild(figure);
    });
}

// Appeler les fonctions pour récupérer et afficher les catégories et les travaux par défaut
fetchCategories();
fetchWorks();
