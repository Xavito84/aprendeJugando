    const items = [
        { letter: 'A', word: 'Avión', img: '../assets/img/avion.jpg' },
        { letter: 'B', word: 'Barco', img: '../assets/img/barco.jpg' },
        { letter: 'C', word: 'Conejo', img: '../assets/img/conejo.png' },
        { letter: 'D', word: 'Delfín', img: '../assets/img/delfin.png' },
        { letter: 'E', word: 'Elefante', img: '../assets/img/elefante.png' },
        { letter: 'F', word: 'Fresa', img: '../assets/img/fresa.png' },
        { letter: 'G', word: 'Gato', img: '../assets/img/gato.png' },
        { letter: 'H', word: 'Helado', img: '../assets/img/helado.png' },
        { letter: 'I', word: 'Indio', img: '../assets/img/indio.png' },
        { letter: 'J', word: 'Jirafa', img: '../assets/img/jirafa.png' },
        ];

        let currentLetter = null;
        let correctItem = null;
        let letrasUsadas = [];

        function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        }

        function elegirNuevaLetra() {                                                                                                     
        const disponibles = items.filter(item => !letrasUsadas.includes(item.letter));
        if (disponibles.length === 0) return null;
        return disponibles[Math.floor(Math.random() * disponibles.length)];
        }

        function nextQuestion() {
        const feedback = document.getElementById('mensaje');
        feedback.textContent = '';

        const nuevaLetra = elegirNuevaLetra();
        if (!nuevaLetra) {
            document.getElementById('letraActual').textContent = '';
            document.getElementById('pregunta').textContent = '';
            document.getElementById('opciones').innerHTML = '';
            feedback.textContent = "🎉 ¡Has acertado todas las letras! 🎉";
            feedback.style.color = 'green';
            return;
        }

        currentLetter = nuevaLetra.letter;
        correctItem = nuevaLetra;

        document.getElementById('letraActual').textContent = currentLetter;
        document.getElementById('pregunta').textContent = `¿Cuál palabra empieza con la letra ${currentLetter}?`;

        let opcionesIncorrectas = items.filter(item => item.letter !== currentLetter);
        shuffle(opcionesIncorrectas);
        opcionesIncorrectas = opcionesIncorrectas.slice(0, 2);

        let allOptions = [correctItem, ...opcionesIncorrectas];
        shuffle(allOptions);

        const optionsDiv = document.getElementById('opciones');
        optionsDiv.innerHTML = '';
        allOptions.forEach(option => {
            const div = document.createElement('div');
            div.className = 'option';
            div.innerHTML = `<img src="${option.img}" alt="${option.word}">`;
            div.onclick = () => checkAnswer(option.letter);
            optionsDiv.appendChild(div);
        });
        }

        function checkAnswer(selectedLetter) {
        const feedback = document.getElementById('mensaje');
        if (selectedLetter === currentLetter) {
            feedback.textContent = `¡Correcto! ${correctItem.word} empieza por ${currentLetter}.`;
            feedback.style.color = 'green';

            letrasUsadas.push(currentLetter);

            // Bloquear opciones para evitar doble clic
            const optionsDiv = document.getElementById('opciones');
            Array.from(optionsDiv.children).forEach(div => div.style.pointerEvents = 'none');

            setTimeout(() => {
            nextQuestion();
            }, 1500);
        } else {
            feedback.textContent = 'Incorrecto. Intenta de nuevo.';
            feedback.style.color = 'red';
        }
        }

        document.getElementById('btnReiniciar').onclick = () => {
        letrasUsadas = [];
        nextQuestion();
        };

        nextQuestion();