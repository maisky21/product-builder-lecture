document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const generateBtn = document.getElementById('generate-btn');
    const shareBtn = document.getElementById('share-btn');
    const lottoContainer = document.getElementById('lotto-container');
    const captureArea = document.getElementById('capture-area');
    const currentDateEl = document.getElementById('current-date');
    const bgIconsContainer = document.getElementById('bg-icons');
    const fortuneContainer = document.getElementById('fortune-container');
    const fortuneText = document.getElementById('fortune-text');

    const fortunes = [
        "오늘은 금전운이 최고조입니다! 망설이지 마세요.",
        "예상치 못한 곳에서 행운이 찾아올 것입니다.",
        "작은 인연이 큰 복으로 돌아오는 하루입니다.",
        "스스로를 믿는 마음이 곧 최고의 행운입니다.",
        "긍정적인 생각이 황금빛 미래를 만듭니다.",
        "오늘 당신의 직감은 완벽합니다. 그대로 믿으세요!",
        "하늘이 당신의 편을 들어주는 날입니다.",
        "포기하지 않았던 일에서 결실을 맺게 됩니다.",
        "주변 사람과 행운을 나누면 복이 배가 됩니다.",
        "빛나는 보석처럼 당신의 하루도 반짝일 거예요."
    ];

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

    // --- 사운드 효과 ---
    function playPopSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
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

    function playFinalSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);

            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
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
        fortuneContainer.classList.add('hidden');
        lottoContainer.innerHTML = ''; 

        const allRowsBalls = [];

        // 5개 세트 생성
        for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
            const row = document.createElement('div');
            row.classList.add('lotto-row');
            lottoContainer.appendChild(row);

            const targetNumbers = generateUniqueNumbers();
            const balls = [];

            // 초기 공들 생성
            for (let i = 0; i < 6; i++) {
                const ball = createBall('?');
                row.appendChild(ball);
                balls.push(ball);
                
                await new Promise(resolve => setTimeout(resolve, 30));
                ball.classList.add('visible');
            }
            allRowsBalls.push({ balls, targetNumbers });
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // 각 행의 공마다 슬롯머신 효과 적용 (순차적으로)
        for (let rowIdx = 0; rowIdx < allRowsBalls.length; rowIdx++) {
            const { balls, targetNumbers } = allRowsBalls[rowIdx];
            
            for (let i = 0; i < balls.length; i++) {
                const ball = balls[i];
                ball.classList.add('spinning');
                
                // 0.6초간 돌아가기 (5개 세트이므로 속도 조절)
                const startTime = Date.now();
                while (Date.now() - startTime < 600) {
                    ball.textContent = Math.floor(Math.random() * 45) + 1;
                    await new Promise(resolve => setTimeout(resolve, 50));
                }

                // 멈춤
                ball.classList.remove('spinning');
                const finalNum = targetNumbers[i];
                ball.textContent = finalNum;
                applyBallColor(ball, finalNum);
                ball.style.transform = 'scale(1.1)';
                setTimeout(() => ball.style.transform = 'scale(1)', 200);
                
                playPopSound();
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // 마지막 행 완료 시 효과
            if (rowIdx === allRowsBalls.length - 1) {
                triggerConfetti();
                showFortune();
                playFinalSound();
            }
            await new Promise(resolve => setTimeout(resolve, 200));
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

    function createBall(text) {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.textContent = text;
        ball.style.background = 'linear-gradient(135deg, #e0e0e0, #bdbdbd)';
        return ball;
    }

    function applyBallColor(ball, number) {
        ball.className = 'ball visible'; // 초기화
        const colorIdx = Math.min(8, Math.floor((number - 1) / 5));
        ball.classList.add(`c${colorIdx}`);
    }

    function triggerConfetti() {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 7,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FFA500', '#FF8C00']
            });
            confetti({
                particleCount: 7,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#FFA500', '#FF8C00']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    function showFortune() {
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        fortuneText.textContent = `🍀 행운의 조언: ${randomFortune}`;
        fortuneContainer.classList.remove('hidden');
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
