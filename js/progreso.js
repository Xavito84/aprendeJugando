const nombreUsuario = localStorage.getItem('usuario') || 'Peque';

function getClaveProgreso(nivel) {
  return 'progresoNivel' + nivel + '_' + nombreUsuario;
}

function getProgreso(nivel, valoresPorDefecto) {
  const clave = getClaveProgreso(nivel);
  const progresoStr = localStorage.getItem(clave);
  return progresoStr ? JSON.parse(progresoStr) : {...valoresPorDefecto};
}

function guardarProgreso(nivel, progreso) {
  const clave = getClaveProgreso(nivel);
  localStorage.setItem(clave, JSON.stringify(progreso));
}
