// Obtener o establecer nombre del usuario
const nombre = localStorage.getItem('usuario') || 'Peque';
document.getElementById('nombreUsuario').textContent = nombre;

// Crear una clave única por usuario
const claveProgreso = 'progresoNivel3_' + nombre;

// Cargar progreso específico del usuario o crear nuevo
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  colores: false,
  formas: false
};

// Actualizar visualmente el progreso
function actualizarProgreso() {
  document.getElementById('progreso-colores').textContent = progreso.colores ? '✅' : '❌';
  document.getElementById('progreso-formas').textContent = progreso.formas ? '✅' : '❌';
}
actualizarProgreso();

// Función para ir al juego
function irAJuego(juego) {
  window.location.href = `../juegos/${juego}.html`;
}

// Cerrar sesión: solo borra datos del usuario actual
function cerrarSesion() {
  const confirmar = confirm('¿Estás seguro de que quieres cerrar sesión?');

  if (confirmar) {
    localStorage.clear();
    alert('Has cerrado sesión correctamente. ¡Hasta luego, ' + nombre + '! 😊');
    window.location.href = '../pages/inicio.html';
  }
}
