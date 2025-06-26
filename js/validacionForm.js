document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');

  form.addEventListener('submit', function (e) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const mensaje = document.getElementById('mensaje');

    // Validar nombre (solo letras y espacios, mínimo 2 caracteres)
    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombre.value);
    if (!nombreValido) {
      alert('Por favor, introduce un nombre válido (mínimo 2 letras, solo texto).');
      nombre.focus();
      e.preventDefault();
      return;
    }

    // Validar email
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!emailValido) {
      alert('Por favor, introduce un correo electrónico válido.');
      email.focus();
      e.preventDefault();
      return;
    }

    // Validar teléfono (opcional, solo si se ha introducido)
    if (telefono.value.trim() !== '') {
      const telefonoValido = /^[0-9]{9}$/.test(telefono.value);
      if (!telefonoValido) {
        alert('El teléfono debe tener 9 dígitos, sin espacios ni guiones.');
        telefono.focus();
        e.preventDefault();
        return;
      }
    }

    // Validar mensaje
    if (mensaje.value.trim().length < 10) {
      alert('El mensaje debe tener al menos 10 caracteres.');
      mensaje.focus();
      e.preventDefault();
      return;
    }

    
  });
});
