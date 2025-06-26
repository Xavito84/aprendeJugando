// Obtener nombre del usuario
const nombre = localStorage.getItem('usuario') || 'Peque';
const progresoKey = 'progresoNivel5_' + nombre;

// Cargar progreso o iniciar nuevo
let progreso = JSON.parse(localStorage.getItem(progresoKey)) || {
  contar: false,
  puzzle: false,
  memory: false,
  letras: false
};

// Elementos del DOM
const grupo1 = document.getElementById('grupo1');
const grupo2 = document.getElementById('grupo2');
const opcionesNumeros = document.getElementById('opcionesNumeros');
const mensaje = document.getElementById('mensaje');
const aplauso = document.getElementById('aplauso');
const signoDiv = document.getElementById('signo');
const btnVolver = document.getElementById('btnVolver');

let datos = [];
let aciertos = 0;
const maxAciertos = 10;

// Activar sonido solo al primer clic (política de navegadores)
window.addEventListener("click", () => aplauso.play().catch(() => {}), { once: true });

// Cargar datos de imágenes y rangos desde JSON
fetch('../data/datos-contar.json')
  .then(res => res.json())
  .then(data => {
    datos = data;
    siguientePregunta();
  })
  .catch(err => {
    console.error('Error cargando datos:', err);
    mensaje.textContent = 'No se pudo cargar el juego.';
  });

// Número aleatorio entre min y max (incluidos)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Dibuja N imágenes en el contenedor dado
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

// Genera una nueva operación y sus opciones
function siguientePregunta() {
  if (aciertos >= maxAciertos) {
    mensaje.textContent = "¡Juego completado! Redirigiendo...";
    progreso.contar = true;
    localStorage.setItem(progresoKey, JSON.stringify(progreso));
    setTimeout(() => window.location.href = "../niveles/nivel-5.html", 2000);
    return;
  }

  let idx1 = getRandomInt(0, datos.length - 1);
  let idx2;
  do {
    idx2 = getRandomInt(0, datos.length - 1);
  } while (idx1 === idx2);

  const item1 = datos[idx1];
  const item2 = datos[idx2];

  const signo = Math.random() < 0.5 ? '+' : '-';
  signoDiv.textContent = signo;

  let num1 = getRandomInt(item1.min, item1.max);
  let num2 = getRandomInt(item2.min, item2.max);

  // Asegurar resultado positivo en resta
  if (signo === '-' && num2 > num1) [num1, num2] = [num2, num1];

  dibujarGrupo(grupo1, num1, item1.imagen, item1.nombre);
  dibujarGrupo(grupo2, num2, item2.imagen, item2.nombre);

  const resultado = signo === '+' ? num1 + num2 : num1 - num2;

  // Crear opciones
  const opciones = new Set([resultado]);
  while (opciones.size < 3) {
    let falsa = getRandomInt(Math.max(0, resultado - 3), resultado + 3);
    if (falsa !== resultado) opciones.add(falsa);
  }

  const opcionesArray = Array.from(opciones).sort(() => Math.random() - 0.5);
  opcionesNumeros.innerHTML = '';
  mensaje.textContent = '';

  opcionesArray.forEach(n => {
    const btn = document.createElement('button');
    btn.textContent = n;
    btn.className = 'opcion';
    btn.onclick = () => {
      if (n === resultado) {
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

// Botón volver
btnVolver.onclick = () => {
  window.location.href = "../niveles/nivel-5.html";
};
