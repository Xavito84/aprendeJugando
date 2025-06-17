document.getElementById('btnStart').addEventListener('click', () => {
  const nombre = document.getElementById('nombreInput').value.trim();
  const edad = document.getElementById('edadSelect').value;

  if (!nombre) {
    alert('Por favor, escribe tu nombre 😊');
    return;
  }
  if (!edad) {
    alert('Por favor, selecciona tu edad');
    return;
  }

  // Guardar en localStorage para simular usuario y edad
  localStorage.setItem('usuario', nombre);
  localStorage.setItem('edad', edad);

  // Redirigir a la página del nivel correspondiente
  window.location.href = `../niveles/nivel-${edad}.html`;
});
