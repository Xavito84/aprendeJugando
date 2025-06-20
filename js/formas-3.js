// Variables globales para progreso
const nombre = localStorage.getItem('usuario') || 'Peque';
const claveProgreso = 'progresoNivel3_' + nombre;
let progreso = JSON.parse(localStorage.getItem(claveProgreso)) || { colores: false, formas: false };

const formas = [
  { nombre: 'Círculo', imagen: '../assets/img/circulo.png' },
  { nombre: 'Cuadrado', imagen: '../assets/img/cuadrado.png' },
  { nombre: 'Triángulo', imagen: '../assets/img/triangulo.png' },
  { nombre: 'Estrella', imagen: '../assets/img/estrella.png' },
  { nombre: 'Corazón', imagen: '../assets/img/corazon.png' },
  { nombre: 'Rectángulo', imagen: '../assets/img/rectangulo.png' },
  { nombre: 'Óvalo', imagen: '../assets/img/ovalo.png' },
];

let aciertos = 0;
const totalAciertos = 10;

let formasRestantes = [...formas];

const preguntaTexto = document.getElementById('pregunta');
const opcionesDiv = document.getElementById('opciones');
const mensaje = document.getElementById('mensaje');
const sonidoAplauso = document.getElementById('aplauso');

sonidoAplauso.volume = 1;
sonidoAplauso.muted = false;

window.addEventListener("click", () => {
  sonidoAplauso.play().catch(() => { });
}, { once: true });

function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function mostrarPregunta() {
  if (formasRestantes.length < 1 || aciertos >= totalAciertos) {
  mensaje.innerHTML = `<strong>🎉 ¡Completaste el juego!</strong><br/>Redirigiendo...`;
  setTimeout(() => {
    localStorage.setItem(claveProgreso, JSON.stringify({ colores: true, formas: true, letras: false, memory: false }));
    window.location.href = '../niveles/nivel-3.html';
  }, 2000);
  return;
}


  const opciones = mezclar([...formas]).slice(0, 3);
  const opcionesValidas = opciones.filter(f => formasRestantes.some(fr => fr.nombre === f.nombre));

  if (opcionesValidas.length < 1) {
    mostrarPregunta();
    return;
  }

  const correcta = opcionesValidas[Math.floor(Math.random() * opcionesValidas.length)];

  preguntaTexto.textContent = `¿Dónde está el ${correcta.nombre.toLowerCase()}?`;
  opcionesDiv.innerHTML = '';
  mensaje.textContent = '';

  opciones.forEach((forma) => {
    const img = document.createElement('img');
    img.src = forma.imagen;
    img.alt = forma.nombre;
    img.className = 'opcion-img';

    // Ajustes de tamaño para Rectángulo y Óvalo
    if (forma.nombre === 'Rectángulo') {
      img.style.width = '180px';
      img.style.height = '100px';
    } else if (forma.nombre === 'Óvalo') {
      img.style.width = '160px';
      img.style.height = '110px';
    } else {
      img.style.width = '120px';
      img.style.height = '120px';
    }

    img.style.margin = '15px';
    img.style.borderRadius = '16px';
    img.style.cursor = 'pointer';
    img.style.transition = 'transform 0.3s, border 0.3s';

    img.onclick = () => {
      if (forma.nombre === correcta.nombre) {
        sonidoAplauso.currentTime = 0;
        sonidoAplauso.play();
        aciertos++;
        mensaje.textContent = `¡Muy bien! 🎉 Aciertos: ${aciertos}/${totalAciertos}`;
        img.style.border = '4px solid #4caf50';
        img.style.transform = 'scale(1.2)';

        formasRestantes = formasRestantes.filter(f => f.nombre !== correcta.nombre);

        opcionesDiv.querySelectorAll('img').forEach(el => el.style.pointerEvents = 'none');

        setTimeout(() => {
          mostrarPregunta();
        }, 1500);
      } else {
        mensaje.textContent = "Intenta otra vez 🙃";
        img.style.border = '4px solid #f44336';
        setTimeout(() => {
          img.style.border = 'none';
          mensaje.textContent = '';
        }, 1000);
      }
    };

    opcionesDiv.appendChild(img);
  });
}

document.getElementById('btnVolver').onclick = () => {
  window.location.href = '../niveles/nivel-3.html';
};

mostrarPregunta();

// Botón para reiniciar el juego
document.getElementById('btnReiniciar').onclick = () => {
  aciertos = 0;
  formasRestantes = [...formas];
  mensaje.textContent = '';
  mostrarPregunta();
};