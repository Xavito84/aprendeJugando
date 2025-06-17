    const items = [
        { letter: 'A', word: 'Avión', img: '../assets/img/avion.jpg' },
        { letter: 'B', word: 'Barco', img: '../assets/img/barco.jpg' },
        { letter: 'C', word: 'Conejo', img: '../assets/img/conejo.png' },
        { letter: 'D', word: 'Delfín', img: 'https://cdn.pixabay.com/photo/2013/07/12/18/39/dolphin-153812_1280.png' },
        { letter: 'E', word: 'Elefante', img: 'https://cdn.pixabay.com/photo/2012/04/01/17/30/elephant-23680_1280.png' },
        { letter: 'F', word: 'Fresa', img: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/strawberry-1239425_1280.jpg' },
        { letter: 'G', word: 'Gato', img: 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg' },
        { letter: 'H', word: 'Helado', img: 'https://cdn.pixabay.com/photo/2014/12/21/23/28/ice-cream-579693_1280.png' },
        { letter: 'I', word: 'Iglesia', img: 'https://cdn.pixabay.com/photo/2016/03/27/19/40/church-1280107_1280.jpg' },
        { letter: 'J', word: 'Jirafa', img: 'https://cdn.pixabay.com/photo/2013/07/13/12/46/giraffe-146609_1280.png' },
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