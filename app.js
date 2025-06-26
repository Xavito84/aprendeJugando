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

  // Redirige a la sección de juegos correspondiente a su edad
  switch (edad) {
    case "3":
      window.location.href = "../niveles/nivel-3.html";
      break;
    case "4":
      window.location.href = "../niveles/nivel-4.html";
      break;
    case "5":
      window.location.href = "../niveles/nivel-5.html";
      break;
    default:
      window.location.href = "inicio.html";
  }
});
