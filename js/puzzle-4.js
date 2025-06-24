const contenedorPuzzle = document.getElementById("puzzle");
const zonas = document.getElementById("zonaDestino");
const mensaje = document.getElementById("mensaje");
const volverBtn = document.getElementById("btnVolver");
const reiniciarBtn = document.getElementById("btnReiniciar");

let piezasColocadas = 0;
let puzzleActual = null;

fetch("../data/datos-puzzle.json")
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

  const piezas = [
    { src: puzzle.pieza1, pos: "1" },
    { src: puzzle.pieza2, pos: "2" },
    { src: puzzle.pieza3, pos: "3" },
    { src: puzzle.pieza4, pos: "4" }
  ];

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
  e.dataTransfer.setData("src", e.target.src);
}

function permitirSoltar(e) {
  e.preventDefault();
}

function soltar(e) {
  e.preventDefault();
  const zona = e.target;
  const piezaId = e.dataTransfer.getData("text/plain");
  const src = e.dataTransfer.getData("src");

  if (!zona.hasChildNodes()) {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("pieza-colocada");
    zona.appendChild(img);

    const piezaOriginal = contenedorPuzzle.querySelector(`[data-pieza="${piezaId}"]`);
    if (piezaOriginal) piezaOriginal.remove();

    if (piezaId === zona.dataset.destino) {
      piezasColocadas++;
    }

    if (piezasColocadas === 4) {
      mensaje.textContent = "🎉 ¡Bien hecho! Puzzle completado.";

      zonas.innerHTML = ''; // vacía el grid
      const finalImg = document.createElement("img");
      finalImg.src = puzzleActual.completo;
      finalImg.alt = "Puzzle completo";
      finalImg.classList.add("final");
      zonas.appendChild(finalImg);

      // ✅ GUARDAR PROGRESO EN localStorage
      const nombre = localStorage.getItem('usuario') || 'Peque';
      const claveProgreso = 'progresoNivel4_' + nombre;
      let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {};
      progreso.puzzle = true;
      localStorage.setItem(claveProgreso, JSON.stringify(progreso));

      setTimeout(() => {
        window.location.href = "../niveles/nivel-4.html";
      }, 3000);
    }


  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

volverBtn.onclick = () => {
  window.location.href = "../niveles/nivel-4.html";
};

reiniciarBtn.onclick = () => {
  iniciarPuzzle(puzzleActual);
};
