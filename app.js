const img = document.querySelector("#picture");
const inputField = document.querySelector("input");
const timer = document.querySelector("#timer");
const saveButton = document.querySelector("#saveScore");
const chessButton = document.querySelector("#chess");
const flagsButton = document.querySelector("#flags");
const playAgainButton = document.querySelector("#playAgain");
const correctGuess = document.querySelector("#correctGuesses");
const nameToSave = document.querySelector("#username");
const savedMessage = document.querySelector("#savedMessage");

const startGameButton = document.querySelector("#startGame");
const pictureBox = document.querySelector("#pictureBox");
const descriptionBox = document.querySelector("#descriptionBox");
const chessDescription = document.querySelector("#chessDescription");
const flagsDescription = document.querySelector("#flagsDescription");
const backButton = document.querySelector("#backToStart");

pictureBox.classList.add("hidden");
chessDescription.classList.add("hidden");
flagsDescription.classList.add("hidden");

let gamePlaying;
chessButton.addEventListener("click", function () {
  chessDescription.classList.remove("hidden");
  chessButton.classList.add("active");
  flagsDescription.classList.add("hidden");
  flagsButton.classList.remove("active");
  gamePlaying = "chess";
});

flagsButton.addEventListener("click", function () {
  flagsDescription.classList.remove("hidden");
  flagsButton.classList.add("active");
  chessDescription.classList.add("hidden");
  chessButton.classList.remove("active");
  gamePlaying = "flags";
});

backButton.addEventListener("click", function () {
  clearInterval(gameTimer);
  timer.textContent = 45;
  correctGuess.textContent = 0;
  pictureBox.classList.toggle("hidden");
  descriptionBox.classList.toggle("hidden");
});

startGameButton.addEventListener("click", function () {
  pictureBox.classList.toggle("hidden");
  descriptionBox.classList.toggle("hidden");
  inputField.focus();
  startGame();
});

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function newRandomPicture() {
  let jsonToFetch = gamePlaying + ".json";
  fetch(jsonToFetch)
    .then((response) => response.json())
    .then((picture) => {
      let picturePath = gamePlaying + "/" + getRandomElement(picture).src;
      img.setAttribute("src", picturePath);
    });
}

function handleGuess() {
  let text = inputField.value;
  text = text.replace(/['-]/g, "").trim().toLowerCase();
  let currentCountry = img
    .getAttribute("src")
    .split("/")
    .pop()
    .replace(".png", "");
  inputField.value = "";
  if (text == currentCountry) {
    score++;
    correctGuess.textContent = score;
    newRandomPicture();
    return true;
  } else if (text === "pass") {
    timerValue -= 3;
    newRandomPicture();
  } else {
    return false;
  }
}

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    console.log(handleGuess());
  }
});

// play again  --- BURDE HAVE EN COUNTDOWN
playAgainButton.addEventListener("click", function () {
  inputField.disabled = false;
  correctGuess.textContent = score;
  startGame();
});

// save high score
saveButton.addEventListener("click", function () {
  let objName = gamePlaying + "Highscore";

  let highscore = {
    username: nameToSave.value,
    savedScore: score,
  };
  let storedScore = 0;
  let storedJson = localStorage.getItem(objName);
  if (storedJson != null) {
    storedScore = JSON.parse(storedJson).savedScore;
  }

  if (highscore.savedScore > storedScore) {
    localStorage.setItem(objName, JSON.stringify(highscore));
    savedMessage.textContent = "Highscore saved!";
  } else {
    savedMessage.textContent = "Highscore not beat!";
  }
});

let timerValue = 45;
let gameTimer = null;

function startGame() {
  newRandomPicture();
  score = 0;
  timerValue = 45;
  if (gameTimer !== null) {
    clearInterval(gameTimer);
    gametimer = null;
  }
  timer.textContent = timerValue;
  function countdown() {
    if (timerValue > 0) {
      timerValue--;
      timer.textContent = timerValue;
    } else {
      inputField.disabled = true;
      clearInterval(gameTimer);
      gameTimer = null;
    }
  }
  gameTimer = setInterval(countdown, 1000);
}
