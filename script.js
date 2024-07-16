const targetWord = 'apple'; //ill add some sort of way later to have more words 
const maxGuesses = 6;
let currentGuess = '';
let guessesRemaining = maxGuesses;

document.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
});

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    for (let i = 0; i < maxGuesses * 5; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gameBoard.appendChild(tile);
    }
}

function submitGuess() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.toLowerCase();
    if (guess.length !== 5) {
        setMessage('Guess must be 5 letters long.');
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
