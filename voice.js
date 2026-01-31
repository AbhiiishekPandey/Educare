// Initialize Bootstrap modal
const voiceAssistantModal = new bootstrap.Modal(document.getElementById('voiceAssistantModal'));

// Get DOM elements
const speechButton = document.getElementById("speechButton");
const speakButton = document.getElementById("speakButton");
const output = document.getElementById("output");
const editableOutput = document.getElementById("editableOutput");
const statusMessage = document.getElementById("statusMessage");
const speechToTextBtn = document.getElementById("speechToTextBtn");
const textToSpeechBtn = document.getElementById("textToSpeechBtn");

// Initialize Speech Recognition with better browser compatibility
let recognition = null;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function initializeSpeechRecognition() {
    if (SpeechRecognition) {
        try {
            recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.interimResults = true; // Enable interim results for better feedback

            recognition.onstart = function() {
                speechButton.classList.add('recording');
                statusMessage.textContent = "Listening...";
                statusMessage.style.color = "#ffc107";
                speechButton.innerHTML = '<i class="fas fa-stop"></i>';
            };

            recognition.onend = function() {
                speechButton.classList.remove('recording');
                speechButton.innerHTML = '<i class="fas fa-microphone"></i>';
                statusMessage.textContent = "Speech recognition ended";
                statusMessage.style.color = "#6c757d";
            };

            recognition.onresult = function(event) {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Update the output with interim results while speaking
                if (interimTranscript) {
                    output.value = interimTranscript;
                }
                
                // Update both outputs with final transcript when done
                if (finalTranscript) {
                    output.value = finalTranscript;
                    editableOutput.value = finalTranscript;
                    statusMessage.textContent = "Speech recorded successfully!";
                    statusMessage.style.color = "#198754";
                }
            };

            recognition.onerror = function(event) {
                let errorMessage = "An error occurred: ";
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = "No speech was detected. Please try again.";
                        break;
                    case 'aborted':
                        errorMessage = "Speech recognition was aborted.";
                        break;
                    case 'audio-capture':
                        errorMessage = "No microphone was found. Please check your microphone.";
                        break;
                    case 'network':
                        errorMessage = "Network error occurred. Please check your connection.";
                        break;
                    case 'not-allowed':
                        errorMessage = "Microphone access was denied. Please allow microphone access.";
                        break;
                    case 'service-not-available':
                        errorMessage = "Speech recognition service is not available.";
                        break;
                    default:
                        errorMessage += event.error;
                }
                statusMessage.textContent = errorMessage;
                statusMessage.classList.add("error");
                speechButton.classList.remove('recording');
                speechButton.innerHTML = '<i class="fas fa-microphone"></i>';
            };

            // Add click handler for speech button
            speechButton.addEventListener("click", function() {
                if (recognition) {
                    if (recognition.state === 'recording') {
                        recognition.stop();
                    } else {
                        try {
                            recognition.start();
                        } catch (error) {
                            statusMessage.textContent = "Error starting speech recognition: " + error.message;
                            statusMessage.classList.add("error");
                        }
                    }
                }
            });

        } catch (error) {
            statusMessage.textContent = "Error initializing speech recognition: " + error.message;
            statusMessage.classList.add("error");
        }
    } else {
        statusMessage.textContent = "Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.";
        statusMessage.classList.add("error");
        speechButton.disabled = true;
    }
}

// Initialize speech recognition when the page loads
document.addEventListener('DOMContentLoaded', initializeSpeechRecognition);

// Text to Speech functionality
speakButton.addEventListener("click", function() {
    const text = editableOutput.value;
    if (text.trim() !== "") {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1.0;
        speech.pitch = 1.0;
        speech.volume = 1.0;
        
        speech.onstart = function() {
            statusMessage.textContent = "Speaking...";
            statusMessage.style.color = "#0d6efd";
        };
        
        speech.onend = function() {
            statusMessage.textContent = "Speech completed";
            statusMessage.style.color = "#6c757d";
        };
        
        speech.onerror = function(event) {
            statusMessage.textContent = "Error in speech synthesis: " + event.error;
            statusMessage.classList.add("error");
        };
        
        window.speechSynthesis.speak(speech);
    }
});

