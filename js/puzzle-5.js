const contenedorPuzzle = document.getElementById("puzzle");
const zonas = document.getElementById("zonaDestino");
const mensaje = document.getElementById("mensaje");
const volverBtn = document.getElementById("btnVolver");
const reiniciarBtn = document.getElementById("btnReiniciar");

let piezasColocadas = 0;
let puzzleActual = null;

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

  // Array con las 16 piezas (pieza1..pieza16)
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
  const zona = e.currentTarget; // mejor usar currentTarget para zonas

  const piezaId = e.dataTransfer.getData("text/plain");
  const src = e.dataTransfer.getData("src");

  // Si ya hay una pieza en la zona, devolverla al contenedor
  if (zona.hasChildNodes()) {
    const piezaColocada = zona.firstChild;
    const piezaColocadaId = piezaColocada.dataset.piezaColocadaId;

    // Crear img para devolver al contenedor
    const imgDevuelta = document.createElement("img");
    imgDevuelta.src = piezaColocada.src;
    imgDevuelta.classList.add("pieza");
    imgDevuelta.setAttribute("draggable", "true");
    imgDevuelta.dataset.pieza = piezaColocadaId;
    imgDevuelta.addEventListener("dragstart", arrastrar);
    contenedorPuzzle.appendChild(imgDevuelta);

    // Si esa pieza estaba bien colocada, restar contador
    if (zona.dataset.destino === piezaColocadaId) piezasColocadas--;

    zona.innerHTML = "";
  }

  // Colocar la pieza arrastrada en la zona
  const img = document.createElement("img");
  img.src = src;
  img.classList.add("pieza-colocada");
  img.dataset.piezaColocadaId = piezaId;
  zona.appendChild(img);

  // Remover la pieza del contenedor original si está ahí
  const piezaOriginal = contenedorPuzzle.querySelector(`[data-pieza="${piezaId}"]`);
  if (piezaOriginal) piezaOriginal.remove();

  // Contar si la pieza es correcta para la zona
  if (piezaId === zona.dataset.destino) piezasColocadas++;

  // Comprobar si terminó el puzzle
  if (piezasColocadas === 16) {
    mensaje.textContent = "🎉 ¡Bien hecho! Puzzle completado.";

    // Vaciar zonas y poner la imagen final con tamaño ajustado
    zonas.innerHTML = '';
    const finalImg = document.createElement("img");
    finalImg.src = puzzleActual.completo;
    finalImg.alt = "Puzzle completo";
    finalImg.classList.add("final");
    zonas.appendChild(finalImg);

    // Guardar progreso localStorage
    const nombre = localStorage.getItem('usuario') || 'Peque';
    const claveProgreso = 'progresoNivel5_' + nombre;
    let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {};
    progreso.puzzle = true;
    localStorage.setItem(claveProgreso, JSON.stringify(progreso));
    console.log('Progreso guardado:', progreso);

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
