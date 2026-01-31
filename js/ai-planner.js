let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let subjects = ["Math", "Science", "History", "English", "Geography", "Physics", "Chemistry"];
let currentTaskIndex = 0;
let studyStartTime = 19; // 7 PM in 24-hour format
let studyEndTime = 21; // 9 PM

function updateClock() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').innerText = `Current Time: ${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput.value.trim()) {
        tasks.push(taskInput.value.trim());
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        alert("Task added!");
    }
}

function generateSchedule() {
    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = '';
    const times = ["7:00 PM", "8:00 PM", "8:30 PM", "9:00 PM"];
    const studySlots = ["Study Session 1", "Break Time", "Study Session 2", "Review or Light Reading"];
    
    times.forEach((time, i) => {
        let task = tasks[i] || studySlots[i];
        let block = `<div class='time-block'><strong>${time}</strong> <span>${task}</span></div>`;
        scheduleDiv.innerHTML += block;
    });
}

function startSchedule() {
    let now = new Date();
    let currentHour = now.getHours();
    if (currentHour < studyStartTime || currentHour >= studyEndTime) {
        alert("It's not study time! Your schedule starts at 7 PM.");
        return;
    }
    executeTask();
}

function executeTask() {
    if (currentTaskIndex >= tasks.length) {
        alert("All tasks completed!");
        return;
    }
    let task = tasks[currentTaskIndex];
    alert(`Starting: ${task}`);
    speakReminder(`Starting task: ${task}`);
    setTimeout(() => {
        alert(`Task completed: ${task}`);
        currentTaskIndex++;
        executeTask();
    }, 300000); // 5 minutes per task
}

function suggestStudySubject() {
    let randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    alert(`AI Suggests: Focus on ${randomSubject} today!`);
}

function speakReminder(message) {
    let speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}