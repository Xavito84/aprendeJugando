const contenedorPuzzle = document.getElementById("puzzle");
const mensaje = document.getElementById("mensaje");
const volverBtn = document.getElementById("btnVolver");

let puzzleActual = null;
let piezasColocadas = 0;

fetch("../data/datos-puzzle.json")
  .then(res => res.json())
  .then(data => {
    const puzzleAleatorio = data[Math.floor(Math.random() * data.length)];
    puzzleActual = puzzleAleatorio;
    iniciarPuzzle(puzzleActual);
  })
  .catch(err => {
    console.error("Error al cargar el JSON de puzzle:", err);
    mensaje.textContent = "No se pudo cargar el puzzle.";
  });

function iniciarPuzzle(puzzle) {
  const piezas = [
    puzzle.pieza1,
    puzzle.pieza2,
    puzzle.pieza3,
    puzzle.pieza4
  ];

  shuffle(piezas);

  piezas.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("pieza");
    img.setAttribute("draggable", "true");
    img.dataset.pieza = index + 1;
    img.addEventListener("dragstart", arrastrar);
    contenedorPuzzle.appendChild(img);
  });

  // Crear zonas destino
  const zonas = document.getElementById("zonaDestino");
  zonas.innerHTML = "";
  for (let i = 1; i <= 4; i++) {
    const div = document.createElement("div");
    div.classList.add("zona");
    div.dataset.destino = i;
    div.addEventListener("dragover", permitirSoltar);
    div.addEventListener("drop", soltar);
    zonas.appendChild(div);
  }
}

function arrastrar(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.pieza);
  e.dataTransfer.setDragImage(e.target, 30, 30);
  e.dataTransfer.setData("src", e.target.src);
}

function permitirSoltar(e) {
  e.preventDefault();
}

function soltar(e) {
  e.preventDefault();
  const piezaId = e.dataTransfer.getData("text/plain");
  const src = e.dataTransfer.getData("src");
  const destino = e.target;

  if (!destino.hasChildNodes()) {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("pieza-colocada");
    destino.appendChild(img);

    if (piezaId === destino.dataset.destino) {
      piezasColocadas++;
    }

    if (piezasColocadas === 4) {
      mensaje.textContent = "🎉 ¡Bien hecho! Puzzle completado.";
      setTimeout(() => {
        window.location.href = "../niveles/nivel-4.html";
      }, 2000);
    }
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

volverBtn.onclick = () => {
  window.location.href = "../niveles/nivel-4.html";
};

//boton reiniciar
document.getElementById("btnReiniciar").onclick = () => {
  contenedorPuzzle.innerHTML = "";
  mensaje.textContent = "";
  piezasColocadas = 0;
  iniciarPuzzle(puzzleActual);
};
