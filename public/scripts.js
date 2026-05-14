const includedIngredients = [];
// const ingredientNames = [];
// const ingredientAmounts = [];

const addedClauses = [];
const addedPredicates = [];
const fullSearchConditions = [];

const contIngredients = [];
const notContIngredients = [];

const fullSearchFilters = [];
const indxOfFilters = [];

function removeConditionAt(index) {
  fullSearchConditions.splice(index, 1);
  addedClauses.splice(index, 1);
  addedPredicates.splice(index, 1);
  renderIncludedConditions();
}

function removeFilterAt(index) {
  if (fullSearchFilters[index].startsWith('Contains')) {
    contIngredients.splice(indxOfFilters[index], 1);
    indxOfFilters.splice(index, 1);
  } else {
    notContIngredients.splice(indxOfFilters[index], 1);
    indxOfFilters.splice(index, 1);
  }
  fullSearchFilters.splice(index, 1);
  renderIncludedFilters();
}

function renderIncludedConditions() {
  const list = document.getElementById('search-conditions-list');
  list.innerHTML = '';

  fullSearchConditions.forEach((item, index) => {
    const li = document.createElement('li');
    
    const text = document.createElement('span');
    text.textContent = item;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.style.marginLeft = '8px';
    removeBtn.addEventListener('click', () => removeConditionAt(index));

    li.appendChild(text);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function renderIncludedFilters() {
  const list = document.getElementById('search-filters-list');
  list.innerHTML = '';

  fullSearchFilters.forEach((item, index) => {
    const li = document.createElement('li');
    
    const text = document.createElement('span');
    text.textContent = item;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.style.marginLeft = '8px';
    removeBtn.addEventListener('click', () => removeFilterAt(index));

    li.appendChild(text);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function renderRecipeCards(containerId, recipes, recipeIdIndex) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  for (const recipe of recipes) {
    const recipeId = recipe[recipeIdIndex];
    const title = recipe[4 + recipeIdIndex]; // hacky solution to inconsistent indices of recipe attributes
    const card = document.createElement('div');

    card.className = 'recommended-item';
    card.style.cursor = 'pointer';
    card.style.textDecoration = 'underline';
    card.style.color = '#007bff';
    card.style.textDecorationColor = '#007bff';
    card.innerHTML =  '<p>- ' + title + '</p>';
    card.addEventListener('click', function() {
      window.location.href = 'recipe.html?recipeID=' + recipeId;
    });
    container.appendChild(card);
  }
}

function removeIngredientAt(index) {
  /* includedIngredients.splice(index, 1);
  ingredientNames.splice(index, 1);
  ingredientAmounts.splice(index, 1); */
  
  includedIngredients.splice(index, 1);
  renderIncludedIngredients();
}

function renderIncludedIngredients() {
  const list = document.getElementById('included-ingredients-list');
  list.innerHTML = '';

  includedIngredients.forEach((item, index) => {
    const li = document.createElement('li');
    
    const text = document.createElement('span');
    text.textContent = item.label;

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

function capitalizeFirstOnly(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function refreshLists() {
  let response = await fetch('/fetch-popular-recipes', {method: 'GET'});

  let responseData = await response.json();

  if (!response.ok || !responseData.success || !Array.isArray(responseData.recipes)) {
    alert('Failed to load recommended recipes');
    return;
  }

  renderRecipeCards('recommended', responseData.recipes, 0);

  if (sessionStorage.getItem('userLoggedIn') === 'true') {
    // TODO:

    response = await fetch('/fetch-recipes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userName: sessionStorage.getItem('username')
      })
    });

    responseData = await response.json();

    if (!response.ok || !responseData.success ) {
      alert('Failed to load created recipes for ' + sessionStorage.getItem('username'));
      return;
    }

    if (!Array.isArray(responseData.recipes)) {
      alert('Did not return array for created recipes for ' + sessionStorage.getItem('username'));
      return;
    }

    renderRecipeCards('created', responseData.recipes, 1);

    response = await fetch('/join-saved-recipes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userName: sessionStorage.getItem('username')
      })
    });

    responseData = await response.json();

    if (!response.ok || !responseData.success ) {
      alert('Failed to load saved recipes for ' + sessionStorage.getItem('username'));
      return;
    }

    if (!Array.isArray(responseData.savedRecipes)) {
      alert('Did not return array for saved recipes for ' + sessionStorage.getItem('username'));
      return;
    }

    renderRecipeCards('saved', responseData.savedRecipes, 0); 
  }
}

async function submitRecipe() {
  event.preventDefault();

  if(sessionStorage.getItem('userLoggedIn') != 'true') {
    alert('You must be logged in to submit a recipe');
    return;
  }

  console.log("submitting recipe..");

  const recipeTitle = document.getElementById('create-recipe-name').value.trim();
  const instructions = document.getElementById('recipe-description').value.trim();
  const cuisineName = capitalizeFirstOnly(document.getElementById('cuisine-name').value.trim());
  const prepTimeEst = Number(document.getElementById('time-estimate').value.trim());
  const numOfServings = Number(document.getElementById('num-servings').value.trim());
  const recipeID = Math.floor(Math.random() * 1_000_000);

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

  if (includedIngredients.length === 0) {
    alert('At least one ingredient must be included before submitting');
    return;
  }

  const response = await fetch('/submit-recipe', {
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
      ingredients: includedIngredients.map(item => item.name),
      ingredientAmounts: includedIngredients.map(item => item.amount)
    })
  });

  const responseData = await response.json();

  const nextResponse = await fetch('/insert-creates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userName: sessionStorage.getItem('username'),
      recID: recipeID
    })
  });

  const nextResponseData = await nextResponse.json()

  if (responseData.success && nextResponseData.success) {
    alert('Recipe submitted.');

    document.getElementById('create-recipe-name').value = '';
    document.getElementById('recipe-description').value = '';
    document.getElementById('cuisine-name').value = '';
    document.getElementById('time-estimate').value = '';
    document.getElementById('num-servings').value = '';
    includedIngredients.length = 0;
    ingredientAmounts.length = 0;
    ingredientNames.length = 0;

    renderIncludedIngredients();
    refreshLists();

  } else {
    alert('Error submitting recipe, please try again.');
  }
}

