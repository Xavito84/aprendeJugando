const board = document.getElementById('memory-board');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const sonidoAcierto = new Audio('../assets/sounds/applause.mp3');  

let flippedCards = [];
let matchedPairs = 0;
let cardsArray = [];
let allImages = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function selectImages(num) {
  const copy = [...allImages];
  shuffle(copy);
  return copy.slice(0, num).map(obj => obj.src);
}

function createBoard() {
  board.innerHTML = '';
  matchedPairs = 0;
  message.textContent = '';
  flippedCards = [];

  const selectedImages = selectImages(3); // Solo 3 parejas para niños más pequeños
  cardsArray = [...selectedImages, ...selectedImages];
  shuffle(cardsArray);

  cardsArray.forEach((imgSrc) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = imgSrc;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'Imagen';
    img.loading = 'lazy';

    card.appendChild(img);
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });
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

    if (matchedPairs === 3) {
      message.textContent = '🎉 ¡Felicidades! Has encontrado todas las parejas. 🎉';

      const nombre = localStorage.getItem('usuario') || 'Peque';
      const claveProgreso = 'progresoNivel3_' + nombre;
      let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || { colores: false, formas: false, letras: false, memory: false };

      progreso.memory = true;
      localStorage.setItem(claveProgreso, JSON.stringify(progreso));

      setTimeout(() => {
        window.location.href = '../niveles/nivel-3.html';
      }, 2000);
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];
}

resetBtn.addEventListener('click', createBoard);

fetch('../data/datos-memory.json')
  .then(res => res.json())
  .then(data => {
    allImages = data;
    createBoard();
  });

document.getElementById('btnVolver').onclick = () => {
  window.location.href = '../niveles/nivel-3.html';
};
