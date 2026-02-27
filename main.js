document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const generateBtn = document.getElementById('generate-btn');
    const shareBtn = document.getElementById('share-btn');
    const lottoContainer = document.getElementById('lotto-container');
    const captureArea = document.getElementById('capture-area');
    const currentDateEl = document.getElementById('current-date');

    // --- 초기 설정 ---
    initTheme();
    setCurrentDate();

    // --- 이벤트 리스너 ---
    themeToggle.addEventListener('click', toggleTheme);
    generateBtn.addEventListener('click', generateLottoSets);
    shareBtn.addEventListener('click', captureAndShare);

    // --- 날짜 설정 ---
    function setCurrentDate() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        currentDateEl.textContent = now.toLocaleDateString('ko-KR', options);
    }

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
    async function generateLottoSets() {
        generateBtn.disabled = true;
        shareBtn.classList.add('hidden');
        lottoContainer.innerHTML = ''; 

        for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
            const row = document.createElement('div');
            row.classList.add('lotto-row');
            lottoContainer.appendChild(row);

            const numbers = generateUniqueNumbers();
            
            for (let i = 0; i < numbers.length; i++) {
                const ball = createBall(numbers[i]);
                row.appendChild(ball);
                
                await new Promise(resolve => setTimeout(resolve, 60));
                ball.classList.add('visible');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        generateBtn.disabled = false;
        shareBtn.classList.remove('hidden');
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
        
        if (number <= 10) ball.classList.add('yellow');
        else if (number <= 20) ball.classList.add('blue');
        else if (number <= 30) ball.classList.add('red');
        else if (number <= 40) ball.classList.add('gray');
        else ball.classList.add('green');
        
        return ball;
    }

    // --- 캡처 및 공유 함수 ---
    function captureAndShare() {
        if (typeof html2canvas === 'undefined') {
            alert('이미지 생성 라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        // 캡처 시 배경색이 테마에 맞게 나오도록 설정
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const bgColor = isDark ? '#2d1b4d' : '#ffffff';

        html2canvas(captureArea, {
            backgroundColor: bgColor,
            scale: 2, // 고화질 캡처
            logging: false,
            useCORS: true
        }).then(canvas => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `행운의번호_${new Date().getTime()}.png`;
            link.click();
            
            // 모바일 Share API 지원 시 (선택 사항)
            if (navigator.share) {
                canvas.toBlob(blob => {
                    const file = new File([blob], 'lucky_numbers.png', { type: 'image/png' });
                    navigator.share({
                        files: [file],
                        title: '오늘의 행운 번호',
                        text: '오늘의 행운 번호를 확인해보세요! 🔮'
                    }).catch(console.error);
                });
            }
        });
    }
});
