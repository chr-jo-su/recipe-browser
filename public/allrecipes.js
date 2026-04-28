const includedAttributes = [];

async function updateDisplayedAttributes() {
  let includedAttributesString = includedAttributes.join(', ');
  document.getElementById('projected-attributes').textContent = "Current projected attributes: " + includedAttributesString;

  const response = await fetch('/project-recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      attributes: includedAttributes 
    })
  });

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    alert('Error occured while searching for recipes');
    return;
  }

  const theadRow = document.querySelector('#recipe-table thead tr');
  const tbody = document.getElementById('recipe-table-body');

  theadRow.innerHTML = '';
  tbody.innerHTML = '';

  includedAttributes.forEach((attr) => {
    const th = document.createElement('th');
    th.textContent = attr;
    theadRow.appendChild(th);
  })

  responseData.projection.forEach((row) => {
    const tr = document.createElement('tr');

    row.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

document.getElementById('toggle-recipeID').addEventListener('click', () => {
  if (!includedAttributes.includes('RecipeID')) {
    includedAttributes.push('RecipeID');
    updateDisplayedAttributes();
  }
});

document.getElementById('toggle-cuisine').addEventListener('click', () => {
  if (!includedAttributes.includes('CName')) {
    includedAttributes.push('CName');
    updateDisplayedAttributes();
  }
});

document.getElementById('toggle-time').addEventListener('click', () => {
  if (!includedAttributes.includes('TimeEstimate')) {
    includedAttributes.push('TimeEstimate');
    updateDisplayedAttributes();
  }
});

document.getElementById('toggle-servings').addEventListener('click', () => {
  if (!includedAttributes.includes('Servings')) {
    includedAttributes.push('Servings');
    updateDisplayedAttributes();
  }
});

document.getElementById('toggle-title').addEventListener('click', () => {
  if (!includedAttributes.includes('Title')) {
    includedAttributes.push('Title');
    updateDisplayedAttributes();
  }
});

document.getElementById('clear-attributes').addEventListener('click', () => {
  includedAttributes.length = 0;
  updateDisplayedAttributes();
});