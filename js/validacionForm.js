document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');

  form.addEventListener('submit', function (e) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    // Validación nombre (solo letras y espacios, mínimo 2 caracteres)
    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombre.value);
    if (!nombreValido) {
      alert('Por favor, introduce un nombre válido (solo letras y al menos 2 caracteres).');
      nombre.focus();
      e.preventDefault();
      return;
    }

    // Validación email (HTML ya valida, pero hacemos control extra)
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!emailValido) {
      alert('Por favor, introduce un correo electrónico válido.');
      email.focus();
      e.preventDefault();
      return;
    }

    // Validación mensaje (mínimo 10 caracteres)
    if (mensaje.value.trim().length < 10) {
      alert('El mensaje debe tener al menos 10 caracteres.');
      mensaje.focus();
      e.preventDefault();
      return;
    }

    // Todo válido, permitir envío
  });
});
