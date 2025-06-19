const dropzone = document.getElementById('dropzone');
const image = document.getElementById('image');
const lettersContainer = document.getElementById('lettersContainer');

let currentIndex = 0;
let data = [];

fetch('../data/datos-letras-4.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    loadItem(currentIndex);
  });

function loadItem(index) {
  const item = data[index];
  image.src = item.image;
  dropzone.textContent = 'Suelta aquí';
  lettersContainer.innerHTML = '';

  item.options.forEach(letter => {
    const letterEl = document.createElement('div');
    letterEl.className = 'letter';
    letterEl.textContent = letter;
    letterEl.setAttribute('draggable', true);
    letterEl.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', letter);
    });
    lettersContainer.appendChild(letterEl);
  });

  dropzone.ondragover = e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  };

  dropzone.ondragleave = e => {
    dropzone.classList.remove('dragover');
  };

  dropzone.ondrop = e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const selected = e.dataTransfer.getData('text/plain');
    const letters = document.querySelectorAll('.letter');
    letters.forEach(letter => {
      letter.classList.remove('correct', 'incorrect');
    });
    const draggedLetter = Array.from(letters).find(l => l.textContent === selected);
    if (selected === item.correct) {
      dropzone.textContent = '¡Correcto!';
      draggedLetter.classList.add('correct');
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % data.length;
        loadItem(currentIndex);
      }, 1500);
    } else {
      dropzone.textContent = 'Intenta de nuevo';
      draggedLetter.classList.add('incorrect');
    }
  };
}
