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
const leaderboards = document.querySelector("ol");
const leaderboardsText = document.querySelector("#showLeaderboard")

let allGameContent = {};
let score = 0;
let gameContent = []
let timerValue = 45;
let gameTimer = null;
let gamePlaying = null;
saveButton.disabled=true;
backButton.disabled=true
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
  showHighscore()
});

flagsButton.addEventListener("click", function () {
  flagsDescription.classList.remove("hidden");
  flagsButton.classList.add("active");
  chessDescription.classList.add("hidden");
  chessButton.classList.remove("active");
  gamePlaying = "flags";
  showHighscore()
});

backButton.addEventListener("click", function () {
  backButton.disabled=true
  clearInterval(gameTimer);
  pictureBox.classList.toggle("hidden");
  descriptionBox.classList.toggle("hidden");
});

startGameButton.addEventListener("click", function () {
  gameContent = allGameContent[gamePlaying];
  startGame()
  pictureBox.classList.toggle("hidden");
  descriptionBox.classList.toggle("hidden");
});

function newRandomPicture() {
  let randomElement = gameContent[Math.floor(Math.random() * gameContent.length)]
  let picturePath = gamePlaying + "/" + randomElement.src;
  img.setAttribute("src", picturePath);
}

function wrongAnswer() {
  inputField.classList.add("wrong");
  setTimeout(() => {
    inputField.classList.remove("wrong");
  }, 1000);
}

function correctAnswer() {
  inputField.classList.add("correct")
  setTimeout(() => {
    inputField.classList.remove("correct");
  }, 1000);
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
    correctAnswer()
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

// Enter answer
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleGuess();
  }
});

// play again
playAgainButton.addEventListener("click", function () {
  startGame();
});

// save high score
saveButton.addEventListener("click", function () {
  saveHighscore()
  savedMessage.textContent = "Leaderboards updated";
  endGame()
  saveButton.disabled=true
  nameToSave.value=""
});

function startGame() {
  backButton.disabled=false;
  saveButton.disabled=false;
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
  inputField.disabled = true
  inputField.value = "";
  clearInterval(gameTimer);
  gameTimer = null;
}

function saveHighscore() {
  let jsonStored = localStorage.getItem(gamePlaying + "Score")
  let highscore = JSON.parse(jsonStored) || [];

  let highscoreToSave = {
    name: nameToSave.value,
    score: score
  };

  highscore.push(highscoreToSave)
  highscore = highscore.sort((a, b) => b.score - a.score).slice(0, 5)

  localStorage.setItem(gamePlaying + "Score", JSON.stringify(highscore))
  showHighscore()
}

function showHighscore() {
  let jsonStored = localStorage.getItem(gamePlaying + "Score")
  let highscore = JSON.parse(jsonStored) || [];

  leaderboards.innerHTML = ""
  highscore.forEach(p => {
    let li = document.createElement("li")
    li.textContent = p.name + " - " + p.score
    leaderboards.append(li)
  })
  leaderboardsText.textContent=gamePlaying
}