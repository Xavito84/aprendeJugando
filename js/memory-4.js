const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("mensaje");
const reiniciarBtn = document.getElementById("btnReiniciar");

const imagenes = [
 '../assets/img/avion.jpg',
  '../assets/img/barco.jpg',
  '../assets/img/conejo.png',
  '../assets/img/delfin.png',
  '../assets/img/elefante.png',
  '../assets/img/fresa.png',
  '../assets/img/gato.png',
  '../assets/img/helado.png',
  '../assets/img/indio.png',
  '../assets/img/jirafa.png'
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

    const img = document.createElement("img");
    img.src = "../assets/img/interrogacion.png";
    img.alt = "Carta oculta";

    div.appendChild(img);
    div.addEventListener("click", () => voltearCarta(div));
    tablero.appendChild(div);
  });
}

function voltearCarta(carta) {
  if (bloqueadas || carta.classList.contains("descubierta") || seleccionadas.includes(carta)) return;

  carta.querySelector("img").src = "../assets/img/" + carta.dataset.nombre;
  seleccionadas.push(carta);

  if (seleccionadas.length === 2) {
    comprobarPareja();
  }
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

    if (aciertos === imagenes.length) {
      mensaje.textContent = "🎉 ¡Completaste el juego!";
      guardarProgreso();
      setTimeout(() => {
        window.location.href = "../niveles/nivel-4.html";
      }, 3000);
    }
  } else {
    setTimeout(() => {
      c1.querySelector("img").src = "../assets/img/interrogacion.png";
      c2.querySelector("img").src = "../assets/img/interrogacion.png";
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

reiniciarBtn.onclick = iniciarJuego;

function guardarProgreso() {
  const nombre = localStorage.getItem("usuario") || "Peque";
  const claveProgreso = "progresoNivel4_" + nombre;
  let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {};
  progreso.memory = true;
  localStorage.setItem(claveProgreso, JSON.stringify(progreso));
}

iniciarJuego();
