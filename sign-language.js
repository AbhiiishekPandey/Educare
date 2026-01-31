// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const gestureText = document.getElementById('gesture-text');
const meaningText = document.getElementById('meaning-text');

// MediaPipe Hands setup
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

hands.onResults(onResults);

// Gesture meanings with detailed descriptions
const gestureMeanings = {
    "Hello 👋": {
        text: "Hello",
        description: "A friendly greeting gesture"
    },
    "Thanks 🙏": {
        text: "Thank You",
        description: "A gesture of gratitude"
    },
    "Yes 👍": {
        text: "Yes",
        description: "A gesture of agreement"
    },
    "No 👎": {
        text: "No",
        description: "A gesture of disagreement"
    },
    "Love You 🤟": {
        text: "I Love You",
        description: "A gesture expressing love"
    },
    "Call Me 🤙": {
        text: "Call Me",
        description: "A gesture indicating to call"
    }
};

// Speech synthesis setup
let lastSpokenGesture = null;
const speech = new SpeechSynthesisUtterance();
speech.rate = 1.0;
speech.pitch = 1.0;
speech.volume = 1.0;

// Initialize camera
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            }
        });
        video.srcObject = stream;
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve(video);
            };
        });
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Could not access camera. Please check permissions.');
    }
}

// Handle MediaPipe results
function onResults(results) {
    if (!results.multiHandLandmarks) {
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw video frame
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    
    // Draw hand landmarks
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 2
            });
            drawLandmarks(ctx, landmarks, {
                color: '#FF0000',
                lineWidth: 1
            });
            
            // Recognize gesture
            const gesture = recognizeGesture(landmarks);
            updateDisplay(gesture);
        }
    }
}

// Recognize gesture from landmarks
function recognizeGesture(landmarks) {
    const fingers = [];
    const tipIds = [4, 8, 12, 16, 20];
    
    // Check finger states
    for (let i = 1; i < tipIds.length; i++) {
        if (landmarks[tipIds[i]].y < landmarks[tipIds[i] - 2].y) {
            fingers.push(1);
        } else {
            fingers.push(0);
        }
    }
    
    const thumbExtended = landmarks[4].x < landmarks[3].x;
    const thumbUp = landmarks[4].y < landmarks[3].y;
    
    // Hello gesture
    if (fingers.every(f => f === 1) && thumbExtended) {
        return "Hello 👋";
    }
    
    // Thanks gesture
    if (fingers.every(f => f === 1) && !thumbExtended) {
        return "Thanks 🙏";
    }
    
    // Yes gesture
    if (fingers.every(f => f === 0) && thumbUp) {
        return "Yes 👍";
    }
    
    // No gesture
    if (fingers[0] === 1 && fingers.slice(1).every(f => f === 0)) {
        return "No 👎";
    }
    
    // Love You gesture
    if (fingers[0] === 1 && fingers[3] === 1 && thumbExtended) {
        return "Love You 🤟";
    }
    
    // Call Me gesture
    if (fingers[3] === 1 && thumbExtended) {
        return "Call Me 🤙";
    }
    
    return "Unknown Gesture";
}

// Update display with recognized gesture
function updateDisplay(gesture) {
    gestureText.textContent = gesture;
    
    if (gestureMeanings[gesture]) {
        meaningText.textContent = gestureMeanings[gesture].text;
        
        // Speak the gesture meaning
        if (gesture !== lastSpokenGesture) {
            lastSpokenGesture = gesture;
            speech.text = gestureMeanings[gesture].text;
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
            window.speechSynthesis.speak(speech);
        }
    } else {
        meaningText.textContent = "-";
    }
}

// Main recognition loop
async function detectGestures() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        await hands.send({image: video});
    }
    
    if (isRunning) {
        requestAnimationFrame(detectGestures);
    }
}

// Control variables
let isRunning = false;

// Event Listeners
startBtn.addEventListener('click', async () => {
    if (!isRunning) {
        await setupCamera();
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        detectGestures();
    }
});

stopBtn.addEventListener('click', () => {
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    gestureText.textContent = "None";
    meaningText.textContent = "-";
    lastSpokenGesture = null;
    
    // Stop video stream
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
});

// Initialize
setupCamera(); 