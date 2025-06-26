document.addEventListener("DOMContentLoaded", () => {
  const nombreInput = document.getElementById("nombreInput");
  const edadSelect = document.getElementById("edadSelect");
  const btnStart = document.getElementById("btnStart");

  btnStart.addEventListener("click", () => {
    const nombre = nombreInput.value.trim();
    const edad = edadSelect.value;

    if (!nombre || !edad) {
      alert("Por favor, escribe tu nombre y selecciona tu edad.");
      return;
    }

    const usuario = {
      nombre,
      edad,
      email: "Sin correo",
      progreso: 0
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    alert("¡Bienvenido/a, " + nombre + "!");
    window.location.href = "perfil.html"; // Redirige al perfil después
  });
});
