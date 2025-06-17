const images = [
  '../assets/img/avion.jpg',
  '../assets/img/barco.jpg',
  '../assets/img/conejo.png',
  '../assets/img/delfin.png',
  '../assets/img/elefante.png',
  '../assets/img/fresa.png',
  '../assets/img/gato.png',
  '../assets/img/helado.png',
];

// Duplicar imágenes para pares
let cardsArray = [...images, ...images];

const board = document.getElementById('memory-board');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');

let flippedCards = [];
let matchedPairs = 0;

function shuffle(array) {
  for(let i = array.length -1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  board.innerHTML = '';
  matchedPairs = 0;
  message.textContent = '';
  flippedCards = [];

  shuffle(cardsArray);

  cardsArray.forEach((imgSrc, index) => {
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
    card1.style.pointerEvents = 'none';
    card2.style.pointerEvents = 'none';

    if (matchedPairs === images.length) {
      message.textContent = '🎉 ¡Felicidades! Has encontrado todas las parejas. 🎉';
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];
}

resetBtn.addEventListener('click', createBoard);

createBoard();
