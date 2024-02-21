const TRIES_NUMBER = 5;
let tryNumber = 0;
let currentTryLetters = []
let words = []
let wordId = 0
let selectedWord = words[wordId]
let currentTryString = ""
let selectedArr = []

// Enable Screen Keyboard
// Change keys background if the letter is found

// API Call
const apiUrl = 'https://wordle-api.cyclic.app/words';

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        words = data
        return words
    })
    .then(words => {
        wordId = Math.floor(Math.random() * words.length)
        selectedWord = words[wordId]
        return selectedWord
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error with the wordle API")
    });

// Event Listeners

document.addEventListener("keyup", (e) => {
    let pressedKey = String(e.key);
    let found = pressedKey.match(/[a-zA-Z]+/g);
    if (e.code === "Backspace") {
        deleteLetter();

        return
    }
    if (e.code === "Enter") {
        checkWord(currentTryLetters, selectedWord);
        return
    }
    if (!found || found.length > 1) {
        return;
    } else {
        currentTry(tryNumber, currentTryLetters, pressedKey);
    }
});

// Declarations
function initBoard() {
    let board = document.getElementById("word-board");
    for (let i = 0; i < TRIES_NUMBER; i++) {
        let row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < 5; j++) {
            let letter = document.createElement("input");
            letter.className = "letter";
            letter.maxLength = '1';
            letter.addEventListener('keydown', function (e) {
                if (e.code == "Tab" || e.code == "Space") {
                    e.preventDefault();
                }
            });
            letter.addEventListener('click', function (e) {
                e.preventDefault();
            });
            row.appendChild(letter);
        }

        board.appendChild(row);
    }

    currentTry(tryNumber, currentTryLetters, "");
}

function currentTry(tryNumber, currentTryLetters, pressedKey) {
    let currentRow = document.getElementsByClassName('row')[tryNumber];
    if (currentTryLetters.length === 0 && pressedKey == '') {
        currentRow.firstChild.focus()
    }
    else if (pressedKey !== '' && currentTryLetters.length === 0) {
        currentTryLetters.push(pressedKey)
        currentRow.children[currentTryLetters.length].focus()
    }
    else if (currentTryLetters.length === 4) {
        currentTryLetters.push(pressedKey)
        return
    }
    else if (currentTryLetters.length === 5) {
        return
    }
    else {
        currentTryLetters.push(pressedKey)
        currentRow.children[currentTryLetters.length].focus()
    }

}

function deleteLetter() {
    const currentRow = document.getElementsByClassName('row')[tryNumber];
    const previousInput = currentRow.children[currentTryLetters.length - 2];

    if (currentTryLetters.length <= 1) {
        currentTryLetters.pop();
        currentRow.firstChild.focus()
        return;
    }
    else {
        previousInput.focus()
        currentTryLetters.pop();
    }
}

function checkWord(currentTryLetters, selectedWord) {
    currentTryString = currentTryLetters.join("")
    selectedArr = selectedWord.word.split("")
    let wordFinded = findWord(currentTryString)
    if (currentTryLetters.length < 5) {
        return
    }
    else if (currentTryString == selectedWord.word) {
        alert("Ganaste perro, juega de nuevo")
        restartGame()
    }
    else if (wordFinded === false) {
        alert("La palabra no esta en la lista compa")
    }
    else if (wordFinded === true && tryNumber < TRIES_NUMBER - 1) {
        checkLetters(currentTryLetters, selectedArr, tryNumber)
        tryNumber += 1
        document.getElementsByClassName('row')[tryNumber].firstChild.focus();
        currentTryLetters.splice(0, currentTryLetters.length)
    }
    else {
        alert("Game over")
    }
}

function findWord(currentTryString) {
    const wordsArray = words.map(obj => obj.word);
    const index = wordsArray.indexOf(currentTryString);
    return index !== -1 ? true : false
}

function checkLetters(currentTryLetters, selectedArr, tryNumber) {
    let currentRow = document.getElementsByClassName('row')[tryNumber];
    const keys = Array.from(document.querySelectorAll('.keyboard-button'));
    for (let i = 0; i < currentTryLetters.length; i++) {
        currentRow.children[i].classList.add("flipped-letter")
        keys.find(el => {
            if (el.innerHTML == currentTryLetters[i]) {
                el.classList.add("flipped-color")
            }
        });
        setTimeout(() => {
            currentRow.children[i].classList.add("flipped-color");
        }, 500);
        if (currentTryLetters[i] == selectedArr[i]) {
            setTimeout(() => {
                currentRow.children[i].classList.add("correct-position");
            }, 500);
            keys.find(el => {
                if (el.innerHTML == currentTryLetters[i]) {
                    el.classList.add("correct-position")
                }
            });
        }
        for (let j = 0; j < selectedArr.length; j++) {
            if (currentTryLetters[i] == selectedArr[j]) {
                setTimeout(() => {
                    currentRow.children[i].classList.add("include-letter");
                }, 500);
                keys.find(el => {
                    if (el.innerHTML == currentTryLetters[i]) {
                        el.classList.add("incluide-letter")
                    }
                });
            }
        }
    }
}

function restartGame() {
    let firstRow = document.getElementsByClassName('row')[0];
    const addedClasses = ['include-letter', 'correct-position', 'flipped-color', "flipped-letter"];
    const inputs = document.querySelectorAll(".letter")
    inputs.forEach(element => {
        element.classList.remove(...addedClasses);
    });
    wordId = Math.floor(Math.random() * words.length)
    currentTryLetters.splice(0, currentTryLetters.length)
    tryNumber = 0;
    document.getElementById("word-board").reset();
    firstRow.firstChild.focus();
    selectedWord = words[wordId]
    return selectedWord
}

// Calls
initBoard()

