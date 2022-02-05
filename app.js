const tileDisplay = document.querySelector(".tile-conatiner");
const keyboard = document.querySelector(".key-conatiner");
const messageDisplay = document.querySelector(".message-conatiner");
let wordle;

const getWordle = () => {
  fetch("http://localhost:8000/word")
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      wordle = json.toUpperCase();
    })
    .catch((error) => console.log(error));
};

getWordle();

const Keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "SPACE",
];

const gussesRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

gussesRows.forEach((guessRow, gusseRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow-" + gusseRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + gusseRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.appendChild(rowElement);
});

Keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

const handleClick = (letter) => {
  if (!isGameOver) {
    console.log("clicked", letter);
    if (letter === "SPACE") {
      deleteLetter();
      console.log("guessRows", gussesRows);
      return;
    }
    if (letter === "ENTER") {
      checkRow();
      console.log("guessRows", gussesRows);
      return;
    }
    addLetter(letter);
    console.log("guessRows", gussesRows);
  }
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = letter;
    gussesRows[currentRow][currentTile] = letter;
    tile.setAttribute("data", letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    gussesRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

const checkRow = () => {
  const guess = gussesRows[currentRow].join("");
  console.log("guess", guess);
  if (currentTile > 4) {
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json == "Entry word not found") {
          showMessage("word not found");
          return;
        } else {
          console.log("guess is " + guess, "worlde is" + wordle);
          flipTile();
          if (wordle == guess) {
            showMessage("Magnificent!");
            isGameOver = true;
            return;
          } else {
            if (currentRow >= 5) {
              isGameOver = true;
              showMessage("Game Over!");
              return;
            }
            if (currentRow < 5) {
              currentRow++;
              currentTile = 0;
            }
          }
        }
      })
      .catch((error) => console.log(error));
  }
};
const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(() => messageDisplay.removeChild(messageElement), 3000);
};

const flipTile = () => {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
  });
  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });
  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};

const addColorToKey = (Keyletter, color) => {
  const key = document.getElementById(Keyletter);
  key.classList.add(color);
};
