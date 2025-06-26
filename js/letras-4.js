const dropzone = document.getElementById('dropzone');
const image = document.getElementById('image');
const lettersContainer = document.getElementById('lettersContainer');

let currentIndex = 0;
let data = [];
let aciertos = 0;
const maxAciertos = 10;

// Cargar datos desde archivo JSON
fetch('../data/datos-letras-4.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    loadItem(currentIndex);
  });

// Asignar eventos solo una vez
dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('dragover');

  const selected = e.dataTransfer.getData('text/plain');
  if (!selected) return;

  const letters = document.querySelectorAll('.letter');
  letters.forEach(letter => {
    letter.classList.remove('correct', 'incorrect');
  });

  const draggedLetter = Array.from(letters).find(l => l.textContent === selected);
  if (!draggedLetter) return;

  const item = data[currentIndex];

  if (selected === item.correct) {
    aciertos++;
    dropzone.textContent = `¡Correcto! (${aciertos} / ${maxAciertos})`;
    draggedLetter.classList.add('correct');

    if (aciertos >= maxAciertos) {
      dropzone.textContent = '¡Has alcanzado 10 aciertos! 🎉 Guardando progreso...';

      // Guardar progreso al completar el juego
      const user = JSON.parse(localStorage.getItem('usuario'));
      if (user && user.nombre) {
        const claveProgreso = 'progresoNivel4_' + user.nombre;
        let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {};
        progreso.letras = true;
        localStorage.setItem(claveProgreso, JSON.stringify(progreso));
      }

      setTimeout(() => {
        window.location.href = '../niveles/nivel-4.html';
      }, 3000);
      return;
    }

    setTimeout(() => {
      currentIndex++;
      if (currentIndex >= data.length) currentIndex = 0; // reiniciar ciclo si quieres
      loadItem(currentIndex);
      dropzone.textContent = 'Suelta aquí';
    }, 1500);

  } else {
    dropzone.textContent = 'Intenta de nuevo';
    draggedLetter.classList.add('incorrect');
  }
});

// Función para cargar un ítem
function loadItem(index) {
  const item = data[index];
  if (!item) return;

  image.src = item.image;
  dropzone.textContent = 'Suelta aquí';
  lettersContainer.innerHTML = '';

  item.options.forEach(letter => {
    const letterEl = document.createElement('div');
    letterEl.className = 'letter';
    letterEl.textContent = letter;
    letterEl.setAttribute('draggable', true);
    letterEl.dataset.letter = letter;

    letterEl.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', letter);
    });

    lettersContainer.appendChild(letterEl);
  });
}
document.getElementById('btnVolver').addEventListener('click', () => {
  window.location.href = '../niveles/nivel-4.html';
});
