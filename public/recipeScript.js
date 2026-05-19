const params = new URLSearchParams(window.location.search);
const recipeID = Number(params.get('recipeID'));

let cuisineNameGlobal;

const includedIngredients = [];
const ingredientNames = [];
const ingredientAmounts = [];

let userSavedRecipe = false;

function capitalizeFirstOnly(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function removeIngredientAt(index) {
  includedIngredients.splice(index, 1);
  ingredientNames.splice(index, 1);
  ingredientAmounts.splice(index, 1);
  renderIncludedIngredients();
}

function renderIncludedIngredients() {
  const list = document.getElementById('included-ingredients-list');
  list.innerHTML = '';

  includedIngredients.forEach((item, index) => {
    const li = document.createElement('li');

    const text = document.createElement('span');
    text.textContent = item;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.style.marginLeft = '8px';
    removeBtn.addEventListener('click', () => removeIngredientAt(index));

    li.appendChild(text);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function addIngredientWithoutParams() {
  event.preventDefault();

  const ingredientName = document.getElementById('search-query-ingredient').value.trim();
  const amount = document.getElementById('ingredient-amount-descrip').value.trim();

  if (ingredientName === '' || amount === '') {
    alert('Invalid ingredient name or amount entered.');
    return;
  }

  const label = amount ? '- ' + amount + ' of ' + ingredientName : ingredientName;
  includedIngredients.push(label);
  ingredientNames.push(capitalizeFirstOnly(ingredientName));
  ingredientAmounts.push(amount);

  renderIncludedIngredients();

  document.getElementById('search-query-ingredient').value = '';
  document.getElementById('ingredient-amount-descrip').value = '';
}

function addIngredient(ingredientName, amount) {
  if (ingredientName === '' || amount === '') {
    alert('Invalid ingredient name or amount entered.');
    return;
  }

  const label = amount ? '- ' + amount + ' of ' + ingredientName : ingredientName;
  includedIngredients.push(label);
  ingredientNames.push(capitalizeFirstOnly(ingredientName));
  ingredientAmounts.push(amount);

  renderIncludedIngredients();

  document.getElementById('search-query-ingredient').value = '';
  document.getElementById('ingredient-amount-descrip').value = '';
}

async function obtainRecipe() {
  // const params = new URLSearchParams(window.location.search);
  // const recipeID = Number(params.get('recipeID'));

  if (!Number.isInteger(recipeID) || recipeID < 0) {
    alert('Invalid recipe link');
    return;
  }

  let response = await fetch('/select-recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clauses: [],
      predicates: ['RecipeID = ' + recipeID]
    })
  });

  let responseData = await response.json();

  if (!response.ok || !responseData.success || !Array.isArray(responseData.recipes) || responseData.recipes.length === 0) {
    alert('Recipe not found');
    return;
  }

  const row = responseData.recipes[0];
  const title = row[4];
  const instructions = row[5];
  cuisineNameGlobal = row[1];
  document.querySelector('.full-recipe h1').textContent = title;
  document.querySelectorAll('.full-recipe p')[0].textContent = 'Cuisine: ' + row[1] + ', Prep Time: ' + row[2] + ' mins, Servings: ' + row[3];
  document.querySelectorAll('.full-recipe p')[1].textContent = instructions;

  document.getElementById('create-recipe-name').value = title;
  document.getElementById('recipe-description').value = instructions;
  document.getElementById('cuisine-name').value = row[1];
  document.getElementById('time-estimate').value = row[2];
  document.getElementById('num-servings').value = row[3];

  response = await fetch('/fetch-ingredients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recID: recipeID
    })
  });

  responseData = await response.json();

  if (!response.ok || !responseData.success) {
    alert('Failed to load ingredients');
    return;
  }

  if (!Array.isArray(responseData.ingredients)) {
    alert('Did not return array for ingredients');
    return;
  }

  let container = document.getElementById('ingredients-list');
  container.innerHTML = '';

  for (const ingredient of responseData.ingredients) {
    const ingredientName = ingredient[1];
    const amount = ingredient[2];

    const card = document.createElement('li');
    card.innerHTML = '<p>' + amount + ' of ' + ingredientName + '</p>'
    container.appendChild(card);

    addIngredient(ingredientName, amount);
  }

  response = await fetch('/fetch-reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recID: recipeID
    })
  });

  responseData = await response.json();

  if (!response.ok || !responseData.success) {
    alert('Failed to load reviews');
    return;
  }

  if (!Array.isArray(responseData.reviews)) {
    alert('Did not return array for reviews');
    return;
  }

  container = document.getElementById('reviews-list');
  container.innerHTML = '';

  for (const review of responseData.reviews) {
    const reviewerName = review[2];

    let newResponse = await fetch('/associated-with-org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: reviewerName
      })
    });

    let newResponseData = await newResponse.json();

    if (!newResponseData.success) {
      alert('Failed to fetch associated organizations for reviewer');
      continue;
    }

    let organizationString = '';
    if (newResponseData.orgs.length > 0) {
      organizationString = `, ${newResponseData.orgs[0][0]}`;
    }

    newResponse = await fetch('/fetch-user-position', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: reviewerName
      })
    });

    newResponseData = await newResponse.json();

    if (!newResponseData.success) {
      alert('Failed to fetch profession for reviewer');
      continue;
    }

    let professionString = '';

    if (newResponseData.position.length > 0) {
      professionString = `, ${newResponseData.position[0][0]}`;
    }

    const rating = review[3].toFixed(1);;
    const comment = review[4];
    const reviewDate = review[5];
    const formattedDate = new Date(reviewDate).toLocaleDateString();

    const card = document.createElement('li');
    card.dataset.reviewer = reviewerName;
    card.innerHTML = '<h4>' + reviewerName + organizationString + professionString + ', ' + formattedDate + '</h4>' +
      '<p>Rating: ' + rating + '/5</p>' +
      '<p>Comment: ' + comment + '</p>'
    container.appendChild(card);
  }

  response = await fetch('/avgRatingByRecipe', { method: 'GET' });

  responseData = await response.json();

  if (!response.ok || !responseData.success) {
    alert('Failed to load average rating');
    return;
  }

  let avgRating;
  for (const rating of responseData.avgRatings) {
    if (rating[0] === recipeID) {
      avgRating = rating[2].toFixed(1);
      break;
    }
  }

  if (!avgRating) {
    alert('Could not find average rating (most likely no reviews exist yet)');
    document.querySelector('.reviews p').textContent = 'Average rating: N/A';
    return;
  }

  document.querySelector('.reviews p').textContent = 'Average rating: ' + avgRating + '/5';
}

