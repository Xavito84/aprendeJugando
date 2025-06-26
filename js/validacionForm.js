document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');

  form.addEventListener('submit', function (e) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const asunto = document.getElementById('asunto');
    const mensaje = document.getElementById('mensaje');

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombre.value)) {
      alert('Por favor, introduce un nombre válido (mínimo 2 letras, solo texto).');
      nombre.focus();
      e.preventDefault();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      alert('Por favor, introduce un correo electrónico válido.');
      email.focus();
      e.preventDefault();
      return;
    }

    if (telefono.value.trim() !== '' && !/^[0-9]{9}$/.test(telefono.value)) {
      alert('El teléfono debe tener 9 dígitos, sin espacios ni guiones.');
      telefono.focus();
      e.preventDefault();
      return;
    }

    if (asunto.value.trim().length < 5) {
      alert('El asunto debe tener al menos 5 caracteres.');
      asunto.focus();
      e.preventDefault();
      return;
    }

    if (mensaje.value.trim().length < 10) {
      alert('El mensaje debe tener al menos 10 caracteres.');
      mensaje.focus();
      e.preventDefault();
      return;
    }
  });
});
