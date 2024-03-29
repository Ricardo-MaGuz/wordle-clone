const TRIES_NUMBER = 5;
let tryNumber = 0;
let currentTryLetters = []
let words = []
let wordId = 0
let selectedWord = words[wordId]

// To Dos
// Add Readme

// API Call
const apiUrl = 'https://wordle-api.cyclic.app/words';

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        words = data
        wordId = Math.floor(Math.random() * words.length)
        console.log(words[wordId])
        return selectedWord = words[wordId]
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error with the wordle API")
    });


// Event Listeners
document.getElementById("keyboard").addEventListener("click", (e) => {
    const target = e.target
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent
    if (key === "Delete") {
        key = "Backspace"
    }
    if (key === "Backspace") {
        deleteLetter();
        return
    }
    if (key === "Enter") {
        checkWord(currentTryLetters, selectedWord);
        return
    }
    document.dispatchEvent(new KeyboardEvent("keydown", { 'key': key }))
})

document.addEventListener("keydown", (e) => {
    let pressedKey = String(e.key);
    let found = pressedKey.match(/^[a-zA-Z]$/);
    if (e.code === "Backspace") {
        deleteLetter();
        return
    }
    if (e.code === "Enter") {
        checkWord(currentTryLetters, selectedWord);
        return
    }
    if (!found) {
        e.stopPropagation()
        e.preventDefault()
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
    if (!currentTryLetters.length && !pressedKey) {
        currentRow.firstChild.focus()
    }
    else if (pressedKey) {
        if (currentTryLetters.length > 4) {
            currentRow.children[currentTryLetters.length - 1].focus()
            return
        }
        currentRow.children[currentTryLetters.length].focus()
        currentRow.children[currentTryLetters.length].value = pressedKey
        currentTryLetters.push(pressedKey)
    }

    else return
}

function deleteLetter() {
    const currentRow = document.getElementsByClassName('row')[tryNumber];
    const previousInput = currentRow.children[currentTryLetters.length - 1];
    if (currentTryLetters.length <= 1) {
        currentRow.firstChild.value = ""
        currentTryLetters.pop();
        currentRow.firstChild.focus()
        return;
    }
    else {
        previousInput.value = ""
        previousInput.focus()
        currentTryLetters.pop();
    }
}

function checkWord(currentTryLetters, selectedWord) {
    let currentTryString = currentTryLetters.join("")
    let selectedArr = selectedWord.word.split("")
    let foundWord = findWord(currentTryString)
    if (currentTryLetters.length < 5) {
        return
    }
    else if (currentTryString == selectedWord.word) {
        const currentRow = document.getElementsByClassName('row')[tryNumber];
        for (let i = 0; i < currentTryLetters.length; i++) {
            currentRow.children[i].classList.add("flipped-letter")
            paintInput(currentRow, i, "correct-position", 500)
        }
        setTimeout(() => {
            alert(`You win! The right word was: ${selectedWord.word}`)
            alert("Want to try again?")
            restartGame()
        }, 1000);


    }
    else if (!foundWord) {
        alert("Sorry we don't have that word")
    }
    else if (foundWord && tryNumber < TRIES_NUMBER - 1) {
        checkLetters(currentTryLetters, selectedArr, tryNumber)
        tryNumber += 1
        document.getElementsByClassName('row')[tryNumber].firstChild.focus();
        currentTryLetters.splice(0, currentTryLetters.length)
    }
    else {
        alert("Game over")
        alert(`The right word was: ${selectedWord.word}`)
        restartGame()
    }
}

function findWord(currentTryString) {
    const wordsArray = words.map(obj => obj.word);
    const index = wordsArray.indexOf(currentTryString);
    return index !== -1
}

function checkLetters(currentTryLetters, selectedArr, tryNumber) {
    let currentRow = document.getElementsByClassName('row')[tryNumber];
    for (let i = 0; i < currentTryLetters.length; i++) {
        currentRow.children[i].classList.add("flipped-letter")
        paintInput(currentRow, i, "flipped-color", 500)
        paintKeyboard(currentTryLetters[i], "", "flipped-color")
        if (currentTryLetters[i] == selectedArr[i]) {
            paintInput(currentRow, i, "correct-position", 500)
            paintKeyboard(currentTryLetters[i], "flipped-color", "correct-position")
        }
        for (let j = 0; j < selectedArr.length; j++) {
            if (currentTryLetters[i] == selectedArr[j]) {
                paintInput(currentRow, i, "include-letter", 500)
                paintKeyboard(currentTryLetters[i], "flipped-color", "include-letter")
            }
        }
    }
}

function paintKeyboard(letter, removeClass, addClass) {
    const keys = Array.from(document.querySelectorAll('.keyboard-button'));
    keys.find(el => {
        if (el.innerHTML == letter) {
            if (removeClass) {
                el.classList.remove(removeClass)
                el.classList.add(addClass)
            } else {
                el.classList.add(addClass)
            }
        }
    });
}

function paintInput(currentRow, index, addClass, delay) {
    setTimeout(() => {
        currentRow.children[index].classList.add(addClass);
    }, delay);
}

function restartGame() {
    let firstRow = document.getElementsByClassName('row')[0];
    const addedClasses = ['include-letter', 'correct-position', 'flipped-color', "flipped-letter"];
    const inputs = document.querySelectorAll(".letter")
    const keys = document.querySelectorAll(".keyboard-button")
    inputs.forEach(element => {
        element.classList.remove(...addedClasses);
    });
    keys.forEach(element => {
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

