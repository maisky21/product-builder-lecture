const numbersContainer = document.getElementById('numbers-container');
const generateBtn = document.getElementById('generate-btn');

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
