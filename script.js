const defaults = {
  flour: { label: 'Hvedemel', value: 250, unit: 'g' },
  gluten: { label: 'Gluten', value: 10, unit: 'g' },
  yeast: { label: 'Tørgær', value: 3.5, unit: 'g' },
  salt: { label: 'Salt', value: 0.5, unit: 'tsk' },
  sugar: { label: 'Sukker', value: 0.5, unit: 'tsk' },
  oil: { label: 'Olivenolie', value: 1, unit: 'spsk' },
  water: { label: 'Lunkent vand', value: 150, unit: 'ml' }
};

const basePeople = 2;

const state = {
  people: basePeople,
  recipe: {
    flour: 250,
    gluten: 10,
    yeast: 3.5,
    salt: 0.5,
    sugar: 0.5,
    oil: 1,
    water: 150
  }
};

const clampPeople = (value) => Math.min(12, Math.max(1, Number(value) || basePeople));

const normalizeNumber = (value) => {
  if (!Number.isFinite(value)) return 0;
  const rounded = Number(value.toFixed(2));
  return Number.isInteger(rounded) ? rounded : Number(rounded.toFixed(1));
};

const buildScaledRecipe = (people) => {
  const multiplier = people / basePeople;
  const result = {};

  Object.entries(defaults).forEach(([key, item]) => {
    result[key] = normalizeNumber(item.value * multiplier);
  });

  return result;
};

function render() {
  const multiplier = state.people / basePeople;

  document.getElementById('peopleCount').value = state.people;
  document.getElementById('peopleRange').value = state.people;

  Object.entries(state.recipe).forEach(([key, value]) => {
    const input = document.getElementById(key);
    input.value = value;
  });

  const ingredientList = document.getElementById('ingredientList');
  ingredientList.innerHTML = '';

  Object.entries(defaults).forEach(([key, item]) => {
    const amount = state.recipe[key];
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="name">${item.label}</span>
      <span class="amount">${amount} ${item.unit}</span>
    `;
    ingredientList.appendChild(li);
  });

  document.getElementById('multiplierDisplay').textContent = `${multiplier.toFixed(1)}x`;
  document.getElementById('peopleLabel').textContent = `${state.people} personer`;
  document.getElementById('factorLabel').textContent = multiplier.toFixed(1);
}

const peopleCountInput = document.getElementById('peopleCount');
const peopleRangeInput = document.getElementById('peopleRange');

peopleCountInput.addEventListener('input', (event) => {
  state.people = clampPeople(event.target.value);
  state.recipe = buildScaledRecipe(state.people);
  render();
});

peopleRangeInput.addEventListener('input', (event) => {
  state.people = clampPeople(event.target.value);
  state.recipe = buildScaledRecipe(state.people);
  render();
});

Object.keys(defaults).forEach((key) => {
  const input = document.getElementById(key);

  input.addEventListener('input', (event) => {
    const nextValue = Number(event.target.value);
    if (!Number.isFinite(nextValue) || nextValue < 0) {
      return;
    }

    state.recipe[key] = nextValue;
  });

  const finalizeIngredientEdit = (event) => {
    const nextValue = Number(event.target.value);
    if (!Number.isFinite(nextValue) || nextValue < 0) {
      return;
    }

    const baseValue = defaults[key].value;
    const derivedPeople = clampPeople((nextValue / baseValue) * basePeople);
    state.people = derivedPeople;
    state.recipe = buildScaledRecipe(state.people);
    render();
  };

  input.addEventListener('change', finalizeIngredientEdit);
  input.addEventListener('blur', finalizeIngredientEdit);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  state.people = basePeople;
  state.recipe = buildScaledRecipe(state.people);
  render();
});

state.recipe = buildScaledRecipe(state.people);
render();
