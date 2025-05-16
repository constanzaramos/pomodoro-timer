let workMinutes = 25;
let breakMinutes = 5;
let isWorkTime = true;
let intervalId = null;
let currentTime = 0;
let sessionHistory = JSON.parse(localStorage.getItem("sessionHistory")) || [];

let AvailableTasks = [];

const form = document.getElementById("form-pomodoro");
const workInput = document.getElementById("work-time");
const breakInput = document.getElementById("break-time");
const timerDisplay = document.getElementById("timer-display");
const statusDisplay = document.getElementById("status-display");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");
const viewButton = document.getElementById("view-history");
const clearButton = document.getElementById("clear-history");
const historyList = document.getElementById("history-list");

document.getElementById("toggle-info").addEventListener("click", () => {
  const info = document.getElementById("info-content");
  info.classList.toggle("visible");
});

function fetchTasks() {
  fetch("tareas.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo de tareas");
      }
      return response.json();
    })
    .then(data => {
      AvailableTasks = data;
      renderSelectorTask();
    })
    .catch(error => {
      Swal.fire({
        icon: "error",
        title: "Error al cargar tareas",
        text: error.message
      });
    });
}

function renderSelectorTask() {
  const container = document.getElementById("tarea-selector");
  const label = document.createElement("label");
  label.setAttribute("for", "tarea-select");
  label.textContent = "¿Qué tarea vas a hacer?";
  container.appendChild(label);

  const select = document.createElement("select");
  select.id = "tarea-select";
  select.classList.add("select-tarea");
  select.innerHTML = `<option value="">Selecciona una tarea</option>`;
  AvailableTasks.forEach(task => {
    const option = document.createElement("option");
    option.value = task.name;
    option.textContent = task.name;
    select.appendChild(option);
  });
  container.appendChild(select);

  const input = document.createElement("input");
  input.id = "tarea-personalizada";
  input.type = "text";
  input.placeholder = "Describe tu tarea...";
  input.style.display = "none";
  input.classList.add("input-tarea");
  container.appendChild(input);

  select.addEventListener("change", () => {
    input.style.display = select.value === "Otra..." ? "block" : "none";
  });
}

function getSelectedTask() {
  const select = document.getElementById("tarea-select");
  const input = document.getElementById("tarea-personalizada");
  if (!select) return "Sin tarea";
  return select.value === "Otra..." ? (input.value.trim() || "Tarea personalizada") : select.value || "Sin tarea";
}

function checkEntries() {
  const work = parseInt(workInput.value);
  const rest = parseInt(breakInput.value);
  const task = getSelectedTask();

  if (isNaN(work) || work <= 0 || isNaN(rest) || rest <= 0 || !task) {
    Swal.fire({
      icon: "error",
      title: "Datos inválidos",
      text: "Completa todos los campos correctamente."
    });
    return false;
  }
  return true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!checkEntries()) return;

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
  const task = getSelectedTask();
  statusDisplay.textContent = isWorkTime ? `Estado: Enfocado en ${task}` : `Estado: Descanso ☕`;

    if (isWorkTime) {
    document.getElementById("sound-work-start").play();
    statusDisplay.textContent = `Estado: Enfocado en ${task}`;
  } else {
    document.getElementById("sound-break-start").play();
    statusDisplay.textContent = `Estado: Descanso ☕`;
  }

  intervalId = setInterval(() => {
    currentTime--;
    updateDisplay(currentTime);

    const total = isWorkTime ? workMinutes * 60 : breakMinutes * 60;
    const progress = ((total - currentTime) / total) * 100;
    setProgress(progress);

    if (currentTime <= 0) {
      clearInterval(intervalId);
            document.getElementById("sound-end").play();

      saveSession(task, isWorkTime ? "work" : "break", total);
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

function saveSession(tarea, tipo, duracion) {
  try {
    const newSession = {
      tarea: tarea,
      type: tipo,
      duration: duracion,
      timestamp: new Date().toISOString()
    };
    sessionHistory.push(newSession);
    localStorage.setItem("sessionHistory", JSON.stringify(sessionHistory));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al guardar",
      text: "No se pudo guardar la sesión. Intenta nuevamente."
    });
  }
}

viewButton.addEventListener("click", () => {
  historyList.innerHTML = "";
  if (sessionHistory.length === 0) {
    historyList.innerHTML = "<li>No hay sesiones registradas.</li>";
    return;
  }
  sessionHistory.forEach((session, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${session.tarea || "Sin tarea"} - ${session.type === "work" ? "Trabajo" : "Descanso"} - ${session.duration / 60} min - ${new Date(session.timestamp).toLocaleString()}`;
    historyList.appendChild(li);
  });
});

clearButton.addEventListener("click", () => {
  sessionHistory = [];
  try {
    localStorage.setItem("sessionHistory", JSON.stringify(sessionHistory));
    historyList.innerHTML = "<li>Historial borrado.</li>";
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al borrar",
      text: "No se pudo borrar el historial."
    });
  }
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

document.getElementById("toggle-info").addEventListener("click", () => {
  Swal.fire({
    title: "¿Cómo funciona el método Pomodoro? 🍅",
    html: `
      <ol style="text-align:left;">
        <li>✅ Escoge una tarea de la lista o crea la tuya.</li>
        <li>⏱ Trabaja durante <strong>25 minutos</strong>.</li>
        <li>☕ Tómate <strong>5 minutos de descanso</strong>.</li>
        <li>🌿 Cada 4 pomodoros, toma un descanso más largo (15–30 min).</li>
       
      </ol>
    `,
    icon: "info",
    confirmButtonText: "¡Entendido!"
  });
});

fetchTasks();