async function submitReview() {
  event.preventDefault();

  console.log('submitting review');

  if (sessionStorage.getItem('userLoggedIn') != 'true') {
    alert('You must be logged in to submit a review');
    return;
  }

  const rating = Number(document.getElementById('rating-input').value.trim());
  const comment = document.getElementById('review-input').value.trim();

  if (Number.isNaN(rating) || rating > 5 || rating < 1) {
    alert('Given rating is invalid');
    return;
  }

  if (comment === '') {
    alert('Given comment is invalid');
    return;
  }

  const reviewID = Math.floor(Math.random() * 1_000_000);
  const reviewDate = new Date().toISOString().split('T')[0];

  response = await fetch('/insert-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reviewID: reviewID,
      userName: sessionStorage.getItem('username'),
      recID: recipeID,
      rating: rating,
      comment: comment,
      date: reviewDate
    })
  });

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    alert('Failed to submit review');
    return;
  } else {
    alert('Successfully submited review');
    window.location.reload();
  }
}

async function deleteRecipe() {
  const ok = confirm('Are you sure you want to delete this recipe?');
  if (!ok) return;

  console.log('deleting this recipe');

  response = await fetch('/delete-recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipeID: recipeID,
    })
  });

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    alert('Failed to delete recipe');
    return;
  } else {
    alert('Successfully deleted recipe');
    window.location.href = 'index.html';
  }
}

async function showUpdateRecipe() {
  const panel = document.getElementById('update-panel');
  if (!panel) return;

  panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'flex' : 'none'
}

