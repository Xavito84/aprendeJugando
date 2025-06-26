// Obtener usuario y progreso
const user = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Peque' };
const claveProgreso = 'progresoNivel3_' + user.nombre;

let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  colores: false,
  formas: false,
  letras: false,
  memory: false,
  contar: false
};

// Mostrar nombre
function mostrarNombreUsuario() {
  const nombreElem = document.getElementById('nombreUsuario');
  if (nombreElem) {
    nombreElem.textContent = user.nombre;
  }
}

// Actualizar la UI del progreso
function actualizarProgreso() {
  const juegos = ['colores', 'formas', 'letras', 'memory', 'contar'];
  juegos.forEach(juego => {
    const elem = document.getElementById(`progreso-${juego}`);
    if (elem) {
      elem.textContent = progreso[juego] ? '✅' : '❌';
    }
  });
}

// Navegar a un juego libremente
function irAJuego(juego) {
  const rutas = {
    colores: 'colores.html',
    formas: 'formas.html',
    letras: 'letras.html',
    memory: 'memory-3.html',
    contar: 'contar.html'
  };

  if (rutas[juego]) {
    window.location.href = `../juegos/${rutas[juego]}`;
  } else {
    alert('Juego no disponible');
  }
}

// Marcar juego como completado (esta función la llamarás desde cada juego cuando termines)
function marcarJuegoCompletado(juego) {
  if (progreso[juego] === false) {
    progreso[juego] = true;
    localStorage.setItem(claveProgreso, JSON.stringify(progreso));
    actualizarProgreso();
  }
}

// Cerrar sesión
function cerrarSesion() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.clear();
    alert(`Has cerrado sesión correctamente. ¡Hasta luego, ${user.nombre}! 😊`);
    window.location.href = '../pages/inicio.html';
  }
}

// Inicializar UI
document.addEventListener('DOMContentLoaded', () => {
  mostrarNombreUsuario();
  actualizarProgreso();
});

// Hacer funciones accesibles globalmente para que puedas llamarlas desde otros scripts
window.irAJuego = irAJuego;
window.marcarJuegoCompletado = marcarJuegoCompletado;
window.cerrarSesion = cerrarSesion;
