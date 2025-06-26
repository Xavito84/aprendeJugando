// --- Módulo progreso ---

const nombreUsuario = JSON.parse(localStorage.getItem('usuario'))?.nombre || 'Peque';
const claveProgreso = 'progresoNivel5_' + nombreUsuario;

let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  contar: false,
  puzzle: false,
  memory: false,
  letras: false,
};

function guardarProgreso() {
  localStorage.setItem(claveProgreso, JSON.stringify(progreso));
}

function marcarModuloCompletado(modulo) {
  if (!progreso[modulo]) {
    progreso[modulo] = true;
    guardarProgreso();
    console.log(`Módulo "${modulo}" completado.`);
  }
}

// --- Código juego Memory ---

const board = document.getElementById('memory-board');
const message = document.getElementById('mensaje');
const resetBtn = document.getElementById('reset-btn');
const sonidoAcierto = document.getElementById('sonidoAcierto');

let flippedCards = [];
let matchedPairs = 0;
let cardsArray = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function iniciarJuego(imagenesDisponibles) {
  board.innerHTML = '';
  message.textContent = '';
  flippedCards = [];
  matchedPairs = 0;

  const seleccionadas = imagenesDisponibles.slice(0, 15);
  cardsArray = [...seleccionadas, ...seleccionadas];
  shuffle(cardsArray);

  cardsArray.forEach(imgObj => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = imgObj.src;

    const img = document.createElement('img');
    img.src = imgObj.src;
    img.alt = 'Imagen memory';
    img.loading = 'lazy';

    card.appendChild(img);

    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });

  board.style.gridTemplateColumns = 'repeat(6, 100px)';
  board.style.gridTemplateRows = 'repeat(5, 100px)';
}

function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    setTimeout(checkForMatch, 1000);
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.image === card2.dataset.image) {
    matchedPairs++;
    sonidoAcierto.currentTime = 0;
    sonidoAcierto.play();

    card1.style.pointerEvents = 'none';
    card2.style.pointerEvents = 'none';

    if (matchedPairs === 15) {
      message.textContent = '🎉 ¡Felicidades! Has encontrado todas las parejas. 🎉';

      marcarModuloCompletado('memory');

      setTimeout(() => window.location.href = '../niveles/nivel-5.html', 2000);
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];
}

resetBtn.addEventListener('click', () => {
  fetch('../data/datos-memory.json')
    .then(res => res.json())
    .then(data => iniciarJuego(data));
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('../data/datos-memory.json')
    .then(res => res.json())
    .then(data => iniciarJuego(data));
});

document.getElementById('btnVolver').onclick = () => {
  window.location.href = '../niveles/nivel-5.html';
};
