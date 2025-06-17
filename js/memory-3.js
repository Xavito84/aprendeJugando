const allImages = [
  '../assets/img/avion.jpg',
  '../assets/img/barco.jpg',
  '../assets/img/conejo.png',
  '../assets/img/delfin.png',
  '../assets/img/elefante.png',
  '../assets/img/fresa.png',
  '../assets/img/gato.png',
  '../assets/img/helado.png',
  '../assets/img/indio.png',
  '../assets/img/jirafa.png'
];

const board = document.getElementById('memory-board');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const sonidoAcierto = new Audio('../assets/sounds/applause.mp3');  // Ruta al audio de aplauso

let flippedCards = [];
let matchedPairs = 0;
let cardsArray = [];

function shuffle(array) {
  for(let i = array.length -1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function selectImages(num) {
  const copy = [...allImages];
  shuffle(copy);
  return copy.slice(0, num);
}

function createBoard() {
  board.innerHTML = '';
  matchedPairs = 0;
  message.textContent = '';
  flippedCards = [];

  const selectedImages = selectImages(3);
  cardsArray = [...selectedImages, ...selectedImages];
  shuffle(cardsArray);

  cardsArray.forEach((imgSrc) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = imgSrc;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'Imagen';

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

    if (matchedPairs === 3) { // Todas las parejas encontradas
      message.textContent = '🎉 ¡Felicidades! Has encontrado todas las parejas. 🎉';

      // Guardar progreso en localStorage
      const nombre = localStorage.getItem('usuario') || 'Peque';
      const claveProgreso = 'progresoNivel3_' + nombre;
      let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || { colores: false, formas: false, letras: false, memory: false };

      progreso.memory = true;  // Marcar memory como completado
      localStorage.setItem(claveProgreso, JSON.stringify(progreso));

      // Tras 2 segundos redirigir a niveles
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

document.addEventListener('DOMContentLoaded', createBoard);
