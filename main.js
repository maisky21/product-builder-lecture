document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const generateBtn = document.getElementById('generate-btn');
    const shareBtn = document.getElementById('share-btn');
    const lottoContainer = document.getElementById('lotto-container');
    const captureArea = document.getElementById('capture-area');
    const currentDateEl = document.getElementById('current-date');
    const bgIconsContainer = document.getElementById('bg-icons');

    // --- 초기 설정 ---
    initTheme();
    setCurrentDate();
    createFloatingIcons();

    // --- 이벤트 리스너 ---
    themeToggle.addEventListener('click', toggleTheme);
    generateBtn.addEventListener('click', generateLottoSets);
    shareBtn.addEventListener('click', captureAndShare);

    // --- 배경 아이콘 생성 ---
    function createFloatingIcons() {
        const icons = ['🍀', '💰', '💎', '✨', '🪙'];
        const count = 15;
        
        for (let i = 0; i < count; i++) {
            const icon = document.createElement('span');
            icon.className = 'floating-icon';
            icon.textContent = icons[Math.floor(Math.random() * icons.length)];
            icon.style.left = Math.random() * 100 + 'vw';
            icon.style.animationDelay = Math.random() * 15 + 's';
            icon.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            bgIconsContainer.appendChild(icon);
        }
    }

    // --- 사운드 효과 (Web Audio API 사용 예시) ---
    // 실제 파일을 연결하려면 new Audio('path/to/sound.mp3')를 사용하세요.
    function playPopSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
            oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.log('Audio playback failed', e);
        }
    }

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
        setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light');
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
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
                
                // 요청하신 0.1초(100ms) 간격 시차
                await new Promise(resolve => setTimeout(resolve, 100));
                ball.classList.add('visible');
                ball.classList.add('pop');
                playPopSound(); // 번호가 나올 때 효과음
            }
            await new Promise(resolve => setTimeout(resolve, 150));
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
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const bgColor = isDark ? '#2d1b4d' : '#ffffff';

        html2canvas(captureArea, {
            backgroundColor: bgColor,
            scale: 2,
            useCORS: true
        }).then(canvas => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `lucky_${new Date().getTime()}.png`;
            link.click();
        });
    }
});
