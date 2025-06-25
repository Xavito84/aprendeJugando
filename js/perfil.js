document.addEventListener("DOMContentLoaded", () => {
  const nombreSpan = document.getElementById("nombreUsuario");
  const emailSpan = document.getElementById("emailUsuario");
  const progresoSpan = document.getElementById("progresoUsuario");
  const editarBtn = document.getElementById("editarPerfil");

  // Cargar datos desde localStorage
  const user = JSON.parse(localStorage.getItem("usuario"));

  if (user) {
    nombreSpan.textContent = user.nombre || "Sin nombre";
    emailSpan.textContent = user.email || "Sin correo";
    progresoSpan.textContent = user.progreso ? `${user.progreso}%` : "0%";
  } else {
    // Si no hay datos, establecer algunos por defecto
    const userDefault = {
      nombre: "Xavier Martínez",
      email: "xavier@example.com",
      progreso: 0
    };
    localStorage.setItem("usuario", JSON.stringify(userDefault));
    location.reload(); // Recarga para aplicar datos
  }

  // Botón para editar
  editarBtn.addEventListener("click", () => {
    const nuevoNombre = prompt("Edita tu nombre:", nombreSpan.textContent);
    const nuevoEmail = prompt("Edita tu correo:", emailSpan.textContent);

    if (nuevoNombre && nuevoEmail) {
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("usuario")),
        nombre: nuevoNombre.trim(),
        email: nuevoEmail.trim()
      };

      localStorage.setItem("usuario", JSON.stringify(updatedUser));
      alert("Perfil actualizado.");
      location.reload(); // Refrescar para mostrar los cambios
    } else {
      alert("Los campos no pueden estar vacíos.");
    }
  });
});
