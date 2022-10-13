export function initGameBoard(gameBoardElement, numberOfGuesses) {
  for (let i = 0; i < numberOfGuesses; i++) {
    const row = document.createElement('div');
    row.className = 'letter-row';

    for (let j = 0; j < 5; j++) {
      const box = document.createElement('div');
      box.className = 'letter-box';
      row.appendChild(box);
    }
    gameBoardElement.appendChild(row);
  }
}

export function animateCSS(element, animation, prefix = 'animate__') {
  // We create a Promise and return it
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element;
    node.style.setProperty('--animate-duration', '0.3s');

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });
}

// Search | Filter Algorithm to find word in a big array of words

export function findWords(wordsArray, str) {
  const string = str.split('');
  const result = wordsArray.filter((word) => string.every((char) => word.includes(char)));
  return result.sort();
}
