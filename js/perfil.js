document.addEventListener("DOMContentLoaded", () => {
  const nombreSpan = document.getElementById("nombreUsuario");
  const emailSpan = document.getElementById("emailUsuario");
  const progresoSpan = document.getElementById("progresoUsuario");
  const editarBtn = document.getElementById("editarPerfil");
  const edadContainer = document.getElementById("edadUsuario"); // nuevo

  const user = JSON.parse(localStorage.getItem("usuario"));

  if (user) {
    nombreSpan.textContent = user.nombre || "Sin nombre";
    emailSpan.textContent = user.email || "Sin correo";
    progresoSpan.textContent = user.progreso ? `${user.progreso}%` : "0%";
    if (edadContainer) edadContainer.textContent = user.edad || "N/D";
  } else {
    const userDefault = {
      nombre: "Xavier Martínez",
      email: "xavier@example.com",
      edad: "N/D",
      progreso: 0
    };
    localStorage.setItem("usuario", JSON.stringify(userDefault));
    location.reload();
  }

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
      location.reload();
    } else {
      alert("Los campos no pueden estar vacíos.");
    }
  });
});
