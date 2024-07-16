const maxGuesses = 6;
let targetWord;
let currentGuess = '';
let guessesRemaining;

document.addEventListener('DOMContentLoaded', () => {
    startNewGame();


    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            submitGuess();
        } else if (event.code === 'Backspace') {
            handleDelete();
        }
    });

    const guessInput = document.getElementById('guess-input');
    guessInput.addEventListener('input', () => {
        guessInput.value = guessInput.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
    });
});

async function fetchRandomWord() {
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    const words = await response.json();
    return words[0].toLowerCase();
}

async function startNewGame() {
    targetWord = await fetchRandomWord();
    guessesRemaining = maxGuesses;
    currentGuess = '';
    clearGameBoard();
    setMessage('');
}

function clearGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let i = 0; i < maxGuesses * 5; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gameBoard.appendChild(tile);
    }
}

async function validateWord(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
        return false;
    }
    const data = await response.json();
    return data.length > 0;
}

async function submitGuess() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.toLowerCase();
    if (guess.length !== 5) {
        setMessage('Guess must be 5 letters long.');
        return;
    }

    const isValidWord = await validateWord(guess);
    if (!isValidWord) {
        setMessage('Please enter a valid English word.');
        return;
    }

    currentGuess = guess;
    checkGuess();
    guessInput.value = '';
}

function checkGuess() {
    const gameBoard = document.getElementById('game-board');
    const tiles = gameBoard.getElementsByClassName('tile');
    let offset = (maxGuesses - guessesRemaining) * 5;

    for (let i = 0; i < 5; i++) {
        const letter = currentGuess[i];
        const tile = tiles[offset + i];

        if (letter === targetWord[i]) {
            tile.classList.add('correct');
        } else if (targetWord.includes(letter)) {
            tile.classList.add('present');
        } else {
            tile.classList.add('absent');
        }

        tile.textContent = letter;
    }

    guessesRemaining--;

    if (currentGuess === targetWord) {
        setMessage('Congratulations! You guessed the word!');
    } else if (guessesRemaining === 0) {
        setMessage(`Sorry, you have no more guesses left. The word was ${targetWord}.`);
    }
}

function setMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
}

function handleKeyboardClick(letter) {
    const guessInput = document.getElementById('guess-input');
    guessInput.value += letter;
}

function handleDelete() {
    const guessInput = document.getElementById('guess-input');
    guessInput.value = guessInput.value.slice(0, -1);
}