// Navbar button handlers
speechToTextBtn.addEventListener("click", function(e) {
    e.preventDefault();
    voiceAssistantModal.show();
    editableOutput.value = ""; // Clear previous text
    output.value = ""; // Clear previous text
    statusMessage.textContent = "Click the microphone to start speaking";
    statusMessage.style.color = "#6c757d";
    statusMessage.classList.remove("error");
});

textToSpeechBtn.addEventListener("click", function(e) {
    e.preventDefault();
    voiceAssistantModal.show();
    editableOutput.value = ""; // Clear previous text
    output.value = ""; // Clear previous text
    statusMessage.textContent = "Type or paste text to convert to speech";
    statusMessage.style.color = "#6c757d";
    statusMessage.classList.remove("error");
});

// Handle modal close
document.getElementById('voiceAssistantModal').addEventListener('hidden.bs.modal', function () {
    // Stop any ongoing speech synthesis
    window.speechSynthesis.cancel();
    // Stop any ongoing speech recognition
    if (recognition && recognition.state === 'recording') {
        recognition.stop();
    }
    // Reset status message
    statusMessage.textContent = "";
    statusMessage.classList.remove("error");
    // Reset button state
    speechButton.classList.remove('recording');
    speechButton.innerHTML = '<i class="fas fa-microphone"></i>';
});

// Add Smart Home Assistant button handler
const smartHomeBtn = document.getElementById("smartHomeBtn");
const smartHomeModal = new bootstrap.Modal(document.getElementById('smartHomeModal'));

smartHomeBtn.addEventListener("click", function(e) {
    e.preventDefault();
    smartHomeModal.show();
    initializeSmartHome();
});

function initializeSmartHome() {
    updateClock();
    generateSchedule();
    // Reset any existing tasks
    currentTaskIndex = 0;
}

// Add Smart Home functionality
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let subjects = ["Math", "Science", "History", "English", "Geography", "Physics", "Chemistry"];
let currentTaskIndex = 0;
let studyStartTime = 19; // 7 PM
let studyEndTime = 21; // 9 PM

function updateClock() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').innerText = `Current Time: ${hours}:${minutes}:${seconds}`;
}

// Add Smart Home Assistant functionality
function openSmartHomeAssistant() {
    const modalContent = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">📅 AfterSchool AI Planner</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <p>Smart study planner for students (Grades 5-10)</p>
                        
                        <div id="clock"></div>
                        
                        <div class="input-group mb-3">
                            <input type="text" id="taskInput" class="form-control" placeholder="Enter your task">
                            <button class="btn btn-primary" onclick="addTask()">Add Task</button>
                        </div>
                        
                        <h5 class="mb-3">Your AI-Generated Schedule (7PM - 9PM)</h5>
                        <div id="schedule"></div>
                        <div class="btn-group mt-3">
                            <button class="btn btn-primary" onclick="generateSchedule()">✨ Generate Smart Schedule</button>
                            <button class="btn btn-success" onclick="startSchedule()">▶ Start Schedule</button>
                            <button class="btn btn-info" onclick="suggestStudySubject()">🧠 AI Suggests Subject</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const smartHomeModal = document.createElement('div');
    smartHomeModal.className = 'modal fade';
    smartHomeModal.id = 'smartHomeModal';
    smartHomeModal.innerHTML = modalContent;
    document.body.appendChild(smartHomeModal);

    const modal = new bootstrap.Modal(smartHomeModal);
    modal.show();

    // Initialize clock and schedule
    updateClock();
    setInterval(updateClock, 1000);
    generateSchedule();
}

// Add this to your service section HTML
const serviceSection = `
<div class="service-box smart-home-service" onclick="openSmartHomeAssistant()">
    <div class="service-icon">
        <i class="fas fa-robot"></i>
    </div>
    <h3>Smart Home Assistant</h3>
    <p>Your personal AI study companion that helps you manage your learning schedule, set reminders, and get instant answers to your questions.</p>
</div>
`;

// Add event listener when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler for the service box
    const smartHomeService = document.querySelector('.smart-home-service');
    if (smartHomeService) {
        smartHomeService.addEventListener('click', openSmartHomeAssistant);
    }
});