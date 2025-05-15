let workMinutes = 25;
let breakMinutes = 5;
let isWorkTime = true;
let intervalId = null;
let currentTime = 0;

let sessionHistory = JSON.parse(localStorage.getItem("sessionHistory")) || [];

const form = document.getElementById("form-pomodoro");
const workInput = document.getElementById("work-time");
const breakInput = document.getElementById("break-time");
const timerDisplay = document.getElementById("timer-display");
const statusDisplay = document.getElementById("status-display");
const progressBar = document.getElementById("progress-bar");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");
const viewBtn = document.getElementById("view-history");
const clearBtn = document.getElementById("clear-history");
const historyList = document.getElementById("history-list");

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
  setProgress(0);
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
    setProgress(progress);

    if (currentTime <= 0) {
      clearInterval(intervalId);

      sessionHistory.push({
        type: isWorkTime ? "work" : "break",
        duration: isWorkTime ? workMinutes * 60 : breakMinutes * 60,
        timestamp: new Date().toISOString()
      });
      saveSessionHistory();

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

function saveSessionHistory() {
  localStorage.setItem("sessionHistory", JSON.stringify(sessionHistory));
}

viewBtn.addEventListener("click", () => {
  historyList.innerHTML = "";
  if (sessionHistory.length === 0) {
    historyList.innerHTML = "<li>No hay sesiones registradas.</li>";
    return;
  }

  sessionHistory.forEach((session, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${session.type === "work" ? "Trabajo" : "Descanso"} - ${session.duration / 60} min - ${new Date(session.timestamp).toLocaleString()}`;
    historyList.appendChild(li);
  });
});

clearBtn.addEventListener("click", () => {
  sessionHistory = [];
  saveSessionHistory();
  historyList.innerHTML = "<li>Historial borrado.</li>";
});

const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}
