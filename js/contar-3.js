const nivel = 3;

// --- Obtener usuario ---
function obtenerUsuario() {
  const userRaw = localStorage.getItem('usuario');
  try {
    return JSON.parse(userRaw) || { nombre: 'Peque' };
  } catch {
    return { nombre: 'Peque' };
  }
}

// --- Guardar progreso de forma unificada ---
function completarJuego(nivel, juego) {
  const user = obtenerUsuario();
  const claveProgreso = `progresoNivel${nivel}_` + user.nombre;

  let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
    colores: false,
    formas: false,
    letras: false,
    memory: false,
    contar: false
  };

  progreso[juego] = true;
  localStorage.setItem(claveProgreso, JSON.stringify(progreso));
}

// --- Variables del juego ---
let datos = [];
let aciertos = 0;
const maxAciertos = 10;

// --- Elementos DOM ---
const tipoObjetoSpan = document.getElementById("tipoObjeto");
const zonaImagenes = document.getElementById("zonaImagenes");
const opcionesNumeros = document.getElementById("opcionesNumeros");
const mensaje = document.getElementById("mensaje");
const btnVolver = document.getElementById("btnVolver");
const aplauso = document.getElementById("aplauso");

// --- Config audio ---
aplauso.volume = 1;
aplauso.muted = false;
window.addEventListener("click", () => {
  aplauso.play().catch(() => {});
}, { once: true });

// --- Mostrar nueva pregunta ---
function siguientePregunta() {
  if (aciertos >= maxAciertos) {
    mensaje.textContent = "🎉 ¡Juego completado! Redirigiendo...";
    completarJuego(3, 'contar');
    setTimeout(() => {
      window.location.href = "../niveles/nivel-3.html";
    }, 2000);
    return;
  }

  mensaje.textContent = "";

  const item = datos[Math.floor(Math.random() * datos.length)];
  const cantidad = Math.floor(Math.random() * (item.max + 1 - item.min)) + item.min;

  tipoObjetoSpan.textContent = item.nombre;

  zonaImagenes.innerHTML = '';
  for (let i = 0; i < cantidad; i++) {
    const img = document.createElement("img");
    img.src = item.imagen;
    img.alt = item.nombre;
    img.style.width = "80px";
    img.style.margin = "5px";
    zonaImagenes.appendChild(img);
  }

  const opciones = [cantidad];
  while (opciones.length < 3) {
    const num = Math.floor(Math.random() * 10) + 1;
    if (!opciones.includes(num)) opciones.push(num);
  }
  opciones.sort(() => Math.random() - 0.5);

  opcionesNumeros.innerHTML = '';
  opciones.forEach(n => {
    const btn = document.createElement("button");
    btn.textContent = n;
    btn.onclick = () => {
      if (n === cantidad) {
        aciertos++;
        mensaje.textContent = "¡Correcto! 🎉";
        aplauso.currentTime = 0;
        aplauso.play();
        setTimeout(siguientePregunta, 1200);
      } else {
        mensaje.textContent = "Intenta de nuevo.";
      }
    };
    opcionesNumeros.appendChild(btn);
  });
}

// --- Botón volver ---
btnVolver.onclick = () => {
  window.location.href = "../niveles/nivel-3.html";
};

// --- Cargar datos JSON externo y comenzar ---
fetch('../data/datos-contar.json')
  .then(res => {
    if (!res.ok) throw new Error("No se pudo cargar el JSON");
    return res.json();
  })
  .then(jsonDatos => {
    datos = jsonDatos;
    if (!Array.isArray(datos) || datos.length === 0) {
      mensaje.textContent = "No hay datos para jugar.";
      return;
    }
    siguientePregunta();
  })
  .catch(e => {
    console.error("Error cargando datos:", e);
    mensaje.textContent = "Error cargando datos.";
  });
