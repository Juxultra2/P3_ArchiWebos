// URL de l'API pour l'authentification
const apiUrlAuth = 'http://localhost:5678/api/users/login';

// Fonction pour gérer la connexion
async function handleLogin(event) {
    event.preventDefault(); // Empêche la soumission du formulaire par défaut

    // Récupérer les valeurs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Préparer la requête pour l'API
    try {
        const response = await fetch(apiUrlAuth, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Vérifier si la réponse est correcte
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Récupérer le token de la réponse
        const data = await response.json();
        const token = data.token;

        // Stocker le token dans le stockage local (ou utiliser une autre méthode de stockage)
        localStorage.setItem('authToken', token);

        // Redirection vers la page d'accueil
        window.location.href = 'index.html';

    } catch (error) {
        // Afficher un message d'erreur
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.textContent = 'E-mail ou mot de passe incorrect.';
        errorMessageDiv.style.color = 'red';
    }
}

// Attacher l'événement de soumission du formulaire
document.getElementById('loginForm').addEventListener('submit', handleLogin);
