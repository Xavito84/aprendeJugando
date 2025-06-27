// Leer usuario de localStorage de forma segura
let nombre = 'Peque';
try {
  const userData = localStorage.getItem('usuario');
  if (userData) {
    const userObj = JSON.parse(userData);
    nombre = userObj.nombre || userData || 'Peque';
  }
} catch {
  nombre = localStorage.getItem('usuario') || 'Peque';
}

// Mostrar nombre usuario en el HTML
const nombreElem = document.getElementById('nombreUsuario');
if (nombreElem) nombreElem.textContent = nombre;

// Clave única para progreso del nivel 5
const claveProgreso = 'progresoNivel5_' + nombre;

// Cargar progreso o inicializar
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  memory: false,
  contar: false,
  puzzle: false,
};

// Actualizar visualmente el progreso en la página
function actualizarProgreso() {
  ['memory', 'contar', 'puzzle'].forEach(juego => {
    const elem = document.getElementById('progreso-' + juego);
    if (elem) {
      elem.textContent = progreso[juego] ? '✅' : '❌';
      elem.style.color = progreso[juego] ? 'green' : 'red';
    }
  });
}
actualizarProgreso();

// Función para navegar a un juego concreto
function irAJuego(juego) {
  window.location.href = `../juegos/${juego}-5.html`;
}

// Función para cerrar sesión
function cerrarSesion() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.clear();
    alert(`Has cerrado sesión correctamente. ¡Hasta luego, ${nombre}!`);
    window.location.href = '../pages/inicio.html';
  }
}

// Exportar funciones para el HTML
window.irAJuego = irAJuego;
window.cerrarSesion = cerrarSesion;
