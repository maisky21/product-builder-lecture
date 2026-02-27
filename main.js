document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const generateBtn = document.getElementById('generate-btn');
    const lottoContainer = document.getElementById('lotto-container');

    // --- 초기 설정 ---
    initTheme();

    // --- 이벤트 리스너 ---
    themeToggle.addEventListener('click', toggleTheme);
    generateBtn.addEventListener('click', generateLottoSet);

    // --- 테마 관련 함수 ---
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // --- 로또 생성 관련 함수 ---
    async function generateLottoSet() {
        generateBtn.disabled = true;
        lottoContainer.innerHTML = ''; // 기존 번호 초기화 (선택 사항: 누를 때마다 새로 5세트)

        for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
            // 새로운 행 생성
            const row = document.createElement('div');
            row.classList.add('lotto-row');
            lottoContainer.appendChild(row); // 5세트를 순서대로 아래로 추가

            const numbers = generateUniqueNumbers();
            
            // 각 행의 번호를 왼쪽에서 오른쪽으로 하나씩 생성 및 애니메이션
            for (let i = 0; i < numbers.length; i++) {
                const ball = createBall(numbers[i]);
                row.appendChild(ball);
                
                // 번호 간의 딜레이
                await new Promise(resolve => setTimeout(resolve, 80));
                ball.classList.add('visible');
            }
            
            // 행 간의 약간의 딜레이 (선택 사항)
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        generateBtn.disabled = false;
    }

    function generateUniqueNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function createBall(number) {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.textContent = number;
        
        // 숫자 범위에 따른 색상 지정
        if (number <= 10) ball.classList.add('yellow');
        else if (number <= 20) ball.classList.add('blue');
        else if (number <= 30) ball.classList.add('red');
        else if (number <= 40) ball.classList.add('gray');
        else ball.classList.add('green');
        
        return ball;
    }
});
