// progresoNivel4.js

// Obtener el objeto usuario desde localStorage
const user = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Peque' };
const nombre = user.nombre;

// Mostrar el nombre en el saludo (en la página)
const nombreUsuarioElem = document.getElementById('nombreUsuario');
if (nombreUsuarioElem) {
  nombreUsuarioElem.textContent = nombre;
}

// Crear una clave única por usuario
const claveProgreso = 'progresoNivel4_' + nombre;

// Cargar progreso del nivel 4 o crear uno nuevo si no existe
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  letras: false,
  puzzle: false,
  memory: false,
  contar: false
};

// Función para actualizar la visualización del progreso
function actualizarProgreso() {
  const juegos = ['letras', 'puzzle', 'memory', 'contar'];
  juegos.forEach(juego => {
    const elem = document.getElementById('progreso-' + juego);
    if (elem) {
      elem.textContent = progreso[juego] ? '✅' : '❌';
    }
  });

  // Total completados / total juegos
  const totalCompletados = Object.values(progreso).filter(v => v).length;
  const totalJuegos = Object.keys(progreso).length;

  const totalElem = document.getElementById('progreso-total');
  if (totalElem) {
    totalElem.textContent = `${totalCompletados} / ${totalJuegos}`;
  }

  const usuarioElem = document.getElementById('progreso-usuario');
  if (usuarioElem) {
    usuarioElem.textContent = nombre;
  }
}
actualizarProgreso();

// Función para navegar a un juego (asumiendo nombres de archivo estándar)
function irAJuego(juego) {
 window.location.href = `../juegos/${juego}-4.html`;

}

// Función para marcar un juego como completado
function marcarJuegoCompletado(juego) {
  if (progreso.hasOwnProperty(juego)) {
    progreso[juego] = true;
    localStorage.setItem(claveProgreso, JSON.stringify(progreso));
    actualizarProgreso();
  } else {
    console.warn(`El juego "${juego}" no está definido en el progreso.`);
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.clear();
    alert(`Has cerrado sesión correctamente. ¡Hasta luego, ${nombre}! 😊`);
    window.location.href = '../pages/inicio.html';
  }
}

// Exponer funciones para que se puedan usar en HTML
window.irAJuego = irAJuego;
window.cerrarSesion = cerrarSesion;
window.marcarJuegoCompletado = marcarJuegoCompletado;
