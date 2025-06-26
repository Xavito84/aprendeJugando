// Obtener objeto usuario desde localStorage
const user = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Peque' };

// Mostrar el nombre
document.getElementById('nombreUsuario').textContent = user.nombre;

// Crear clave de progreso específica del usuario
const claveProgreso = 'progresoNivel3_' + user.nombre;

// Cargar progreso específico del usuario o crear nuevo
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  colores: false,
  formas: false,
  letras: false,
  memory: false,
  contar: false
};

// Actualizar visualmente el progreso
function actualizarProgreso() {
  document.getElementById('progreso-colores').textContent = progreso.colores ? '✅' : '❌';
  document.getElementById('progreso-formas').textContent = progreso.formas ? '✅' : '❌';
  document.getElementById('progreso-letras').textContent = progreso.letras ? '✅' : '❌';
  document.getElementById('progreso-memory').textContent = progreso.memory ? '✅' : '❌';
  document.getElementById('progreso-contar').textContent = progreso.contar ? '✅' : '❌';
}
actualizarProgreso();

// Función para ir al juego
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

// Cerrar sesión
function cerrarSesion() {
  const confirmar = confirm('¿Estás seguro de que quieres cerrar sesión?');

  if (confirmar) {
    localStorage.clear();
    alert('Has cerrado sesión correctamente. ¡Hasta luego, ' + user.nombre + '! 😊');
    window.location.href = '../pages/inicio.html';
  }
}
