const items = [
  { letter: 'A', word: 'Avión', img: '../assets/img/avion.jpg' },
  { letter: 'B', word: 'Barco', img: '../assets/img/barco.jpg' },
  { letter: 'C', word: 'Conejo', img: '../assets/img/conejo.png' },
  { letter: 'D', word: 'Delfín', img: '../assets/img/delfin.png' },
  { letter: 'E', word: 'Elefante', img: '../assets/img/elefante.png' },
  { letter: 'F', word: 'Fresa', img: '../assets/img/fresa.png' },
  { letter: 'G', word: 'Gato', img: '../assets/img/gato.png' },
  { letter: 'H', word: 'Helado', img: '../assets/img/helado.png' },
  { letter: 'I', word: 'Indio', img: '../assets/img/indio.png' },
  { letter: 'J', word: 'Jirafa', img: '../assets/img/jirafa.png' },
];

let currentLetter = null;
let correctItem = null;
let letrasUsadas = [];
let aciertos = 0; // contador de respuestas correctas

const sonidoAplauso = document.getElementById('aplauso');

// Habilitar sonido con primer clic (política del navegador)
window.addEventListener("click", () => {
  sonidoAplauso.play().catch(() => {});
}, { once: true });

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function elegirNuevaLetra() {
  const disponibles = items.filter(item => !letrasUsadas.includes(item.letter));
  if (disponibles.length === 0) return null;
  return disponibles[Math.floor(Math.random() * disponibles.length)];
}

function mostrarPregunta() {
  const feedback = document.getElementById('mensaje');
  feedback.textContent = '';

  // Si ya respondió 10 letras, termina el juego
  if (aciertos >= 10) {
    document.getElementById('letraActual').textContent = '';
    document.getElementById('pregunta').textContent = '';
    document.getElementById('opciones').innerHTML = '';
    feedback.textContent = "🎉 ¡Has acertado 10 letras! 🎉";
    feedback.style.color = 'green';

    // Guardar progreso en localStorage
    const nombre = localStorage.getItem('usuario') || 'Peque';
    const claveProgreso = 'progresoNivel3_' + nombre;
    let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || { colores: false, formas: false, letras: false };

    progreso.letras = true;  // Marcar letras como completado

    localStorage.setItem(claveProgreso, JSON.stringify(progreso));

    // Redirigir tras 2 segundos
    setTimeout(() => {
      window.location.href = '../niveles/nivel-3.html';
    }, 2000);

    return;
  }

  const nuevaLetra = elegirNuevaLetra();
  if (!nuevaLetra) {
    // No hay más letras disponibles, igual terminar
    feedback.textContent = "🎉 ¡Has completado todas las letras disponibles! 🎉";
    feedback.style.color = 'green';
    return;
  }

  currentLetter = nuevaLetra.letter;
  correctItem = nuevaLetra;

  document.getElementById('letraActual').textContent = currentLetter;
  document.getElementById('pregunta').textContent = `¿Cuál palabra empieza con la letra ${currentLetter}?`;

  let opcionesIncorrectas = items.filter(item => item.letter !== currentLetter);
  shuffle(opcionesIncorrectas);
  opcionesIncorrectas = opcionesIncorrectas.slice(0, 2);

  let allOptions = [correctItem, ...opcionesIncorrectas];
  shuffle(allOptions);

  const optionsDiv = document.getElementById('opciones');
  optionsDiv.innerHTML = '';
  allOptions.forEach(option => {
    const div = document.createElement('div');
    div.className = 'option';
    div.innerHTML = `<img src="${option.img}" alt="${option.word}" style="width: 220px; height: 180px; object-fit: contain; border-radius: 14px;">`;
    div.onclick = () => checkAnswer(option.letter);
    optionsDiv.appendChild(div);
  });
}

function checkAnswer(selectedLetter) {
  const feedback = document.getElementById('mensaje');
  if (selectedLetter === currentLetter) {
    sonidoAplauso.currentTime = 0;
    sonidoAplauso.play();

    feedback.textContent = `¡Correcto! ${correctItem.word} empieza por ${currentLetter}.`;
    feedback.style.color = 'green';

    letrasUsadas.push(currentLetter);
    aciertos++; // sumamos un acierto

    // Bloquear opciones para evitar doble clic
    const optionsDiv = document.getElementById('opciones');
    Array.from(optionsDiv.children).forEach(div => div.style.pointerEvents = 'none');

    setTimeout(() => {
      mostrarPregunta();
    }, 1500);
  } else {
    feedback.textContent = 'Incorrecto. Intenta de nuevo.';
    feedback.style.color = 'red';
  }
}

document.getElementById('btnReiniciar').onclick = () => {
  letrasUsadas = [];
  aciertos = 0;
  mostrarPregunta();
};

mostrarPregunta();
