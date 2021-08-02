
// Multiselect input - intolerances
let expanded = false;
let checkBoxes = document.getElementById('checkBoxes');

const showCheckBoxes = function() {
    if(!expanded) {
        checkBoxes.style.display = 'flex';
        checkBoxes.style.flexWrap = 'wrap';
        expanded = true;   
    } else {
        checkBoxes.style.display = 'none';
        expanded = false; 
    }
}


// Add Intolerances 

let intolerances = document.querySelectorAll('input[type="checkbox"]');
let intolerancesList = document.getElementById('intolerances-input');
let intolerancesArray = [];


const addIntolerances = function(e) {
     
    if(e.target.checked === true) {
        
        intolerancesArray.push(e.target.value);

        intolerancesList.value = intolerancesArray.toString();
        intolerancesList.style.fontSize = '0.9rem';
        intolerancesList.style.color = '#198754';

        
    } else if(e.target.checked === false) {
         
        let itemIndex = intolerancesArray.indexOf(e.target.value);

        if(itemIndex !== -1) {
            intolerancesArray.splice(itemIndex, 1);

            intolerancesArray.toString();

            intolerancesList.value = intolerancesArray.toString();   
        }

         
    }

     
}

intolerances.forEach((item,index) => item.addEventListener('change', addIntolerances));


// Search input

let searchWords = document.getElementById('search-box');


// Select food type

let foodType = document.getElementById('food-type');


 
// Insert new recipe

let recipesContainer = document.getElementById('recipes-wrapper');

const insertRecipe = function(img, title, minutes, servings, score, recipeURL, id, carbs, fat, protein) {

    const newRecipe = `
    <div class="recipe card mx-2 mb-4" style="width:18rem">
    <img src="${img}" class="card-img-top" alt="recipe">
    <div class="card-body">
      <h5 class="card-title text-success">${title}</h5>
      <ul class="list-group list-group-flush">
        <li class="list-group-item fw-bold px-0">${minutes} minutes</li>
        <li class="list-group-item fw-bold px-0">${servings} servings</li>
        <li class="list-group-item fw-bold px-0">Healthy score: ${score}</li>
      </ul>

      <div class="col-12 d-flex justify-content-between align-items-center">
          <a href="${recipeURL}" target="_blank" class="btn btn-success shadow-none">see recipe</a>

          <!-- Modal -->
          <a class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalBox${id}">
            nutrition</a>
      </div>

        <div class="modal fade" id="modalBox${id}" tabindex="-1" aria-labelledby="modalBoxLabel${id}" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="modalBoxLabel${id}">Nutrition <span class="text-success">%</span></h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex justify-content-evenly">
                    <span class="text-info">${carbs} carbs</span>
                    <span class="text-warning">${fat} fat</span>
                    <span class="text-danger">${protein} protein</span>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-success" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
        </div>  
      
    </div>   
 </div>
    `

    recipesContainer.insertAdjacentHTML('beforeend', newRecipe);
}

 
// Insert error message

const displayErrorMsg = function() {
     
    let errorMsg = `
    <h5 class="d-flex justify-content-center align-items-center mt-4 text-center"> Something went wrong😔 Try again.</h5>
    ` 
    recipesContainer.insertAdjacentHTML('beforeend', errorMsg);
}

const displayNoResultMsg = function() {
    let noResultMsg = `
    <h5 class="d-flex justify-content-center align-items-center mt-4 text-white text-center">No results found. Review your filters.</h5>
    ` 
    recipesContainer.insertAdjacentHTML('beforeend', noResultMsg);
}



// Show recipes  
let showRecipesBtn = document.getElementById('showRecipes');

const showRecipes = function() {

    let userSearch = document.getElementById('search-box').value.toLowerCase();
    let userFoodType = document.getElementById('food-type').value.toLowerCase();
    let userIntolerances = document.getElementById('intolerances-input').value.toLowerCase();


    // Fetch for recipes
    let recipes = document.querySelectorAll('recipe');

    if(recipesContainer.firstElementChild) {
        
        while(recipesContainer.firstElementChild ) {
            recipesContainer.removeChild(recipesContainer.firstElementChild);
        }
        
        const request = fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=25a15aa784734178a65ab99a8a2e3029&titleMatch=${userSearch}&diet=vegetarian&type=${userFoodType}&intolerances=${userIntolerances}&addRecipeInformation=true&addRecipeNutrition=true`
        )
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if(data.totalResults != 0) {
                data.results.forEach((recipe,index) => {
                    insertRecipe(recipe.image, recipe.title, recipe.readyInMinutes, recipe.servings, recipe.healthScore, recipe.sourceUrl, recipe.id, recipe.nutrition.caloricBreakdown.percentCarbs, recipe.nutrition.caloricBreakdown.percentFat, recipe.nutrition.caloricBreakdown.percentProtein);   
                })     
            } else {
 
                displayNoResultMsg();
            }
        })
        .catch(error => {
            displayErrorMsg(`${error.message}`);
        });
    } else {
        const request = fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=25a15aa784734178a65ab99a8a2e3029&titleMatch=${userSearch}&diet=vegetarian&type=${userFoodType}&intolerances=${userIntolerances}&addRecipeInformation=true&addRecipeNutrition=true`
        )
        .then(response => response.json())
        .then(data => {
            if(data.totalResults != 0) {
                data.results.forEach((recipe,index) => {
                    insertRecipe(recipe.image, recipe.title, recipe.readyInMinutes, recipe.servings, recipe.healthScore, recipe.sourceUrl, recipe.id, recipe.nutrition.caloricBreakdown.percentCarbs, recipe.nutrition.caloricBreakdown.percentFat, recipe.nutrition.caloricBreakdown.percentProtein);   
                })     
            } else {
 
                displayNoResultMsg();
            }     
        })
        .catch(error => {
            displayErrorMsg();
        });

         

    }

}

showRecipesBtn.addEventListener('click', showRecipes);


 

 
 



 

 



 
 



 