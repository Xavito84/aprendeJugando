// Obtener usuario y clave progreso
const userRaw = localStorage.getItem('usuario');
let nombre;
try {
  nombre = userRaw ? JSON.parse(userRaw).nombre : 'Peque';
} catch {
  nombre = 'Peque';
}
const claveProgreso = 'progresoNivel3_' + nombre;

// Función para obtener progreso local (si existe) o valor por defecto
function obtenerProgreso() {
  const progresoGuardado = localStorage.getItem(claveProgreso);
  if (progresoGuardado) {
    try {
      return JSON.parse(progresoGuardado);
    } catch {
      return { colores: false, formas: false, letras: false, memory: false, contar: false };
    }
  }
  return { colores: false, formas: false, letras: false, memory: false, contar: false };
}

// Función para guardar progreso localmente
function guardarProgreso(progreso) {
  localStorage.setItem(claveProgreso, JSON.stringify(progreso));
}

// Variables del juego
let colores = [];
let aciertos = 0;
const totalAciertos = 10;
let coloresRestantes = [];

const preguntaTexto = document.getElementById('pregunta');
const opcionesDiv = document.getElementById('opciones');
const mensaje = document.getElementById('mensaje');
const sonidoAplauso = document.getElementById('aplauso');

let progreso = obtenerProgreso();

sonidoAplauso.volume = 1;
sonidoAplauso.muted = false;

// Para que el audio se pueda reproducir después del primer click (restricciones navegadores)
window.addEventListener("click", () => {
  sonidoAplauso.play().catch(() => {});
}, { once: true });

// Función para mezclar arrays (Fisher-Yates)
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function mostrarPregunta() {
  // Fin del juego
  if (coloresRestantes.length === 0 || aciertos >= totalAciertos) {
    mensaje.innerHTML = `<strong>🎉 ¡Completaste el juego!</strong><br/>Redirigiendo...`;

    progreso.colores = true;
    guardarProgreso(progreso);

    setTimeout(() => {
      window.location.href = '../niveles/nivel-3.html';
    }, 2000);
    return;
  }

  // Elegir color correcto
  const correcta = coloresRestantes[Math.floor(Math.random() * coloresRestantes.length)];

  // Seleccionar otras dos opciones incorrectas
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
    div.textContent = '';

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

// Botón volver al nivel 3
document.getElementById('btnVolver').onclick = () => {
  window.location.href = '../niveles/nivel-3.html';
};

// Botón reiniciar juego
document.getElementById('btnReiniciar').onclick = () => {
  aciertos = 0;
  coloresRestantes = [...colores];
  mensaje.textContent = '';
  mostrarPregunta();
};

// Cargar colores desde JSON y empezar el juego
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
