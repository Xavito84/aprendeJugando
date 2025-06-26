// Obtener nombre del usuario desde localStorage
const nombre = localStorage.getItem('usuario') || 'Peque';
document.getElementById('progreso-usuario').textContent = nombre;

// Clave de progreso única para este usuario en el Nivel 5
const claveProgreso = 'progresoNivel5_' + nombre;

// Obtener progreso o crear uno nuevo
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || {
  memory: false,
  contar: false,
  puzzle: false
};

// Mostrar el progreso visualmente
function actualizarProgreso() {
  document.getElementById('progreso-memory').textContent = progreso.memory ? '✅' : '❌';
  document.getElementById('progreso-contar').textContent = progreso.contar ? '✅' : '❌';
  document.getElementById('progreso-puzzle').textContent = progreso.puzzle ? '✅' : '❌';

  // Estilo opcional (verde o rojo)
  document.getElementById('progreso-memory').style.color = progreso.memory ? 'green' : 'red';
  document.getElementById('progreso-contar').style.color = progreso.contar ? 'green' : 'red';
  document.getElementById('progreso-puzzle').style.color = progreso.puzzle ? 'green' : 'red';

  // Total completado
  const total = Object.values(progreso).filter(Boolean).length;
  const totalMax = Object.keys(progreso).length;
  document.getElementById('progreso-total').textContent = `${total} / ${totalMax}`;
}
actualizarProgreso();

// Botón para acceder a un juego
function irAJuego(juego) {
  window.location.href = `../juegos/${juego}-5.html`;
}

// Cerrar sesión
function cerrarSesion() {
  const confirmar = confirm('¿Estás seguro de que quieres cerrar sesión?');
  if (confirmar) {
    localStorage.clear();
    alert(`Has cerrado sesión correctamente. ¡Hasta luego, ${nombre}!`);
    window.location.href = '../pages/inicio.html';
  }
}
