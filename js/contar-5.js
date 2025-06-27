// Obtener nombre del usuario y progreso guardado
const nombre = localStorage.getItem('usuario') || 'Peque';
const progresoKey = 'progresoNivel5_' + nombre;
let progreso = JSON.parse(localStorage.getItem(progresoKey)) || {
  contar: false,
  puzzle: false,
  memory: false,
  letras: false
};

// Referencias DOM
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

// Activar sonido solo al primer clic por política del navegador
window.addEventListener("click", () => aplauso.play().catch(() => {}), { once: true });

// Cargar datos JSON con objetos e imágenes
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

// Función para generar número aleatorio entero entre min y max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Dibuja 'cantidad' imágenes en el contenedor especificado
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

// Genera una nueva pregunta con suma o resta
function siguientePregunta() {
  if (aciertos >= maxAciertos) {
    mensaje.textContent = "¡Juego completado! Redirigiendo...";
    progreso.contar = true;
    localStorage.setItem(progresoKey, JSON.stringify(progreso));
    setTimeout(() => window.location.href = "../niveles/nivel-5.html", 2000);
    return;
  }

  // Elegir dos objetos distintos
  let idx1 = getRandomInt(0, datos.length - 1);
  let idx2;
  do {
    idx2 = getRandomInt(0, datos.length - 1);
  } while (idx2 === idx1);

  const item1 = datos[idx1];
  const item2 = datos[idx2];

  // Definir operación + o -
  const signo = Math.random() < 0.5 ? '+' : '-';
  signoDiv.textContent = signo;

  // Números aleatorios dentro de los rangos
  let num1 = getRandomInt(item1.min, item1.max);
  let num2 = getRandomInt(item2.min, item2.max);

  // Para la resta, asegurar resultado no negativo
  if (signo === '-' && num2 > num1) [num1, num2] = [num2, num1];

  dibujarGrupo(grupo1, num1, item1.imagen, item1.nombre);
  dibujarGrupo(grupo2, num2, item2.imagen, item2.nombre);

  const resultado = signo === '+' ? num1 + num2 : num1 - num2;

  // Crear opciones (resultado + 2 distractores)
  const opciones = new Set([resultado]);
  while (opciones.size < 3) {
    const falsa = getRandomInt(Math.max(0, resultado - 3), resultado + 3);
    if (falsa !== resultado) opciones.add(falsa);
  }

  const opcionesArray = Array.from(opciones).sort(() => Math.random() - 0.5);

  opcionesNumeros.innerHTML = '';
  mensaje.textContent = '';

  opcionesArray.forEach(n => {
    const btn = document.createElement('button');
    btn.textContent = n;
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

// Volver al nivel 5 principal
btnVolver.onclick = () => {
  window.location.href = "../niveles/nivel-5.html";
};

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
