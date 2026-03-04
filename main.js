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

    let audioCtx = null;
    let silentNode = null;

    const softColors = [
        { bg: 'linear-gradient(45deg, #fce4ec, #f8bbd0)', shadow: 'rgba(240, 98, 146, 0.3)', text: '#ad1457' },
        { bg: 'linear-gradient(45deg, #e1f5fe, #b3e5fc)', shadow: 'rgba(3, 169, 244, 0.3)', text: '#0277bd' },
        { bg: 'linear-gradient(45deg, #e8f5e9, #c8e6c9)', shadow: 'rgba(76, 175, 80, 0.3)', text: '#2e7d32' },
        { bg: 'linear-gradient(45deg, #f3e5f5, #e1bee7)', shadow: 'rgba(156, 39, 176, 0.3)', text: '#6a1b9a' },
        { bg: 'linear-gradient(45deg, #fffde7, #fff9c4)', shadow: 'rgba(251, 192, 45, 0.3)', text: '#f57f17' },
        { bg: 'linear-gradient(45deg, #ffd700, #ffecb3)', shadow: 'rgba(255, 215, 0, 0.4)', text: '#4a148c' }
    ];

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

    initTheme();
    setCurrentDate();
    createFloatingIcons();

    themeToggle.addEventListener('click', toggleTheme);
    generateBtn.addEventListener('click', () => {
        initAudio(); 
        startSilentLoop();
        changeBtnColor();
        generateLottoSets();
    });
    shareBtn.addEventListener('click', captureAndShare);

    function changeBtnColor() {
        const color = softColors[Math.floor(Math.random() * softColors.length)];
        generateBtn.style.background = color.bg;
        generateBtn.style.boxShadow = `0 6px 25px ${color.shadow}`;
        generateBtn.style.color = color.text;
    }

    function createFloatingIcons() {
        const icons = ['🍀', '💰', '💎', '✨', '🪙'];
        for (let i = 0; i < 15; i++) {
            const icon = document.createElement('span');
            icon.className = 'floating-icon';
            icon.textContent = icons[Math.floor(Math.random() * icons.length)];
            icon.style.left = Math.random() * 100 + 'vw';
            icon.style.animationDelay = Math.random() * 15 + 's';
            bgIconsContainer.appendChild(icon);
        }
    }

    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function startSilentLoop() {
        if (!audioCtx) return;
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        silentNode = audioCtx.createBufferSource();
        silentNode.buffer = buffer;
        silentNode.loop = true;
        silentNode.connect(audioCtx.destination);
        silentNode.start();
    }

    function stopSilentLoop() {
        if (silentNode) {
            try { silentNode.stop(); } catch (e) {}
            silentNode = null;
        }
    }

    function playPopSound() {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {}
    }

    function playFinalSound() {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        } catch (e) {}
    }

    function setCurrentDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        currentDateEl.textContent = new Date().toLocaleDateString('ko-KR', options);
    }

    function initTheme() {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(saved === 'dark' || (!saved && prefersDark) ? 'dark' : 'light');
    }

    function toggleTheme() {
        setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    async function generateLottoSets() {
        generateBtn.disabled = true;
        shareBtn.classList.add('hidden');
        fortuneContainer.classList.add('hidden');
        lottoContainer.innerHTML = ''; 

        const allRowsBalls = [];
        try {
            for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
                const row = document.createElement('div');
                row.classList.add('lotto-row');
                lottoContainer.appendChild(row);
                const targetNumbers = generateUniqueNumbers();
                const balls = [];
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

            for (let rowIdx = 0; rowIdx < allRowsBalls.length; rowIdx++) {
                const { balls, targetNumbers } = allRowsBalls[rowIdx];
                for (let i = 0; i < balls.length; i++) {
                    const ball = balls[i];
                    ball.classList.add('spinning');
                    const start = Date.now();
                    while (Date.now() - start < 600) {
                        ball.textContent = Math.floor(Math.random() * 45) + 1;
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                    ball.classList.remove('spinning');
                    ball.textContent = targetNumbers[i];
                    applyBallColor(ball, targetNumbers[i]);
                    
                    // 반짝임 효과 트리거
                    ball.classList.remove('shining');
                    void ball.offsetWidth; // 리플로우 강제
                    ball.classList.add('shining');
                    
                    playPopSound();
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                if (rowIdx === allRowsBalls.length - 1) {
                    triggerConfetti();
                    showFortune();
                    playFinalSound();
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } finally {
            stopSilentLoop();
            generateBtn.disabled = false;
            shareBtn.classList.remove('hidden');
        }
    }

    function generateUniqueNumbers() {
        const set = new Set();
        while (set.size < 6) set.add(Math.floor(Math.random() * 45) + 1);
        return Array.from(set).sort((a, b) => a - b);
    }

    function createBall(text) {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.textContent = text;
        return ball;
    }

    function applyBallColor(ball, number) {
        const colorIdx = Math.min(8, Math.floor((number - 1) / 5));
        ball.className = `ball visible c${colorIdx}`;
    }

    function triggerConfetti() {
        const end = Date.now() + 3000;
        (function frame() {
            confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#FFA500'] });
            confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FFD700', '#FFA500'] });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }

    function showFortune() {
        fortuneText.textContent = `🍀 행운의 조언: ${fortunes[Math.floor(Math.random() * fortunes.length)]}`;
        fortuneContainer.classList.remove('hidden');
    }

    function captureAndShare() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        html2canvas(captureArea, { backgroundColor: isDark ? '#0a041a' : '#ffffff', scale: 2, useCORS: true })
        .then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `lucky_${Date.now()}.png`;
            link.click();
        });
    }
});
