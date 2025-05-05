const Email = sessionStorage.getItem("email_connexion");
console.log (Email);

$.ajax({
    type: "POST",
    url: "/compteManager",
    data: {
        email: Email
    }
}).then(function(User) {
    console.log("Réponse du serveur recu : ")
    console.log(User);
    /*var UserArray = [];
    UserArray.push(User);*/
    var UserArray = $.parseJSON(User);
    console.log(UserArray);
    console.log(UserArray[0].username)
    if (UserArray[0].username /*&& User.translator && User.chef && User.administrator*/) {
        const Username = UserArray[0].username;
        const Translator = UserArray[0].translator;
        const Chef = UserArray[0].chef;
        const Administrator = UserArray[0].administrator;

        sessionStorage.setItem("username_connexion",Username);
        sessionStorage.setItem("translator_connexion",Translator);
        sessionStorage.setItem("chef_connexion",Chef);
        sessionStorage.setItem("administrator_connexion",Administrator);
    } else {
        console.log("Erreur, la réponse n'est pas au format attendu.")
    }
}).catch(function(xhr, status, error) {
    console.log("Erreur : " + error);
});


document.getElementById("email_utilisateur").textContent = Email ;







// Fonction pour charger les recettes depuis le fichier JSON
function loadRecipes() {
    return $.getJSON('../recipies.json');
}

// Fonction pour afficher les résultats de la recherche
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Réinitialiser les résultats

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Aucune recette trouvée.</p>';
        return;
    }
    results.forEach(recipe => {
        const btn = document.createElement('button');

        btn.innerHTML = `
            <span class="recipe-name">${recipe.name}</span><br/>
            <span class="recipe-name-fr">${recipe.nameFR}</span>
        `;
        btn.addEventListener('click', () => {
            sessionStorage.setItem('recipeName', recipe.name);
            window.location.href = 'recette.html';
        });
        resultsContainer.appendChild(btn);
    });
}

// Evénement de clic sur le bouton de recherche
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    loadRecipes().then(recipes => {
        const filteredRecipes = recipes.filter(recipe => {
            const name = recipe.name ? recipe.name.toLowerCase() : '';
            const nameFR = recipe.nameFR ? recipe.nameFR.toLowerCase() : '';
            const author = recipe.author ? recipe.author.toLowerCase() : '';
            const without = Array.isArray(recipe.without) ? recipe.without.join(' ').toLowerCase() : (recipe.without ? recipe.without.toLowerCase() : '');
            const stepsText = Array.isArray(recipe.steps) ? recipe.steps.join(' ').toLowerCase() : '';

            let ingredientsText = '';
            if (Array.isArray(recipe.ingredients)) {
                ingredientsText = recipe.ingredients.map(ing => {
                    const qty = ing.quantity ? ing.quantity.toString().toLowerCase() : '';
                    const name = ing.name ? ing.name.toLowerCase() : '';
                    const type = ing.type ? ing.type.toLowerCase() : '';
                    return `${qty} ${name} ${type}`;
                }).join(' ');
            }

            const fullText = `${name} ${nameFR} ${author} ${without} ${stepsText} ${ingredientsText}`;

            return fullText.includes(searchTerm);
        });

        displaySearchResults(filteredRecipes);
    }).catch(error => {
        console.error("Erreur lors du chargement des recettes : ", error);
    });
});