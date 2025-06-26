const board = document.getElementById('memory-board2');
    const message = document.getElementById('message');
    const resetBtn = document.getElementById('reset-btn');
    const volverBtn = document.getElementById('btnVolver');
    const sonidoAcierto = new Audio('../assets/audio/aplauso.mp3');

    const nivel = 4;
    const juego = 'memory';
    let flippedCards = [];
    let matchedPairs = 0;
    let cardsArray = [];
    let allImages = [];

    function getUsuario() {
      return JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Peque' };
    }

    function getClaveProgreso(nivel) {
      const usuario = getUsuario();
      return `progresoNivel${nivel}_${usuario.nombre}`;
    }

    function getProgreso(nivel, porDefecto = {}) {
      const clave = getClaveProgreso(nivel);
      return JSON.parse(localStorage.getItem(clave)) || porDefecto;
    }

    function guardarProgreso(nivel, progreso) {
      const clave = getClaveProgreso(nivel);
      localStorage.setItem(clave, JSON.stringify(progreso));
    }

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
      flippedCards = [];
      message.textContent = '';

      const selectedImages = selectImages(10); // 10 parejas
      cardsArray = [...selectedImages, ...selectedImages];
      shuffle(cardsArray);

      cardsArray.forEach(imgSrc => {
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
        setTimeout(checkForMatch, 800);
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

        if (matchedPairs === 10) {
          message.textContent = '🎉 ¡Felicidades! Has encontrado todas las parejas. 🎉';
          const progreso = getProgreso(nivel, { letras: false, puzzle: false, memory: false, contar: false });
          progreso.memory = true;
          guardarProgreso(nivel, progreso);
          setTimeout(() => {
            window.location.href = '../niveles/nivel-4.html';
          }, 2000);
        }
      } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
      }

      flippedCards = [];
    }

    resetBtn.addEventListener('click', createBoard);
    volverBtn.addEventListener('click', () => {
      window.location.href = '../niveles/nivel-4.html';
    });

    fetch('../data/datos-memory.json')
      .then(res => res.json())
      .then(data => {
        allImages = data;
        createBoard();
      })
      .catch(err => {
        console.error('Error al cargar las imágenes:', err);
        message.textContent = '❌ No se pudieron cargar las imágenes.';
      });