async function searchRecipes() {
  event.preventDefault();
  console.log("searching for recipes...");

  const searchQuery = document.getElementById('search-query').value.trim();
  const onlyTopCuisine = document.querySelector('input[name="only-top-cuisine"]');
  
  const predicates = [`UPPER(Title) LIKE UPPER('%${searchQuery}%')`];
  const clauses = [];

  if (onlyTopCuisine.checked) {
    let response = await fetch('/fetch-top-cuisine', {method: 'GET'});
    
    let responseData = await response.json();

    if (!response.ok || !responseData.success) {
      alert('Error occured while searching for recipes');
      return;
    }

    predicates.push(`CName = '${responseData.cuisine[0][0]}'`);
    clauses.push(`AND`);
  } else {
    clauses.push(...addedClauses);
    predicates.push(...addedPredicates);
  }

  
  response = await fetch('/select-recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      predicates: predicates,
      clauses: clauses,
      contains: contIngredients,
      notContains: notContIngredients
    })
  });

  responseData = await response.json();

  if (!response.ok || !responseData.success) {
    alert('Error occured while searching for recipes (likely invalid search conditions, please check for correctness)');
    return;
  }

  if (responseData.recipes.length === 0) {
    alert('No recipes with the given search conditions could be found');
    return;
  }
   
  renderRecipeCards('search-results', responseData.recipes, 0); 
}

async function tryLogin() {
  event.preventDefault();
  console.log("trying login...");

  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();

  if (user === '') {
    alert('Invalid username entered.');
    return;
  } else if (pass === '') {
    alert('Invalid password entered.');
    return;
  }

  const response = await fetch('/verify-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: user,
      userPassword: pass
    })
  });

  const responseData = await response.json();

  if (response.ok && responseData.success) {
    alert('Successful login');

    sessionStorage.setItem('userLoggedIn', 'true');
    sessionStorage.setItem('username', user);

    refreshLists();
  } else {
    alert('Invalid username or password');
  }
}

