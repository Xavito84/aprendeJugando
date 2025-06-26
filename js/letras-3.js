let items = [];

fetch('../data/datos-letras.json')
  .then(response => response.json())
  .then(data => {
    items = data;
    mostrarPregunta();
  })
  .catch(error => console.error('Error cargando JSON:', error));

let currentLetter = null;
let correctItem = null;
let letrasUsadas = [];
let aciertos = 0;

const sonidoAplauso = document.getElementById('aplauso');
const feedback = document.getElementById('mensaje');
const optionsDiv = document.getElementById('opciones');

let esperando = false;

window.addEventListener("click", () => {
  sonidoAplauso.play().catch(() => {});
}, { once: true });

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function elegirNuevaLetra() {
  const disponibles = items.filter(item => !letrasUsadas.includes(item.letter));
  if (disponibles.length === 0) return null;
  return disponibles[Math.floor(Math.random() * disponibles.length)];
}

function mostrarPregunta() {
  if (aciertos >= 10) {
    document.getElementById('letraActual').textContent = '';
    document.getElementById('pregunta').textContent = '';
    optionsDiv.innerHTML = '';
    feedback.textContent = "🎉 ¡Has acertado 10 letras! 🎉";
    feedback.style.color = 'green';

    const nombre = localStorage.getItem('usuario') || 'Peque';
    const claveProgreso = 'progresoNivel3_' + nombre;

    // Obtener progreso actual o crear uno nuevo por defecto
    let progreso = localStorage.getItem(claveProgreso);
    if (progreso) {
      try {
        progreso = JSON.parse(progreso);
      } catch {
        progreso = { colores: false, formas: false, letras: false, memory: false };
      }
    } else {
      progreso = { colores: false, formas: false, letras: false, memory: false };
    }

    // Actualizar el progreso de letras
    progreso.letras = true;
    localStorage.setItem(claveProgreso, JSON.stringify(progreso));

    setTimeout(() => {
      window.location.href = '../niveles/nivel-3.html';
    }, 2000);
    return;
  }

  esperando = false;
  feedback.textContent = '';

  const nuevaLetra = elegirNuevaLetra();
  if (!nuevaLetra) {
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

  optionsDiv.innerHTML = '';
  allOptions.forEach(option => {
    const div = document.createElement('div');
    div.className = 'option';
    div.tabIndex = 0; // accesibilidad
    div.innerHTML = `<img src="${option.img}" alt="${option.word}" style="width: 220px; height: 180px; object-fit: contain; border-radius: 14px;">`;
    div.onclick = () => checkAnswer(option.letter);
    optionsDiv.appendChild(div);
  });
}

function checkAnswer(selectedLetter) {
  if (esperando) return;
  esperando = true;

  if (selectedLetter === currentLetter) {
    sonidoAplauso.currentTime = 0;
    sonidoAplauso.play();

    feedback.textContent = `¡Correcto! ${correctItem.word} empieza por ${currentLetter}.`;
    feedback.style.color = 'green';

    letrasUsadas.push(currentLetter);
    aciertos++;

    Array.from(optionsDiv.children).forEach(div => div.style.pointerEvents = 'none');

    setTimeout(() => {
      mostrarPregunta();
    }, 1500);
  } else {
    feedback.textContent = 'Incorrecto. Intenta de nuevo.';
    feedback.style.color = 'red';

    Array.from(optionsDiv.children).forEach(div => div.style.pointerEvents = 'none');
    setTimeout(() => {
      feedback.textContent = '';
      Array.from(optionsDiv.children).forEach(div => div.style.pointerEvents = 'auto');
      esperando = false;
    }, 1000);
  }
}

document.getElementById('btnReiniciar').onclick = () => {
  letrasUsadas = [];
  aciertos = 0;
  mostrarPregunta();
};

document.getElementById('btnVolver').onclick = () => {
  window.location.href = '../niveles/nivel-3.html';
};
