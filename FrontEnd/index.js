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
        
        return works
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
    const select =document.getElementById('categoryId')
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
        const option = document.createElement('option')
        option.textContent = category.name;
        option.value = categories.id;
        select.appendChild(option)
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
fetchWorks().then(works => {
    displayWorksInModal(works)
    displayWorks(works)
    })



// Fonction pour vérifier la connexion de l'utilisateur et cacher l'élément
function checkUserConnectionAndHideFilters() {
    // Vérifier si l'utilisateur est connecté, ici on vérifie la présence d'un token
    const token = localStorage.getItem('authToken'); // Remplacez 'authToken' par la clé que vous utilisez

    // Sélectionner l'élément à cacher
    const filters = document.getElementById('filters');

    if (token) {
        // Si le token est présent (l'utilisateur est connecté), cacher l'élément
        filters.style.display = 'none';
    } else {
        // Si le token n'est pas présent (l'utilisateur n'est pas connecté), afficher l'élément
        filters.style.display = 'flex';
    }
}

// Appeler la fonction pour vérifier la connexion de l'utilisateur et ajuster l'affichage
checkUserConnectionAndHideFilters();



// Fonction pour vérifier la connexion de l'utilisateur et ajuster l'affichage
function checkLoginStatus() {
    const token = localStorage.getItem('authToken'); // Remplacez 'authToken' par la clé que vous utilisez

    // Sélectionner les éléments à afficher ou cacher
    const logoutButton = document.getElementById('logoutButton');
    const loginButton = document.getElementById('loginButton');
    const filters = document.getElementById('filters');
    const editGalleryButton = document.getElementById('editGalleryButton'); 

    if (token) {
        // Si le token est présent (l'utilisateur est connecté), cacher les filtres et afficher le bouton de déconnexion
        filters.style.display = 'none';
        logoutButton.style.display = 'block';
        loginButton.style.display = 'none';
        editGalleryButton.style.display = 'flex';
    } else {
        // Si le token n'est pas présent (l'utilisateur n'est pas connecté), afficher les filtres et afficher le bouton de connexion
        filters.style.display = 'flex';
        logoutButton.style.display = 'none';
        loginButton.style.display = 'block';
        editGalleryButton.style.display = 'none';
    }
}

// Fonction pour déconnecter l'utilisateur
function logout() {
    // Supprimer le token du stockage local
    localStorage.removeItem('authToken');

    // Appeler la fonction pour mettre à jour l'interface utilisateur
    checkLoginStatus();
}

// Ajouter un événement pour le bouton de déconnexion
document.getElementById('logoutButton').addEventListener('click', logout);

// Appeler la fonction pour vérifier la connexion de l'utilisateur et ajuster l'affichage lors du chargement de la page
window.addEventListener('DOMContentLoaded', (event) => {
    checkLoginStatus();
});


// MODAL

// Sélectionner les éléments de la modale
const modal = document.getElementById("modal");
const editGalleryButton = document.getElementById("editGalleryButton");
const closeButton = document.querySelector(".close");
const closeButton2 = document.querySelector(".close2");

// Ouvrir la modale
editGalleryButton.addEventListener("click", function() {
    modal.style.display = "flex";
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
closeButton2.addEventListener("click", function() {
    modal.style.display = "none";
});

// Fermer la modale quand l'utilisateur clique en dehors de la modale
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Modale Vue Galerie Photo
function displayWorksInModal(works) {
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
    document.getElementById('editGalleryButton').style.display = 'flex'; // Affiche le bouton modifier
} else {
    document.getElementById('editGalleryButton').style.display = 'none'; // Cache le bouton modifier
}


//fonction pour supprimer les projets en admin
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
            fetchWorks().then(works => {
                displayWorksInModal(works)
                displayWorks(works)
            });
        } else {
            throw new Error(`Erreur lors de la suppression: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting work:', error);
        alert('Une erreur est survenue lors de la suppression.');
    }
}


//gestion des vues de la modale
document.getElementById('addPhotoButton').addEventListener('click', function() {
    // Masquer la première vue
    document.getElementById('modalGaleriePhoto').classList.add('cacher');

    // Afficher la deuxième vue
    document.getElementById('modalAjoutPhoto').classList.remove('cacher');
});

document.getElementById('back-to-gallery').addEventListener('click', function() {
    // Masquer la deuxième vue
    document.getElementById('modalAjoutPhoto').classList.add('cacher');

    // Afficher la première vue
    document.getElementById('modalGaleriePhoto').classList.remove('cacher');
});




// Gestion de la soumission du formulaire pour ajouter un nouveau projet
document.getElementById('add-photo-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche la soumission standard du formulaire

    // Créer un objet FormData à partir du formulaire
    const formData = new FormData(this);

    // Vérifier si les champs requis sont remplis
    if (!formData.get('title') || !formData.get('category') || !formData.get('image')) {
        alert("Veuillez remplir tous les champs requis.");
        return;
    }

    const token = localStorage.getItem('authToken'); // Récupérer le token

    if (!token) {
        alert('Token d\'authentification manquant.');
        return;
    }
    
    // Préparer la requête
    try {
        const response = await fetch(apiUrlWorks, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Si un token est requis
            },
            body: formData, // Envoyer les données sous forme de FormData
        });

        if (response.ok) {
            const addedWork = await response.json();
            
            // Mettre à jour la galerie avec le nouveau projet ajouté
            fetchWorks().then(works => {
                displayWorksInModal(works)
                displayWorks(works)
            });

            // Revenir à la première vue de la modale
            document.getElementById('modalAjoutPhoto').classList.add('cacher');
            document.getElementById('modalGaleriePhoto').classList.remove('cacher');
        } else {
            throw new Error(`Erreur lors de l'ajout du projet: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'ajout du projet.');
    }
});



// prévisualisation de l'image sélectionnée avant la soumission du formulaire
const inputImage = document.getElementById('imageUrl');
const imagePreview = document.getElementById('imagePreview');
const previewContainer = document.getElementById('preview-container');
const cacherAjoutPhoto = document.getElementById('cacher-ajoutPhoto');

// Écoute l'événement 'change' sur l'inputImage
inputImage.addEventListener('change', function(event) {
    const file = event.target.files[0]; // Récupère le fichier sélectionné
    
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        const reader = new FileReader(); // Utilise FileReader pour lire l'image

        // Quand le fichier est chargé, met à jour la source de l'image de prévisualisation
        reader.onload = function(e) {
            imagePreview.src = e.target.result; // Affecte le contenu de l'image
            previewContainer.style.display = 'block'; // Affiche l'image
            cacherAjoutPhoto.style.display = 'none'; // Cache cacher-ajoutPhoto
        };

        reader.readAsDataURL(file); // Lis l'image comme URL
    } else {
        // Si le fichier n'est pas une image valide, affiche une alerte et réinitialise le champ
        alert('Veuillez sélectionner une image au format JPG ou PNG.');
        inputImage.value = ''; // Réinitialise le champ
        imagePreview.src = ''; // Réinitialise la prévisualisation
        previewContainer.style.display = 'none'; // Cache la prévisualisation
        cacherAjoutPhoto.style.display = 'flex'; // Réaffiche cacher-ajoutPhoto
    }
});

// Permet à l'utilisateur de changer d'image en cliquant sur la prévisualisation
imagePreview.addEventListener('click', function() {
    inputImage.click(); // Simule un clic sur l'input de fichier
});





