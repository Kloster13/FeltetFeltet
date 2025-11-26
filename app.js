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
const leaderboardsText = document.querySelector("#showLeaderboard");

let allGameContent = {};
let gameContent = [];
let score = 0;
let timerValue = 45;
let gameTimer = null;
let gamePlaying = null;
saveButton.disabled = true;
backButton.disabled = true;
playAgainButton.disabled=true
pictureBox.classList.add("hidden");
chessDescription.classList.add("hidden");
flagsDescription.classList.add("hidden");

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
  showHighscore();
});

flagsButton.addEventListener("click", function () {
  flagsDescription.classList.remove("hidden");
  flagsButton.classList.add("active");
  chessDescription.classList.add("hidden");
  chessButton.classList.remove("active");
  gamePlaying = "flags";
  showHighscore();
});

backButton.addEventListener("click", function () {
  backButton.disabled = true;
  playAgainButton.disabled=true
  clearInterval(gameTimer);
  pictureBox.classList.toggle("hidden");
  descriptionBox.classList.toggle("hidden");
});

startGameButton.addEventListener("click", function () {
  startGame();
  pictureBox.classList.toggle("hidden");
  descriptionBox.classList.toggle("hidden");
});

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleGuess();
  }
});

playAgainButton.addEventListener("click", function () {
  startGame();
});

saveButton.addEventListener("click", function () {
  saveHighscore();
  savedMessage.textContent = "Leaderboards updated!";
    setTimeout(() => {
    savedMessage.textContent = "";
  }, 2000);
  endGame();
  saveButton.disabled = true;
  nameToSave.value = "";
});

function newRandomPicture() {
  let randomInt = Math.floor(Math.random() * gameContent.length);
  let randomElement = gameContent[randomInt];
  let picturePath = gamePlaying + "/" + randomElement.src;
  gameContent.splice(randomInt, 1);
  img.setAttribute("src", picturePath);
}

function wrongAnswer() {
  inputField.classList.add("wrong");
  setTimeout(() => {
    inputField.classList.remove("wrong");
  }, 1000);
}

function correctAnswer() {
  inputField.classList.add("correct");
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
    correctAnswer();
    score++;
    correctGuess.textContent = score;
    newRandomPicture();
    return true;
  } else if (text === "pass" || text === "p") {
    passedAnswer(currentCountry);
    timerValue -= 3;
    correctGuess.textContent = score;
    newRandomPicture();
  } else {
    console.log("wrong answer");
    wrongAnswer();
  }
}

function passedAnswer(answer) {
  savedMessage.textContent = "Passed answer was " + answer;
  setTimeout(() => {
    savedMessage.textContent = "";
  }, 2000);
}

function loadGame() {
  score = 0;
  timerValue = 45;
  gameContent = allGameContent[gamePlaying];
  window.scrollTo(0, 0);
  backButton.disabled = false;
  saveButton.disabled = false;
  inputField.disabled = false;
  playAgainButton.disabled=false;
  inputField.focus();
}

function startGame() {
  loadGame();
  newRandomPicture();
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
  inputField.value = "";
  clearInterval(gameTimer);
  gameTimer = null;
}

function saveHighscore() {
  let jsonStored = localStorage.getItem(gamePlaying + "Score");
  let highscore = JSON.parse(jsonStored) || [];

  let highscoreToSave = {
    name: nameToSave.value,
    score: score,
  };

  highscore.push(highscoreToSave);
  highscore = highscore.sort((a, b) => b.score - a.score).slice(0, 5);

  localStorage.setItem(gamePlaying + "Score", JSON.stringify(highscore));
  showHighscore();
}

function showHighscore() {
  let jsonStored = localStorage.getItem(gamePlaying + "Score");
  let highscore = JSON.parse(jsonStored) || [];

  leaderboards.innerHTML = "";
  highscore.forEach((p) => {
    let li = document.createElement("li");
    li.textContent = p.name + " - " + p.score;
    leaderboards.append(li);
  });
  leaderboardsText.textContent = gamePlaying;
}
