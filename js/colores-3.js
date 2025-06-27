const nivel = 3;

// --- Obtener usuario ---
function obtenerUsuario() {
  const userRaw = localStorage.getItem('usuario');
  try {
    return JSON.parse(userRaw) || { nombre: 'Peque' };
  } catch {
    return { nombre: 'Peque' };
  }
}

// --- Guardar progreso de forma unificada ---
function completarJuego(nivel, juego) {
  const user = obtenerUsuario();
  const claveProgreso = `progresoNivel${nivel}_` + user.nombre;

  let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
    colores: false,
    formas: false,
    letras: false,
    memory: false,
    contar: false
  };

  progreso[juego] = true;
  localStorage.setItem(claveProgreso, JSON.stringify(progreso));
}

// --------------------------------------------------------

let colores = [];
let aciertos = 0;
const totalAciertos = 10;
let coloresRestantes = [];

const preguntaTexto = document.getElementById('pregunta');
const opcionesDiv = document.getElementById('opciones');
const mensaje = document.getElementById('mensaje');
const sonidoAplauso = document.getElementById('aplauso');

sonidoAplauso.volume = 1;
sonidoAplauso.muted = false;

// Para que el audio se pueda reproducir después del primer click
window.addEventListener("click", () => {
  sonidoAplauso.play().catch(() => {});
}, { once: true });

// Fisher-Yates
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function mostrarPregunta() {
  if (coloresRestantes.length === 0 || aciertos >= totalAciertos) {
    mensaje.innerHTML = `<strong>🎉 ¡Completaste el juego!</strong><br/>Redirigiendo...`;

    completarJuego(3, 'colores');

    setTimeout(() => {
      window.location.href = '../niveles/nivel-3.html';
    }, 2000);
    return;
  }

  const correcta = coloresRestantes[Math.floor(Math.random() * coloresRestantes.length)];

  let opciones = colores.filter(c => c.nombre !== correcta.nombre);
  opciones = mezclar(opciones).slice(0, 2);
  opciones.push(correcta);
  opciones = mezclar(opciones);

  preguntaTexto.innerHTML = `¿Cuál es el color <strong>${correcta.nombre.toLowerCase()}</strong>?`;
  opcionesDiv.innerHTML = '';
  mensaje.textContent = '';

  opciones.forEach(color => {
    const div = document.createElement('div');
    div.className = 'opcion';
    div.style.width = '120px';
    div.style.height = '120px';
    div.style.borderRadius = '25px';
    div.style.cursor = 'pointer';
    div.style.margin = '15px';
    div.style.backgroundColor = color.color;

    div.onclick = () => {
      if (color.nombre === correcta.nombre) {
        sonidoAplauso.currentTime = 0;
        sonidoAplauso.play();
        aciertos++;
        mensaje.textContent = `¡Correcto! ✅ Aciertos: ${aciertos}/${totalAciertos}`;
        div.style.border = '4px solid #4caf50';
        div.style.transform = 'scale(1.2)';

        coloresRestantes = coloresRestantes.filter(c => c.nombre !== correcta.nombre);

        opcionesDiv.querySelectorAll('div').forEach(el => el.style.pointerEvents = 'none');

        setTimeout(() => mostrarPregunta(), 1500);
      } else {
        mensaje.textContent = 'Intenta otra vez 🙃';
        div.style.border = '4px solid #f44336';
        setTimeout(() => {
          div.style.border = 'none';
          mensaje.textContent = '';
        }, 1000);
      }
    };

    opcionesDiv.appendChild(div);
  });
}

// Botón volver
document.getElementById('btnVolver').onclick = () => {
  window.location.href = '../niveles/nivel-3.html';
};

// Botón reiniciar
document.getElementById('btnReiniciar').onclick = () => {
  aciertos = 0;
  coloresRestantes = [...colores];
  mensaje.textContent = '';
  mostrarPregunta();
};

// cargar colores
fetch('../data/datos-colores.json')
  .then(response => response.json())
  .then(data => {
    colores = data;
    coloresRestantes = [...colores];
    mostrarPregunta();
  })
  .catch(error => {
    mensaje.textContent = 'Error al cargar los colores.';
    console.error('Error cargando JSON:', error);
  });
