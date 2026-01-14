// Oyun değişkenleri
let secretNumber;
let attemptsLeft;
let guessHistory = [];
let bestScore = localStorage.getItem('bestScore') || null;

// Oyunu başlat
function initGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 10;
    guessHistory = [];

    document.getElementById('attempts').textContent = attemptsLeft;
    document.getElementById('bestScore').textContent = bestScore || '-';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    document.getElementById('guessBtn').disabled = false;
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = 'message';
    document.getElementById('hint').textContent = '';
    document.getElementById('historySection').style.display = 'none';
    document.getElementById('historyList').innerHTML = '';
    document.getElementById('restartBtn').style.display = 'none';

    document.getElementById('guessInput').focus();
}

// Tahmin yap
function makeGuess() {
    const input = document.getElementById('guessInput');
    const guess = parseInt(input.value);

    // Validasyon
    if (isNaN(guess) || guess < 1 || guess > 100) {
        showMessage('Lütfen 1-100 arası bir sayı girin! 🤔', '');
        input.value = '';
        input.focus();
        return;
    }

    // Daha önce tahmin edilmiş mi?
    if (guessHistory.some(h => h.number === guess)) {
        showMessage('Bu sayıyı zaten tahmin ettin! 😅', '');
        input.value = '';
        input.focus();
        return;
    }

    attemptsLeft--;
    document.getElementById('attempts').textContent = attemptsLeft;

    // Doğru tahmin
    if (guess === secretNumber) {
        const score = 10 - attemptsLeft;
        showMessage(`🎉 Tebrikler! ${score} denemede buldun!`, 'win');
        document.getElementById('hint').textContent = '🏆';

        // En iyi skoru güncelle
        if (!bestScore || score < bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            document.getElementById('bestScore').textContent = bestScore;
        }

        endGame();
        return;
    }

    // Yanlış tahmin
    const isHigher = guess < secretNumber;
    const direction = isHigher ? 'higher' : 'lower';
    const emoji = isHigher ? '⬆️' : '⬇️';
    const text = isHigher ? 'Daha yüksek!' : 'Daha düşük!';

    // Geçmişe ekle
    guessHistory.push({ number: guess, direction: direction });
    updateHistory();

    // Mesajı göster
    showMessage(text, direction);
    document.getElementById('hint').textContent = emoji;

    // Hak kalmadıysa
    if (attemptsLeft === 0) {
        showMessage(`😔 Kaybettin! Sayı ${secretNumber} idi.`, 'lose');
        document.getElementById('hint').textContent = '💔';
        endGame();
        return;
    }

    // Yakınlık ipucu
    const diff = Math.abs(secretNumber - guess);
    if (diff <= 5) {
        document.getElementById('hint').textContent += ' 🔥 Çok yakınsın!';
    } else if (diff <= 15) {
        document.getElementById('hint').textContent += ' 👍 Yaklaşıyorsun!';
    }

    input.value = '';
    input.focus();
}

// Mesaj göster
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
}

// Geçmişi güncelle
function updateHistory() {
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');

    historySection.style.display = 'block';
    historyList.innerHTML = guessHistory.map(h =>
        `<span class="history-item ${h.direction}">${h.number}</span>`
    ).join('');
}

// Oyunu bitir
function endGame() {
    document.getElementById('guessInput').disabled = true;
    document.getElementById('guessBtn').disabled = true;
    document.getElementById('restartBtn').style.display = 'block';
}

// Oyunu yeniden başlat
function restartGame() {
    initGame();
}

// Enter tuşu ile tahmin
document.addEventListener('DOMContentLoaded', () => {
    initGame();

    document.getElementById('guessInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });
});
