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
        
        // 새로운 행 생성
        const row = document.createElement('div');
        row.classList.add('lotto-row');
        lottoContainer.prepend(row); // 최신 세트가 위로 오도록 추가

        const numbers = generateUniqueNumbers();
        
        // 왼쪽에서 오른쪽으로 하나씩 생성 및 애니메이션
        for (let i = 0; i < numbers.length; i++) {
            const ball = createBall(numbers[i]);
            row.appendChild(ball);
            
            // 약간의 딜레이 후 가시화 (애니메이션 유도)
            await new Promise(resolve => setTimeout(resolve, 150));
            ball.classList.add('visible');
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