async function addIngredient() {
  event.preventDefault();
  console.log("adding ingredient...");

  const ingredientName = document.getElementById('search-query-ingredient').value.trim();
  const amount = document.getElementById('ingredient-amount-descrip').value.trim();

  if (ingredientName === '' || amount === '') {
    alert('Invalid ingredient name or amount entered.');
    return;
  }


  const label = amount ? '- ' + amount + ' of ' + ingredientName : ingredientName;
  // includedIngredients.push(label);
  // ingredientNames.push(capitalizeFirstOnly(ingredientName));
  // ingredientAmounts.push(amount);

  includedIngredients.push({label: label, name: capitalizeFirstOnly(ingredientName), amount: amount});

  renderIncludedIngredients();

  document.getElementById('search-query-ingredient').value = '';
  document.getElementById('ingredient-amount-descrip').value = '';
}

async function searchIngredients() {
  event.preventDefault();
  console.log("searching ingredients...");
}

async function addClausePredicate() {
  console.log("adding clause predicate");

  const value = document.getElementById("search-condition-value").value.trim();
  const valueAsNumber = Number(value);
  const clause = document.getElementById("search-condition-clause").value;
  const attribute = document.getElementById("search-condition-attribute").value;
  const op = document.getElementById("search-condition-op").value;
  
  const isNumber = valueAsNumber !== "" && !Number.isNaN(valueAsNumber);
  const isString = valueAsNumber !== "" && Number.isNaN(valueAsNumber);
  
  if (isNumber) {
    addedPredicates.push(`${attribute} ${op} ${value}`);
  } else if (isString) {
    addedPredicates.push(`${attribute} ${op} '${value}'`);
  } else {
    alert('Invalid condition value');
    return;
  }


  const label = `${clause} ${attribute} ${op} ${value}`;
  fullSearchConditions.push(label);
  addedClauses.push(clause);

  renderIncludedConditions();

  document.getElementById('search-condition-value').value = '';
}

async function addFilter() {
  console.log("adding filter");

  var name = document.getElementById("ingredient-name").value.trim();
  const contains = document.getElementById("ingredient-filter").value === "Cont";
  const notContains = document.getElementById("ingredient-filter").value === "DNCont";

  const isString = (typeof name === 'string' && name.length > 0);
  
  if (isString) {
    name = capitalizeFirstOnly(name);
    if (contains) {
      contIngredients.push(`${name}`);
      indxOfFilters.push(contIngredients.length - 1);
    } else if (notContains) {
      notContIngredients.push(`${name}`);
      indxOfFilters.push(notContIngredients.length - 1);
    }
  } else {
    alert('Invalid ingredient name');
    return;
  }

  const label = `${contains ? 'Contains' : 'Not containing'} ${name}`;
  fullSearchFilters.push(label);

  renderIncludedFilters();

  document.getElementById('ingredient-name').value = '';
}

window.onload = function () {
  document.getElementById("submitRecipe").addEventListener("submit", submitRecipe);
  document.getElementById("searchRecipes").addEventListener("submit", searchRecipes);
  document.getElementById("login").addEventListener("submit", tryLogin);
  document.getElementById("addIngredient").addEventListener("submit", addIngredient);
  document.getElementById("refresh-recommended-btn").addEventListener("click", refreshLists);
  document.getElementById("add-select").addEventListener("click", addClausePredicate);
  document.getElementById("add-filter").addEventListener("click", addFilter);

  refreshLists();
};

document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';

  if (isLoggedIn) {
    alert('Logged in as ' + sessionStorage.getItem('username'));
    refreshLists();
  }
});

document.getElementById('recipe-project').addEventListener('click', () => {
  window.location.href = 'allrecipes.html';
});