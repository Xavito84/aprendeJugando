const contenedorPuzzle = document.getElementById("puzzle");
const zonas = document.getElementById("zonaDestino");
const mensaje = document.getElementById("mensaje");
const volverBtn = document.getElementById("btnVolver");
const reiniciarBtn = document.getElementById("btnReiniciar");

let piezasColocadas = 0;
let puzzleActual = null;

const nombreUsuario = localStorage.getItem('usuario') || 'Peque';
const claveProgreso = 'progresoNivel5_' + nombreUsuario;

let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  contar: false,
  puzzle: false,
  memory: false,
  letras: false,
};

function guardarProgreso() {
  localStorage.setItem(claveProgreso, JSON.stringify(progreso));
}

function marcarModuloCompletado(modulo) {
  if (!progreso[modulo]) {
    progreso[modulo] = true;
    guardarProgreso();
    console.log(`Módulo "${modulo}" completado.`);
  }
}

fetch("../data/datos-puzzle2.json")
  .then(res => res.json())
  .then(data => {
    puzzleActual = data[Math.floor(Math.random() * data.length)];
    iniciarPuzzle(puzzleActual);
  })
  .catch(() => {
    mensaje.textContent = "No se pudo cargar el puzzle.";
  });

function iniciarPuzzle(puzzle) {
  contenedorPuzzle.innerHTML = "";
  zonas.innerHTML = "";
  mensaje.textContent = "";
  piezasColocadas = 0;

  const piezas = [];
  for (let i = 1; i <= 16; i++) {
    piezas.push({ src: puzzle[`pieza${i}`], pos: i.toString() });
  }

  shuffle(piezas);

  piezas.forEach(pieza => {
    const img = document.createElement("img");
    img.src = pieza.src;
    img.classList.add("pieza");
    img.setAttribute("draggable", "true");
    img.dataset.pieza = pieza.pos;
    img.addEventListener("dragstart", arrastrar);
    contenedorPuzzle.appendChild(img);
  });

  for (let i = 1; i <= 16; i++) {
    const div = document.createElement("div");
    div.classList.add("zona");
    div.dataset.destino = i.toString();
    div.addEventListener("dragover", permitirSoltar);
    div.addEventListener("drop", soltar);
    zonas.appendChild(div);
  }
}

function arrastrar(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.pieza);
  e.dataTransfer.setData("src", e.target.src);
}

function permitirSoltar(e) {
  e.preventDefault();
}

function soltar(e) {
  e.preventDefault();
  const zona = e.target.closest('.zona');
  if (!zona) return;

  const piezaId = e.dataTransfer.getData("text/plain");
  const src = e.dataTransfer.getData("src");

  // Si ya hay una pieza en la zona, devolverla al contenedor
  if (zona.firstChild) {
    const piezaAnterior = zona.firstChild;
    const imgDevuelta = document.createElement("img");
    imgDevuelta.src = piezaAnterior.src;
    imgDevuelta.classList.add("pieza");
    imgDevuelta.setAttribute("draggable", "true");
    imgDevuelta.dataset.pieza = piezaAnterior.dataset.piezaColocadaId;
    imgDevuelta.addEventListener("dragstart", arrastrar);
    contenedorPuzzle.appendChild(imgDevuelta);

    if (piezaAnterior.dataset.piezaColocadaId === zona.dataset.destino) {
      piezasColocadas--;
    }

    zona.innerHTML = "";
  }

  // Colocar la pieza soltada en la zona
  const img = document.createElement("img");
  img.src = src;
  img.classList.add("pieza-colocada");
  img.dataset.piezaColocadaId = piezaId;
  zona.appendChild(img);

  // Remover la pieza original del contenedor
  const piezaOriginal = contenedorPuzzle.querySelector(`[data-pieza="${piezaId}"]`);
  if (piezaOriginal) piezaOriginal.remove();

  // Contar piezas colocadas correctamente
  if (piezaId === zona.dataset.destino) {
    piezasColocadas++;
  }

  // Revisar si terminó el puzzle
  if (piezasColocadas === 16) {
    mensaje.textContent = "🎉 ¡Felicidades! Has completado el puzzle.";

    marcarModuloCompletado('puzzle');

    setTimeout(() => {
      window.location.href = "../niveles/nivel-5.html";
    }, 3000);
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

volverBtn.onclick = () => {
  window.location.href = "../niveles/nivel-5.html";
};

reiniciarBtn.onclick = () => {
  iniciarPuzzle(puzzleActual);
};
