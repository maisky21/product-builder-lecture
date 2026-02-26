const numbersContainer = document.getElementById('numbers-container');
const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');

// Theme Toggle Logic
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode';
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.textContent = 'Dark Mode';
  }
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});

initTheme();

function generateSingleSet() {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers() {
  numbersContainer.innerHTML = ''; // Clear previous numbers
  
  for (let i = 0; i < 5; i++) { // Generate 5 rows
    const row = document.createElement('div');
    row.classList.add('number-row');
    const numbers = generateSingleSet();
    
    numbers.forEach((number, index) => {
      const numberEl = document.createElement('div');
      numberEl.classList.add('number', `row-${i + 1}`); // Add row-specific class
      numberEl.textContent = number;
      
      // Stagger the animation for each number
      numberEl.style.animationDelay = `${i * 0.1 + index * 0.05}s`;
      
      row.appendChild(numberEl);
    });
    
    numbersContainer.appendChild(row);
  }
}

generateBtn.addEventListener('click', displayNumbers);

// Generate initial set of numbers on page load
displayNumbers();
