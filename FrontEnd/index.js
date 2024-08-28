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


// Appeler les fonctions pour récupérer et afficher les catégories et les travaux par défaut
fetchCategories();
fetchWorks();



// MODAL

// Sélectionner les éléments de la modale
const modal = document.getElementById("modal");
const editGalleryButton = document.getElementById("editGalleryButton");
const closeButton = document.querySelector(".close");

// Ouvrir la modale
editGalleryButton.addEventListener("click", function() {
    modal.style.display = "block";
    fetchWorksForModal(); // Ajout ici pour charger les travaux dans la modale
});

async function fetchWorksForModal() {
    try {
        const response = await fetch(apiUrlWorks);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const works = await response.json();
        // Afficher les travaux dans la galerie de la modale
        displayWorksInModal(works);
    } catch (error) {
        console.error('Error fetching works for modal:', error);
    }
}

// Fermer la modale quand l'utilisateur clique sur le X
closeButton.addEventListener("click", function() {
    modal.style.display = "none";
});

// Fermer la modale quand l'utilisateur clique en dehors de la modale
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

function displayWorksInModal(works) {
    console.log("Displaying works in modal:", works);
    const modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML = ''; // Efface le contenu actuel

    works.forEach(work => {
        // Créez un conteneur pour l'image et la poubelle
        const container = document.createElement('div');
        container.classList.add('image-container'); // Ajoute la classe 'image-container'

        const img = document.createElement('img');
        const deleteButton = document.createElement('button');

        img.src = work.imageUrl;
        img.alt = work.title;

        // Ajouter le SVG au bouton de suppression
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none">
                <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
            </svg>
        `;
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteWork(work.id));

        // Ajoute l'image et le bouton de suppression au conteneur
        container.appendChild(img);
        container.appendChild(deleteButton);

        // Ajoute le conteneur à la galerie modale
        modalGallery.appendChild(container);
    });
}

// Récupére le token d'authentification dans localStorage ou sessionStorage
const token = localStorage.getItem('authToken'); // Récupérer le token

// Vérifier si le token existe
if (token) {
    document.getElementById('editGalleryButton').style.display = 'block'; // Affiche le bouton
} else {
    document.getElementById('editGalleryButton').style.display = 'none'; // Cache le bouton
}



async function deleteWork(workId) {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${apiUrlWorks}/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Si un token est requis
            },
        });

        if (response.ok) {
            alert('Le travail a été supprimé avec succès.');
            // Mettre à jour la galerie dans la modale
            fetchWorks().then(works => displayWorksInModal(works));
        } else {
            throw new Error(`Erreur lors de la suppression: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting work:', error);
        alert('Une erreur est survenue lors de la suppression.');
    }
}
