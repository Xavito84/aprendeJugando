// progresoNivel4.js

// Obtener usuario desde localStorage o usar 'Peque' por defecto
const user = (() => {
  try {
    return JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Peque' };
  } catch {
    return { nombre: 'Peque' };
  }
})();
const nombre = user.nombre;

// Mostrar nombre en el elemento #nombreUsuario si existe
const nombreUsuarioElem = document.getElementById('nombreUsuario');
if (nombreUsuarioElem) {
  nombreUsuarioElem.textContent = nombre;
}

// Clave única para el progreso del usuario en nivel 4
const claveProgreso = `progresoNivel4_${nombre}`;

// Cargar progreso desde localStorage o crear inicial
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  letras: false,
  puzzle: false,
  memory: false,
  contar: false
};

// Actualiza visualmente el progreso en la página
function actualizarProgreso() {
  const juegos = ['letras', 'puzzle', 'memory', 'contar'];

  juegos.forEach(juego => {
    const elem = document.getElementById('progreso-' + juego);
    if (elem) {
      elem.textContent = progreso[juego] ? '✅' : '❌';
    }
  });

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

// Función para navegar a un juego
function irAJuego(juego) {
  window.location.href = `../juegos/${juego}-4.html`;
}

// Función para marcar un juego como completado y actualizar progreso
function marcarJuegoCompletado(juego) {
  if (progreso.hasOwnProperty(juego)) {
    progreso[juego] = true;
    localStorage.setItem(claveProgreso, JSON.stringify(progreso));
    actualizarProgreso();
  } else {
    console.warn(`El juego "${juego}" no está definido en el progreso.`);
  }
}

// Función para cerrar sesión (limpia todo localStorage y redirige)
function cerrarSesion() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.clear();
    alert(`Has cerrado sesión correctamente. ¡Hasta luego, ${nombre}! 😊`);
    window.location.href = '../pages/inicio.html';
  }
}

// Exponer funciones para uso en HTML
window.irAJuego = irAJuego;
window.marcarJuegoCompletado = marcarJuegoCompletado;
window.cerrarSesion = cerrarSesion;
