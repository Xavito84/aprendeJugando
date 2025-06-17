// Validación de formulario de contacto

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    let valido = true;

    // Eliminar errores previos
    document.querySelectorAll(".error-msg").forEach(el => el.remove());

    // Validar nombre
    if (nombre.value.trim() === "") {
      mostrarError(nombre, "Por favor, introduce tu nombre.");
      valido = false;
    }

    // Validar email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      mostrarError(email, "Introduce un correo electrónico válido.");
      valido = false;
    }

    // Validar mensaje
    if (mensaje.value.trim().length < 10) {
      mostrarError(mensaje, "El mensaje debe tener al menos 10 caracteres.");
      valido = false;
    }

    if (!valido) {
      event.preventDefault();
    }
  });

  function mostrarError(elemento, mensaje) {
    const error = document.createElement("div");
    error.className = "error-msg";
    error.style.color = "red";
    error.style.fontSize = "0.9em";
    error.textContent = mensaje;
    elemento.parentNode.insertBefore(error, elemento.nextSibling);
  }
});
