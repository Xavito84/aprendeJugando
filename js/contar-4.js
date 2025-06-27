const grupo1 = document.getElementById('grupo1');
const grupo2 = document.getElementById('grupo2');
const opcionesNumeros = document.getElementById('opcionesNumeros');
const mensaje = document.getElementById('mensaje');
const aplauso = document.getElementById('aplauso');

const nivel = 4;
const juego = 'contar';
let datos = [];
let aciertos = 0;
const maxAciertos = 10;

// obtener usuario consistente
function obtenerUsuario() {
  const userRaw = localStorage.getItem('usuario');
  try {
    return JSON.parse(userRaw) || { nombre: 'Peque' };
  } catch {
    return { nombre: 'Peque' };
  }
}

// completarJuego unificado
function completarJuego(nivel, juego) {
  const usuario = obtenerUsuario();
  const claveProgreso = `progresoNivel${nivel}_${usuario.nombre}`;
  let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
    contar: false,
    puzzle: false,
    memory: false,
    letras: false
  };
  progreso[juego] = true;
  localStorage.setItem(claveProgreso, JSON.stringify(progreso));
}

window.addEventListener("click", () => aplauso.play().catch(() => {}), { once: true });

fetch('../data/datos-contar.json')
  .then(res => res.json())
  .then(data => {
    datos = data;
    siguientePregunta();
  })
  .catch(err => console.error('Error cargando datos:', err));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dibujarGrupo(contenedor, cantidad, src, alt) {
  contenedor.innerHTML = '';
  for (let i = 0; i < cantidad; i++) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.width = '70px';
    img.style.margin = '5px';
    contenedor.appendChild(img);
  }
}

function siguientePregunta() {
  if (aciertos >= maxAciertos) {
    mensaje.textContent = "¡Juego completado! Redirigiendo...";
    completarJuego(nivel, juego);
    setTimeout(() => window.location.href = "../niveles/nivel-4.html", 2000);
    return;
  }

  // Selección de dos objetos diferentes
  let idx1 = getRandomInt(0, datos.length - 1);
  let idx2;
  do {
    idx2 = getRandomInt(0, datos.length - 1);
  } while (idx2 === idx1);

  const item1 = datos[idx1];
  const item2 = datos[idx2];

  const num1 = getRandomInt(item1.min, item1.max);
  const num2 = getRandomInt(item2.min, item2.max);
  const total = num1 + num2;

  dibujarGrupo(grupo1, num1, item1.imagen, item1.nombre);
  dibujarGrupo(grupo2, num2, item2.imagen, item2.nombre);

  // Generar opciones únicas (3 en total)
  const opciones = new Set([total]);
  while (opciones.size < 3) {
    opciones.add(getRandomInt(Math.max(2, total - 3), total + 3));
  }

  const opcionesArray = Array.from(opciones).sort(() => Math.random() - 0.5);

  opcionesNumeros.innerHTML = '';
  mensaje.textContent = '';

  opcionesArray.forEach(n => {
    const btn = document.createElement('button');
    btn.textContent = n;
    btn.onclick = () => {
      if (n === total) {
        mensaje.textContent = '¡Correcto!';
        aplauso.currentTime = 0;
        aplauso.play();
        aciertos++;
        setTimeout(siguientePregunta, 1000);
      } else {
        mensaje.textContent = 'Intenta de nuevo.';
      }
    };
    opcionesNumeros.appendChild(btn);
  });
}

document.getElementById("btnVolver").onclick = () => {
  window.location.href = "../niveles/nivel-4.html";
};
