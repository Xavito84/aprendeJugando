const nombre = localStorage.getItem('usuario') || 'Peque';
const progresoKey = 'progresoNivel3_' + nombre;
let progreso = JSON.parse(localStorage.getItem(progresoKey)) || { contar: false };

let datos = [];
let aciertos = 0;
const maxAciertos = 10;

const aplauso = document.getElementById("aplauso");
aplauso.volume = 1;
window.addEventListener("click", () => aplauso.play().catch(() => {}), { once: true });

fetch('../data/datos-contar.json')
  .then(res => res.json())
  .then(data => {
    datos = data;
    siguientePregunta();
  });

function siguientePregunta() {
  if (aciertos >= maxAciertos) {
    document.getElementById("mensaje").textContent = "¡Juego completado! Redirigiendo...";
    progreso.contar = true;
    localStorage.setItem(progresoKey, JSON.stringify(progreso));
    setTimeout(() => window.location.href = "../niveles/nivel-3.html", 2000);
    return;
  }

  const item = datos[Math.floor(Math.random() * datos.length)];
  const cantidad = Math.floor(Math.random() * (item.max + 1 - item.min)) + item.min;

  document.getElementById("tipoObjeto").textContent = item.nombre;

  const zona = document.getElementById("zonaImagenes");
  zona.innerHTML = '';
  for (let i = 0; i < cantidad; i++) {
    const img = document.createElement("img");
    img.src = item.imagen;
    img.alt = item.nombre;
    img.style.width = "80px";
    img.style.margin = "5px";
    zona.appendChild(img);
  }

  const opciones = [cantidad];
  while (opciones.length < 3) {
    const r = Math.floor(Math.random() * 10) + 1;
    if (!opciones.includes(r)) opciones.push(r);
  }

  opciones.sort(() => Math.random() - 0.5);

  const divOpciones = document.getElementById("opcionesNumeros");
  divOpciones.innerHTML = '';
  opciones.forEach(n => {
    const btn = document.createElement("button");
    btn.textContent = n;
    btn.onclick = () => {
      if (n === cantidad) {
        aciertos++;
        document.getElementById("mensaje").textContent = "¡Correcto!";
        aplauso.currentTime = 0;
        aplauso.play();
        setTimeout(siguientePregunta, 1200);
      } else {
        document.getElementById("mensaje").textContent = "Intenta de nuevo.";
      }
    };
    divOpciones.appendChild(btn);
  });
}

document.getElementById("btnVolver").onclick = () => {
  window.location.href = "../niveles/nivel-3.html";
};
