const nombre = localStorage.getItem('usuario') || 'Peque';
const claveProgreso = 'progresoNivel3_' + nombre;
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || { colores: false, formas: false };

const colores = [
  { nombre: "Rojo", color: "#e53935" },       
  { nombre: "Azul", color: "#2196f3" },
  { nombre: "Verde", color: "#4caf50" },
  { nombre: "Amarillo", color: "#ffeb3b", texto: "#333" },
  { nombre: "Naranja", color: "#ff9800" },
  { nombre: "Lila", color: "#9c27b0" },
  { nombre: "Rosa", color: "#ff4081" },       
  { nombre: "Marrón", color: "#795548" },
  { nombre: "Gris", color: "#9e9e9e", texto: "#333" },
  { nombre: "Negro", color: "#000000" },
];

let coloresDisponibles = [...colores]; // Clonamos los colores originales

const sonidoAplauso = document.getElementById('aplauso');
sonidoAplauso.volume = 1;
sonidoAplauso.muted = false;

let aciertos = 0;       
const maxAciertos = 10; 

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

function nuevaPregunta() {
  if (coloresDisponibles.length === 0 || aciertos >= maxAciertos) {
    document.getElementById("mensaje").textContent = "¡Has completado el juego! Redirigiendo...";
    setTimeout(() => {
      progreso.colores = true;
      localStorage.setItem(claveProgreso, JSON.stringify(progreso));
      window.location.href = '../niveles/nivel-3.html';
    }, 2000);
    return;
  }

  const colorObjetivo = coloresDisponibles[Math.floor(Math.random() * coloresDisponibles.length)];
  const opciones = [colorObjetivo];

  while (opciones.length < 3) {
    const candidato = colores[Math.floor(Math.random() * colores.length)];
    if (!opciones.some(c => c.nombre === candidato.nombre)) {
      opciones.push(candidato);
    }
  }

  shuffle(opciones);

  document.querySelector("p").innerHTML = `¿Cuál es el color <strong>${colorObjetivo.nombre.toLowerCase()}</strong>? ¡Toca la opción correcta!`;

  const opcionesDiv = document.getElementById("opciones");
  opcionesDiv.innerHTML = "";

  opciones.forEach(opc => {
    const div = document.createElement("div");
    div.className = "opcion";
    div.dataset.color = opc.nombre.toLowerCase();
    div.style.backgroundColor = opc.color;
    div.textContent = "";
    div.setAttribute("aria-label", opc.nombre);

    div.onclick = () => {
      if (opc.nombre === colorObjetivo.nombre) {
        aciertos++;
        document.getElementById("mensaje").textContent = `¡Correcto! Aciertos: ${aciertos}/${maxAciertos}`;
        sonidoAplauso.currentTime = 0;
        sonidoAplauso.play().catch(e => console.log("Error al reproducir audio:", e));

        coloresDisponibles = coloresDisponibles.filter(c => c.nombre !== colorObjetivo.nombre);

        Array.from(opcionesDiv.children).forEach(child => child.style.pointerEvents = "none");

        setTimeout(() => {
          nuevaPregunta();
        }, 1500);
      } else {
        document.getElementById("mensaje").textContent = "Intenta de nuevo.";
      }
    };

    opcionesDiv.appendChild(div);
  });

  document.getElementById("mensaje").textContent = "";
}

document.getElementById("btnVolver").onclick = () => {
  window.location.href = "../niveles/nivel-3.html";
};

nuevaPregunta();
