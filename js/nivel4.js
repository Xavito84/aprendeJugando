// Obtener el objeto usuario desde localStorage
const user = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Peque' };
const nombre = user.nombre;

// Mostrar el nombre en el saludo
document.getElementById('nombreUsuario').textContent = nombre;

// Crear una clave única por usuario
const claveProgreso = 'progresoNivel4_' + nombre;

// Cargar progreso del nivel 4
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  letras: false,
  puzzle: false,
  memory: false,
  contar: false
};

// Mostrar el progreso visualmente
function actualizarProgreso() {
  document.getElementById('progreso-letras').textContent = progreso.letras ? '✅' : '❌';
  document.getElementById('progreso-puzzle').textContent = progreso.puzzle ? '✅' : '❌';
  document.getElementById('progreso-memory').textContent = progreso.memory ? '✅' : '❌';
  document.getElementById('progreso-contar').textContent = progreso.contar ? '✅' : '❌';
  document.getElementById('progreso-total').textContent =
    `${Object.values(progreso).filter(v => v).length} / ${Object.keys(progreso).length}`;
  document.getElementById('progreso-usuario').textContent = nombre;
}
actualizarProgreso();

// Ir al juego
function irAJuego(juego) {
  window.location.href = `../juegos/${juego}-4.html`;
}

// Cerrar sesión
function cerrarSesion() {
  const confirmar = confirm('¿Estás seguro de que quieres cerrar sesión?');

  if (confirmar) {
    localStorage.clear();
    alert('Has cerrado sesión correctamente. ¡Hasta luego, ' + nombre + '! 😊');
    window.location.href = '../pages/inicio.html';
  }
}
