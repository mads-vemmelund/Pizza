const defaults = {
  flour: { label: 'Hvedemel', value: 250, unit: 'g' },
  yeast: { label: 'Tørgær', value: 3.5, unit: 'g' },
  salt: { label: 'Salt', value: 0.5, unit: 'tsk' },
  sugar: { label: 'Sukker', value: 0.5, unit: 'tsk' },
  oil: { label: 'Olivenolie', value: 1, unit: 'spsk' },
  water: { label: 'Lunkent vand', value: 150, unit: 'ml' }
};

const state = {
  people: 2,
  recipe: {
    flour: 250,
    yeast: 3.5,
    salt: 0.5,
    sugar: 0.5,
    oil: 1,
    water: 150
  }
};

const clampPeople = (value) => Math.min(12, Math.max(1, Number(value) || 2));

function render() {
  const multiplier = state.people / 2;

  document.getElementById('peopleCount').value = state.people;
  document.getElementById('peopleRange').value = state.people;

  Object.entries(state.recipe).forEach(([key, value]) => {
    const input = document.getElementById(key);
    input.value = value;
  });

  const ingredientList = document.getElementById('ingredientList');
  ingredientList.innerHTML = '';

  Object.entries(defaults).forEach(([key, item]) => {
    const scaledValue = state.recipe[key] * multiplier;
    const formatted = Number.isInteger(scaledValue) ? scaledValue : scaledValue.toFixed(1);

    const li = document.createElement('li');
    li.innerHTML = `
      <span class="name">${item.label}</span>
      <span class="amount">${formatted} ${item.unit}</span>
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
  render();
});

peopleRangeInput.addEventListener('input', (event) => {
  state.people = clampPeople(event.target.value);
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
    render();
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  state.people = 2;
  Object.keys(defaults).forEach((key) => {
    state.recipe[key] = defaults[key].value;
  });
  render();
});

render();
