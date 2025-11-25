const img = document.querySelector("#picture");
const inputField = document.querySelector("#input");
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

let allGameContent = {};
let score = 0;
let gameContent = []
let timerValue = 45;
let gameTimer = null;
let gamePlaying = null;
pictureBox.classList.add("hidden");
chessDescription.classList.add("hidden");
flagsDescription.classList.add("hidden")

fetch("gameContent.json")
  .then((response) => response.json())
  .then((data) => {
    allGameContent = data;
    console.log(allGameContent);
  })
  .catch((error) => console.error("Error loading game content:", error));

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
  gameContent = allGameContent[gamePlaying];
  startGame()
  pictureBox.classList.toggle("hidden");
  descriptionBox.classList.toggle("hidden");
});

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function newRandomPicture() {
  let picturePath = gamePlaying + "/" + getRandomElement(gameContent).src;
  img.setAttribute("src", picturePath);
}

function wrongAnswer() {
  inputField.classList.add("wrong");
  setTimeout(() => {
    inputField.classList.remove("wrong");
  }, 1500);
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
    console.log("wrong answer");
    wrongAnswer();
  }
}

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleGuess();
  }
});

// play again  --- BURDE HAVE EN COUNTDOWN
playAgainButton.addEventListener("click", function () {
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

function startGame() {
  inputField.disabled = false;
  inputField.focus();
  newRandomPicture();
  score = 0;
  timerValue = 45;
  correctGuess.textContent = score;
  if (gameTimer !== null) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  timer.textContent = timerValue;
  function countdown() {
    if (timerValue > 0) {
      timerValue--;
      timer.textContent = timerValue;
    } else {
      endGame();
    }
  }
  gameTimer = setInterval(countdown, 1000);
}

function endGame() {
  inputField.disabled = true;
  clearInterval(gameTimer);
  gameTimer = null;
}