async function submitRecipe() {
  event.preventDefault();

  if (sessionStorage.getItem('userLoggedIn') != 'true') {
    alert('You must be logged in to submit a recipe');
    return;
  }

  console.log("submitting recipe..");

  const recipeTitle = document.getElementById('create-recipe-name').value.trim();
  const instructions = document.getElementById('recipe-description').value.trim();
  const cuisineName = capitalizeFirstOnly(document.getElementById('cuisine-name').value.trim());
  const prepTimeEst = Number(document.getElementById('time-estimate').value.trim());
  const numOfServings = Number(document.getElementById('num-servings').value.trim());

  if (recipeTitle === '') {
    alert('Invalid name entered for recipe.');
    return;
  }

  if (cuisineName === '') {
    alert('Invalid name of cuisine entered for recipe');
    return;
  }

  if (Number.isNaN(prepTimeEst) || Number.isNaN(numOfServings)
    || prepTimeEst <= 0 || numOfServings <= 0) {

    alert('Invalid numbers for preparation time and/or number of servings.');
    return;
  }

  if (instructions === '') {
    alert('Invalid instructions for recipe entered');
    return;
  }

  if (ingredientNames.length === 0) {
    alert('At least one ingredient must be included before submitting');
    return;
  }

  const response = await fetch('/update-recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipeID: recipeID,
      cName: cuisineName,
      timeEstimate: prepTimeEst,
      servings: numOfServings,
      title: recipeTitle,
      instructions: instructions,
      ingredients: ingredientNames,
      ingredientAmounts: ingredientAmounts
    })
  });

  const responseData = await response.json();

  if (responseData.success) {
    alert('Recipe submitted.');

    window.location.reload();

  } else {
    alert('Error submitting recipe, please try again.');
  }
}

async function highlightExperts() {
  const response = await fetch('/fetch-expert-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cName: cuisineNameGlobal
    })
  });

  const responseData = await response.json();

  if (!responseData.success) {
    alert('Failed to get expert users');
    return;
  }

  const reviewItems = document.querySelectorAll('#reviews-list li');

  const expertUsers = new Set(responseData.users.map(row => row[0]));

  reviewItems.forEach((item) => {
    item.style.backgroundColor = '';
    item.style.border = '';

    if (expertUsers.has(item.dataset.reviewer)) {
      item.style.backgroundColor = '#fff6bf';
      item.style.border = '1px solid #e6c200';
    }
  });
}

async function saveRecipe() {
  if (userSavedRecipe === false) {
    const response = await fetch('/insert-saves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: sessionStorage.getItem('username'),
        recID: recipeID,
      })
    });

    const responseData = await response.json();

    if (!responseData.success) {
      alert('Failed to save recipe');
      return;
    } else {
      alert('Successfully saved recipe');
      document.getElementById('save-recipe-btn').textContent = `Unsave`;
      userSavedRecipe = true;
    }
  } else {
    const response = await fetch('/delete-saves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: sessionStorage.getItem('username'),
        recID: recipeID,
      })
    });

    const responseData = await response.json();

    if (!responseData.success) {
      alert('Failed to remove saved recipe');
      return;
    } else {
      alert('Successfully removed saved recipe');
      document.getElementById('save-recipe-btn').textContent = `Save`;
      userSavedRecipe = false;
    }
  }

}

async function initRecipePage() {
  document.getElementById('delete-recipe-btn').hidden = true;
  document.getElementById('update-recipe-btn').hidden = true;
  document.getElementById('save-recipe-btn').hidden = true;

  const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';

  if (isLoggedIn) {
    const response = await fetch('/user-created-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: sessionStorage.getItem('username'),
        recID: recipeID,
      })
    });

    const responseData = await response.json();

    if (responseData.result === true) {
      document.getElementById('delete-recipe-btn').hidden = false;
      document.getElementById('update-recipe-btn').hidden = false;
    } else {
      saveRecipeBtn = document.getElementById('save-recipe-btn');
      saveRecipeBtn.hidden = false;

      const response = await fetch('/join-saved-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: sessionStorage.getItem('username')
        })
      });

      const responseData = await response.json();

      console.log(responseData.savedRecipes.map(item => item[0]));
      console.log(recipeID);

      if (responseData.savedRecipes.map(item => item[0]).includes(recipeID)) {
        saveRecipeBtn.textContent = `Unsave`;
        userSavedRecipe = true;
      }
    }
  }

  obtainRecipe();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRecipePage);
} else {
  initRecipePage();
}

window.onload = function () {
  document.getElementById('review-form').addEventListener('submit', submitReview);
  document.getElementById('delete-recipe-btn').addEventListener('click', deleteRecipe);
  document.getElementById('update-recipe-btn').addEventListener('click', showUpdateRecipe);
  document.getElementById('highlight-experts').addEventListener('click', highlightExperts);
  document.getElementById("addIngredient").addEventListener("submit", addIngredientWithoutParams);
  document.getElementById("submitRecipe").addEventListener("submit", submitRecipe);
  document.getElementById("save-recipe-btn").addEventListener("click", saveRecipe);
};