const pomodoroCount = () => {
  while (true) {
    let input = prompt("Cuantos ciclos de pomodoro quieres hacer?");
    if (input === null) {
        alert("🚪 Saliste del simulador. ¡Nos vemos pronto!");
        return null;
      }
    let amount = parseInt(input);
    if (!isNaN(amount) && amount > 0) {
      return amount;
    } else {
      alert("Por favor introduce un número mayor a 0");
    }
  }
};

const startPomodoro = (amount) => {
  for (let i = 1; i <= amount; i++) {
    alert(`🔔 Pomodoro ${i} iniciado. ¡Concéntrate durante 25 minutos!`);
    console.log(`Pomodoro ${i}: 25 minutos de enfoque.`);

    alert("🕒 ¡Tiempo de descanso! Tómate 5 minutos para relajarte.");
    console.log("Descanso: 5 minutos.");
  }
  alert("🎉 ¡Completaste todos tus ciclos Pomodoro! ¡Buen trabajo!");
  console.log("Todos los ciclos han finalizado.");
};

const pomodoroAmount = pomodoroCount();
startPomodoro(pomodoroAmount);
