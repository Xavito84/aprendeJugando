const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("message");
const reiniciarBtn = document.getElementById("reset-btn");
const volverBtn = document.getElementById("btnVolver");
const sonidoAcierto = new Audio('../assets/audio/aplauso.mp3');

const imagenes = [
  'avion.jpg',
  'barco.jpg',
  'conejo.png',
  'delfin.png',
  'elefante.png',
  'fresa.png',
  'gato.png',
  'helado.png',
  'indio.png',
  'jirafa.png'
];

let cartas = [];
let seleccionadas = [];
let bloqueadas = false;
let aciertos = 0;

function iniciarJuego() {
  cartas = [...imagenes, ...imagenes].map(nombre => ({
    nombre,
    id: crypto.randomUUID(),
  }));
  cartas = mezclar(cartas);

  tablero.innerHTML = "";
  mensaje.textContent = "";
  aciertos = 0;

  cartas.forEach(carta => {
    const div = document.createElement("div");
    div.classList.add("carta");
    div.dataset.id = carta.id;
    div.dataset.nombre = carta.nombre;

    div.addEventListener("click", () => voltearCarta(div));
    tablero.appendChild(div);
  });
}

function voltearCarta(carta) {
  if (bloqueadas || carta.classList.contains("descubierta") || seleccionadas.includes(carta)) return;

  mostrarImagen(carta);
  seleccionadas.push(carta);

  if (seleccionadas.length === 2) {
    comprobarPareja();
  }
}

function mostrarImagen(carta) {
  carta.style.backgroundImage = `url("../assets/img/${carta.dataset.nombre}")`;
  carta.style.backgroundSize = 'cover';
  carta.style.backgroundPosition = 'center';
}

function ocultarImagen(carta) {
  carta.style.backgroundImage = "";
  carta.style.backgroundColor = "#4caf50";
}

function comprobarPareja() {
  const [c1, c2] = seleccionadas;
  bloqueadas = true;

  if (c1.dataset.nombre === c2.dataset.nombre) {
    c1.classList.add("descubierta");
    c2.classList.add("descubierta");
    seleccionadas = [];
    bloqueadas = false;
    aciertos++;
    sonidoAcierto.play();

    if (aciertos === imagenes.length) {
      mensaje.textContent = "🎉 ¡Completaste el juego!";
      guardarProgreso();
      setTimeout(() => {
        window.location.href = "../niveles/nivel-4.html";
      }, 3000);
    }
  } else {
    setTimeout(() => {
      ocultarImagen(c1);
      ocultarImagen(c2);
      seleccionadas = [];
      bloqueadas = false;
    }, 1000);
  }
}

function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function guardarProgreso() {
  const nombre = localStorage.getItem("usuario") || "Peque";
  const claveProgreso = "progreso_" + nombre;
  let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {};

  if (!progreso.niveles) {
    progreso.niveles = {};
  }

  progreso.niveles.memory4 = true;
  localStorage.setItem(claveProgreso, JSON.stringify(progreso));
}

reiniciarBtn.onclick = iniciarJuego;
volverBtn.onclick = () => window.location.href = "../niveles/nivel-3.html";

iniciarJuego();
