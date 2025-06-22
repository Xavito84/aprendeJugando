const contenedorPuzzle = document.getElementById("puzzle");
const zonasDestino = document.getElementById("zonaDestino");
const mensaje = document.getElementById("mensaje");
const volverBtn = document.getElementById("btnVolver");
const reiniciarBtn = document.getElementById("btnReiniciar");

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
  contenedorPuzzle.innerHTML = "";
  zonasDestino.innerHTML = "";
  mensaje.textContent = "";
  piezasColocadas = 0;

  const piezas = [
    { src: puzzle.pieza1, id: "1" },
    { src: puzzle.pieza2, id: "2" },
    { src: puzzle.pieza3, id: "3" },
    { src: puzzle.pieza4, id: "4" }
  ];

  shuffle(piezas);

  // Crear piezas arrastrables
  piezas.forEach(pieza => {
    const img = document.createElement("img");
    img.src = pieza.src;
    img.classList.add("pieza");
    img.setAttribute("draggable", "true");
    img.dataset.pieza = pieza.id;

    // Evento dragstart
    img.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("pieza", pieza.id);
      e.dataTransfer.setData("src", pieza.src);
    });

    contenedorPuzzle.appendChild(img);
  });

  // Crear zonas destino
  for (let i = 1; i <= 4; i++) {
    const zona = document.createElement("div");
    zona.classList.add("drop-zone");
    zona.dataset.destino = i.toString();

    zona.addEventListener("dragover", (e) => e.preventDefault());

    zona.addEventListener("drop", (e) => {
      e.preventDefault();

      if (zona.hasChildNodes()) return;

      const idPieza = e.dataTransfer.getData("pieza");
      const src = e.dataTransfer.getData("src");

      const img = document.createElement("img");
      img.src = src;
      zona.appendChild(img);

      // Eliminar imagen de origen
      const piezaOriginal = document.querySelector(`.pieza[data-pieza="${idPieza}"]`);
      if (piezaOriginal) piezaOriginal.remove();

      // Comprobación
      if (idPieza === zona.dataset.destino) {
        piezasColocadas++;
      }

      if (piezasColocadas === 4) {
        mostrarImagenFinal();
      }
    });

    zonasDestino.appendChild(zona);
  }
}

function mostrarImagenFinal() {
  mensaje.textContent = "🎉 ¡Puzzle completado!";
  zonasDestino.innerHTML = "";

  const imgFinal = document.createElement("img");
  imgFinal.src = "../assets/puzzle/perro.png";
  imgFinal.style.width = "240px";
  imgFinal.style.height = "240px";
  imgFinal.style.borderRadius = "10px";
  zonasDestino.appendChild(imgFinal);

  setTimeout(() => {
    window.location.href = "../niveles/nivel-4.html";
  }, 3000);
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

reiniciarBtn.onclick = () => {
  iniciarPuzzle(puzzleActual);
};
