// Définir l'URL de l'API comme une constante
const apiUrl = 'http://localhost:5678/api/works';

// Fonction pour récupérer les projets depuis l'API
async function fetchWorks() {
    try {
        // Utiliser la constante apiUrl pour l'appel à l'API
        const response = await fetch(apiUrl);
        // Vérifie si la réponse est correcte
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse la réponse en JSON
        const works = await response.json();
        // Affiche les travaux récupérés
        displayWorks(works);
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

// Appelle la fonction pour récupérer et afficher les travaux
fetchWorks();
