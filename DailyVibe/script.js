let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
let selectedMood = null;
let selectedGifSrc = '';
const moodButtons = document.querySelectorAll('.mood-btn');
const notesInput = document.getElementById('notes');
const musicCheck = document.getElementById('music-check');
const musicInput = document.getElementById('music');
const tripCheck = document.getElementById('trip-check');
const tripInput = document.getElementById('trip');
const foodCheck = document.getElementById('food-check');
const foodInput = document.getElementById('food');
const bookCheck = document.getElementById('book-check');
const bookInput = document.getElementById('book');
const filmCheck = document.getElementById('film-check');
const filmInput = document.getElementById('film');
const gameCheck = document.getElementById('game-check');
const gameInput = document.getElementById('game');
const sportCheck = document.getElementById('sport-check');
const sportInput = document.getElementById('sport');
const saveBtn = document.getElementById('save-btn');
const historyDisplay = document.getElementById('history');
const insightsDisplay = document.getElementById('insights');
const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const ctx = document.getElementById('mood-chart').getContext('2d');
let moodChart;
[musicCheck, tripCheck, foodCheck, bookCheck, filmCheck, gameCheck, sportCheck].forEach((check, index) => {
    const input = [musicInput, tripInput, foodInput, bookInput, filmInput, gameInput, sportInput][index];
    check.addEventListener('change', () => {
        input.style.display = check.checked ? 'block' : 'none';
    });
});
function updateUI() {
    updateHistory();
    updateInsights();
    updateChart();
    updateBackground();
}
function updateHistory() {
    historyDisplay.innerHTML = moodHistory.length === 0
        ? '<p>Comece registrando seu humor!</p>'
        : moodHistory.map(entry => 
            `<p>${entry.fullDate}: <img src="${entry.gifSrc}" class="mood-gif" style="width: 30px; height: 30px; vertical-align: middle;"> ${entry.notes ? `- ${entry.notes}` : ''} 
            ${entry.music ? `<img src="emojis/music.gif" style="width: 20px; height: 20px; vertical-align: middle;"> ${entry.music}` : ''} 
            ${entry.trip ? `<img src="emojis/trip.gif" style="width: 20px; height: 20px; vertical-align: middle;"> ${entry.trip}` : ''} 
            ${entry.food ? `<img src="emojis/food.gif" style="width: 20px; height: 20px; vertical-align: middle;"> ${entry.food}` : ''} 
            ${entry.book ? `<img src="emojis/book.gif" style="width: 20px; height: 20px; vertical-align: middle;"> ${entry.book}` : ''} 
            ${entry.film ? `<img src="emojis/film.gif" style="width: 20px; height: 20px; vertical-align: middle;"> ${entry.film}` : ''} 
            ${entry.game ? `<img src="emojis/game.gif" style="width: 20px; height: 20px; vertical-align: middle;"> ${entry.game}` : ''} 
            ${entry.sport ? `<img src="emojis/sport.gif" style="width: 20px; height: 20px; vertical-align: middle;"> ${entry.sport}` : ''}</p>`
        ).join('');
}
function updateInsights() {
    if (moodHistory.length < 2) {
        insightsDisplay.textContent = 'Registre mais para ver sugestões!';
        return;
    }

    const happyEntries = moodHistory.filter(entry => entry.mood === 'excited' || entry.mood === 'happy');
    if (happyEntries.length > 0) {
        const lastHappy = happyEntries[0];
        const suggestion = lastHappy.music ? `Ouça "<img src='emojis/music.gif' style='width: 20px; height: 20px; vertical-align: middle;'> ${lastHappy.music}" novamente!` :
                          lastHappy.trip ? `Reviva "<img src='emojis/trip.gif' style='width: 20px; height: 20px; vertical-align: middle;'> ${lastHappy.trip}"!` :
                          lastHappy.food ? `Saboreie "<img src='emojis/food.gif' style='width: 20px; height: 20px; vertical-align: middle;'> ${lastHappy.food}" outra vez!` :
                          lastHappy.book ? `Leia "<img src='emojis/book.gif' style='width: 20px; height: 20px; vertical-align: middle;'> ${lastHappy.book}" novamente!` :
                          lastHappy.film ? `Assista "<img src='emojis/film.gif' style='width: 20px; height: 20px; vertical-align: middle;'> ${lastHappy.film}" de novo!` :
                          lastHappy.game ? `Jogue "<img src='emojis/game.gif' style='width: 20px; height: 20px; vertical-align: middle;'> ${lastHappy.game}" outra vez!` :
                          lastHappy.sport ? `Pratique "<img src='emojis/sport.gif' style='width: 20px; height: 20px; vertical-align: middle;'> ${lastHappy.sport}" novamente!` :
                          'Tente algo que te fez feliz antes!';
        insightsDisplay.innerHTML = `Você estava feliz em ${lastHappy.day}. <img src="${lastHappy.gifSrc}" class="mood-gif" style="width: 30px; height: 30px; vertical-align: middle;"> ${suggestion}`;
    } else {
        insightsDisplay.textContent = 'Que tal experimentar algo novo para animar seu dia?';
    }
}
function updateChart() {
    const last7Days = moodHistory.slice(0, 7).reverse();
    const moodCounts = {
        excited: last7Days.filter(entry => entry.mood === 'excited').length,
        happy: last7Days.filter(entry => entry.mood === 'happy').length,
        neutral: last7Days.filter(entry => entry.mood === 'neutral').length,
        sad: last7Days.filter(entry => entry.mood === 'sad').length
    };

    if (moodChart) moodChart.destroy();
    moodChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Animado', 'Feliz', 'Neutro', 'Triste'],
            datasets: [{
                data: [moodCounts.excited, moodCounts.happy, moodCounts.neutral, moodCounts.sad],
                backgroundColor: ['#fdcb6e', '#ffeaa7', '#74b9ff', '#ff7675'],
                borderWidth: 1,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 14 },
                        color: '#333'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${context.raw}`
                    }
                }
            }
        }
    });
}
function updateBackground() {
    const lastMood = moodHistory[0]?.mood;
    document.body.style.background = lastMood === 'excited' ? 'linear-gradient(135deg, #fdcb6e, #e84393)' :
                                    lastMood === 'happy' ? 'linear-gradient(135deg, #ffeaa7, #55efc4)' :
                                    lastMood === 'neutral' ? 'linear-gradient(135deg, #74b9ff, #a29bfe)' :
                                    lastMood === 'sad' ? 'linear-gradient(135deg, #ff7675, #d63031)' :
                                    'linear-gradient(135deg, #6b48ff, #ff6b6b)';
}

// Humor
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        moodButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        selectedMood = button.dataset.mood;
        selectedGifSrc = button.querySelector('img').src;
    });
});

// Salvar
saveBtn.addEventListener('click', () => {
    if (!selectedMood) {
        alert('Escolha um humor!');
        return;
    }

    const now = new Date();
    const day = weekdays[now.getDay()];
    const date = now.toLocaleDateString('pt-BR');
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const fullDate = `${day}, ${date}, ${time}`;
    const notes = notesInput.value.trim();
    const music = musicCheck.checked && musicInput.value.trim() ? musicInput.value.trim() : '';
    const trip = tripCheck.checked && tripInput.value.trim() ? tripInput.value.trim() : '';
    const food = foodCheck.checked && foodInput.value.trim() ? foodInput.value.trim() : '';
    const book = bookCheck.checked && bookInput.value.trim() ? bookInput.value.trim() : '';
    const film = filmCheck.checked && filmInput.value.trim() ? filmInput.value.trim() : '';
    const game = gameCheck.checked && gameInput.value.trim() ? gameInput.value.trim() : '';
    const sport = sportCheck.checked && sportInput.value.trim() ? sportInput.value.trim() : '';

    const basePath = window.location.href.replace(/\/[^\/]*$/, '/');
    const gifSrc = selectedGifSrc.replace(basePath, './');

    moodHistory.unshift({ fullDate, mood: selectedMood, notes, music, trip, food, book, film, game, sport, day, gifSrc: gifSrc });
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

    notesInput.value = musicInput.value = tripInput.value = foodInput.value = bookInput.value = filmInput.value = gameInput.value = sportInput.value = '';
    [musicCheck, tripCheck, foodCheck, bookCheck, filmCheck, gameCheck, sportCheck].forEach(check => check.checked = false);
    [musicInput, tripInput, foodInput, bookInput, filmInput, gameInput, sportInput].forEach(input => input.style.display = 'none');
    moodButtons.forEach(b => b.classList.remove('active'));
    selectedMood = null;
    selectedGifSrc = '';

    updateUI();
});
updateUI();