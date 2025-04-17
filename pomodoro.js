let workMinutes = 25;
let breakMinutes = 5;
let isWorkTime = true;
let intervalId = null;
let currentTime = 0;

const form = document.getElementById("form-pomodoro");
const workInput = document.getElementById("work-time");
const breakInput = document.getElementById("break-time");
const timerDisplay = document.getElementById("timer-display");
const statusDisplay = document.getElementById("status-display");
const progressBar = document.getElementById("progress-bar");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  workMinutes = parseInt(workInput.value);
  breakMinutes = parseInt(breakInput.value);
  isWorkTime = true;
  startTimer(workMinutes * 60);
});

stopButton.addEventListener("click", () => {
  clearInterval(intervalId);
  statusDisplay.textContent = "Estado: Pausado";
});

resetButton.addEventListener("click", () => {
  clearInterval(intervalId);
  timerDisplay.textContent = "00:00";
  statusDisplay.textContent = "Estado: Listo";
  progressBar.style.width = "0%";
});

function startTimer(duration) {
  clearInterval(intervalId); 
  currentTime = duration;
  updateDisplay(currentTime);
  statusDisplay.textContent = isWorkTime ? "Estado: Enfocado 💼" : "Estado: Descanso ☕";

  intervalId = setInterval(() => {
    currentTime--;
    updateDisplay(currentTime);

    const total = isWorkTime ? workMinutes * 60 : breakMinutes * 60;
    const progress = ((total - currentTime) / total) * 100;
    progressBar.style.width = progress + "%";

    if (currentTime <= 0) {
      clearInterval(intervalId);
      isWorkTime = !isWorkTime;
      startTimer(isWorkTime ? workMinutes * 60 : breakMinutes * 60);
    }
  }, 1000);
}

function updateDisplay(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${min}:${sec}`;
}
