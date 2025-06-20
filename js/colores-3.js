const nombre = localStorage.getItem('usuario') || 'Peque';
const claveProgreso = 'progresoNivel3_' + nombre;
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  colores: false,
  formas: false,
  letras: false,
  memory: false
};

let items = [];
let coloresDisponibles = [];
let aciertos = 0;
const maxAciertos = 10;

const sonidoAplauso = document.getElementById('aplauso');
sonidoAplauso.volume = 1;
sonidoAplauso.muted = false;

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
    document.getElementById("mensaje").textContent = "🎉 ¡Has completado el juego! Redirigiendo...";
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
    const candidato = items[Math.floor(Math.random() * items.length)];
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
    div.textContent = ""; // o opc.nombre si deseas mostrar el nombre
    if (opc.texto) div.style.color = opc.texto;
    div.setAttribute("aria-label", opc.nombre);

    div.onclick = () => {
      if (opc.nombre === colorObjetivo.nombre) {
        aciertos++;
        document.getElementById("mensaje").textContent = `✅ ¡Correcto! Aciertos: ${aciertos}/${maxAciertos}`;
        sonidoAplauso.currentTime = 0;
        sonidoAplauso.play().catch(e => console.log("Error al reproducir audio:", e));

        coloresDisponibles = coloresDisponibles.filter(c => c.nombre !== colorObjetivo.nombre);

        Array.from(opcionesDiv.children).forEach(child => child.style.pointerEvents = "none");

        setTimeout(() => {
          nuevaPregunta();
        }, 1500);
      } else {
        document.getElementById("mensaje").textContent = "❌ Intenta de nuevo.";
      }
    };

    opcionesDiv.appendChild(div);
  });

  document.getElementById("mensaje").textContent = "";
}

document.getElementById("btnVolver").onclick = () => {
  window.location.href = "../niveles/nivel-3.html";
};

// Carga los datos y empieza el juego
fetch('../data/datos-colores.json')
  .then(response => response.json())
  .then(data => {
    items = data;
    coloresDisponibles = [...items]; // inicializar después de la carga
    nuevaPregunta();
  })
  .catch(error => console.error('Error cargando JSON:', error));


  
  