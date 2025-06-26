// Obtener o establecer nombre del usuario
const nombre = localStorage.getItem('usuario') || 'Peque';
document.getElementById('nombreUsuario').textContent = nombre;

// Crear una clave única por usuario
const claveProgreso = 'progresoNivel5_' + nombre;

// Cargar progreso específico del usuario o crear nuevo
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  
  memory: false,
  contar: false,
  puzzle: false
  
  
};

// Actualizar visualmente el progreso
function actualizarProgreso() {
  document.getElementById('progreso-memory').textContent = progreso.memory ? '✅' : '❌';
  document.getElementById('progreso-contar').textContent = progreso.contar ? '✅' : '❌';
  document.getElementById('progreso-puzzle').textContent = progreso.puzzle ? '✅' : '❌';

  // Opcional: colores
  document.getElementById('progreso-memory').style.color = progreso.memory ? 'green' : 'red';
  document.getElementById('progreso-contar').style.color = progreso.contar ? 'green' : 'red';
  document.getElementById('progreso-puzzle').style.color = progreso.puzzle ? 'green' : 'red';

  // Total
  document.getElementById('progreso-total').textContent =
    `${Object.values(progreso).filter(v => v).length} / ${Object.keys(progreso).length}`;
  document.getElementById('progreso-usuario').textContent = nombre;
}

actualizarProgreso();

// Función para ir al juego
function irAJuego(juego) {
  window.location.href = `../juegos/${juego}-5.html`;
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
