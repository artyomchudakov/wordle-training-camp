import { WORDS } from './words.js';
import { animateCSS } from './helper.js';

const openHintBtn = document.querySelector('.open-hint-section-btn');
const inputQuery = document.getElementById('hint-input');
const displayArea = document.getElementById('hint-results');
const wordleHelper = document.getElementById('wordle-helper');
const onScreenKeyboard = document.getElementById('keyboard-on-screen');

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

function initBoard() {
  const board = document.getElementById('game-board');

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    const row = document.createElement('div');
    row.className = 'letter-row';

    for (let j = 0; j < 5; j++) {
      const box = document.createElement('div');
      box.className = 'letter-box';
      row.appendChild(box);
    }
    board.appendChild(row);
  }
}
initBoard();

// Accept user input
document.addEventListener('keyup', (e) => {
  if (e.target === inputQuery) return;

  if (guessesRemaining === 0) return;

  const pressedKey = String(e.key);

  if (pressedKey === 'Backspace' && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === 'Enter') {
    checkGuess();
    return;
  }

  const found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

function insertLetter(pressedKey) {
  if (nextLetter === 5) return;

  pressedKey = pressedKey.toLowerCase();

  const row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
  const box = row.children[nextLetter];

  animateCSS(box, 'pulse');

  box.textContent = pressedKey;
  box.classList.add('filled-box');
  currentGuess.push(pressedKey);
  nextLetter += 1;
}

function deleteLetter() {
  const row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
  const box = row.children[nextLetter - 1];
  box.textContent = '';
  box.classList.remove('filled-box');
  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  const row = document.getElementsByClassName('letter-row')[6 - guessesRemaining];
  let guessString = '';
  let rightGuess = Array.from(rightGuessString);
  for (const val of currentGuess) {
    guessString += val;
  }
  if (guessString.length !== 5) {
    toastr.error('Not enough letters!');
    return;
  }
  if (!WORDS.includes(guessString)) {
    toastr.error('Word not in list');
    return;
  }

  for (let i = 0; i < 5; i++) {
    let letterColor = '';
    const box = row.children[i];
    const letter = currentGuess[i];

    const letterPosition = rightGuess.indexOf(currentGuess[i]);

    if (letterPosition === -1) {
      letterColor = 'rgba(128, 128, 128, 0.5)';
    } else {
      if (currentGuess[i] === rightGuess[i]) {
        letterColor = '#3ca02d';
      } else {
        letterColor = '#a58732';
      }

      rightGuess[letterPosition] = '#';
    }
    const delay = 250 * i;
    setTimeout(() => {
      animateCSS(box, 'flipInX');
      box.style.backgroundColor = letterColor;
      shadeKeyboard(letter, letterColor);
    }, delay);
  }

  if (guessString === rightGuessString) {
    toastr.success('You guessed right! Game over!');
    guessesRemaining = 0;
    return;
  } else {
    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining === 0) {
      toastr.error(`You've run out of guesses! Game over!`);
      toastr.info(`The right word was: "${rightGuessString}"`);
    }
  }
}

onScreenKeyboard.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.classList.contains('keyboard-btn')) return;

  let key = target.textContent;
  if (key === 'Del') {
    key = 'Backspace';
  }
  document.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
});

function shadeKeyboard(letter, color) {
  const buttons = document.querySelectorAll('.keyboard-btn');
  for (const elem of buttons) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === '#3ca02d') return;
      if (oldColor === '#a58732' && color !== '#3ca02d') return;

      elem.style.backgroundColor = color;
      break;
    }
  }
}

// HINT SECTION
openHintBtn.addEventListener('click', () => {
  wordleHelper.classList.toggle('hidden');
  openHintBtn.textContent = wordleHelper.classList.contains('hidden')
    ? 'GET A HINT'
    : 'HIDE HINTS SECTION';
});

inputQuery.addEventListener('keyup', (e) => {
  displayArea.innerHTML = inputQuery.value === '' ? 'No results yet' : '';
  const userInput = e.target.value;
  if (!userInput) return;
  if (userInput.length > 5) {
    toastr.error('Only 1 to 5 characters can be entered');
  }
  const filteredWords = findWords(WORDS, userInput.toLowerCase());
  filteredWords.forEach((word) => {
    const container = document.createElement('div');
    container.classList.add('word');
    container.textContent = word;
    displayArea.appendChild(container);
  });
});

// Search Algorithm

function findWords(words, str) {
  const string = str.split('');
  const result = words.filter((word) => string.every((char) => word.includes(char)));
  return result.sort();
}
