// Obtener objeto usuario desde localStorage
const user = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Peque' };
const nombre = user.nombre;

// Mostrar el nombre del usuario
const nombreElem = document.getElementById('progreso-usuario');
if (nombreElem) {
  nombreElem.textContent = nombre;
}

// Clave única para el progreso del nivel 5
const claveProgreso = 'progresoNivel5_' + nombre;

// Cargar o inicializar progreso
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  memory: false,
  contar: false,
  puzzle: false
};

// Actualizar el progreso visual
function actualizarProgreso() {
  ['memory', 'contar', 'puzzle'].forEach(juego => {
    const elem = document.getElementById('progreso-' + juego);
    if (elem) {
      elem.textContent = progreso[juego] ? '✅' : '❌';
      elem.style.color = progreso[juego] ? 'green' : 'red';
    }
  });

  const totalCompletados = Object.values(progreso).filter(Boolean).length;
  const totalJuegos = Object.keys(progreso).length;

  const totalElem = document.getElementById('progreso-total');
  if (totalElem) {
    totalElem.textContent = `${totalCompletados} / ${totalJuegos}`;
  }
}
actualizarProgreso();

// Navegar a un juego concreto
function irAJuego(juego) {
  window.location.href = `../juegos/${juego}-5.html`;
}

// Función para marcar un juego como completado (útil si quieres actualizar el progreso desde un juego)
function marcarJuegoCompletado(juego) {
  if (progreso.hasOwnProperty(juego)) {
    progreso[juego] = true;
    localStorage.setItem(claveProgreso, JSON.stringify(progreso));
    actualizarProgreso();
  } else {
    console.warn(`El juego "${juego}" no está definido en el progreso.`);
  }
}

// Cerrar sesión limpiando localStorage
function cerrarSesion() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.clear();
    alert(`Has cerrado sesión correctamente. ¡Hasta luego, ${nombre}!`);
    window.location.href = '../pages/inicio.html';
  }
}

// Exportar funciones para uso en HTML
window.irAJuego = irAJuego;
window.cerrarSesion = cerrarSesion;
window.marcarJuegoCompletado = marcarJuegoCompletado;
