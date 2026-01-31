// Function to handle PDF upload
async function handlePDFUpload(event) {
    const file = event.target.files[0];
    const pdfStatus = document.getElementById("pdfStatus");
    const inputText = document.getElementById("inputText");

    if (!file) {
        pdfStatus.textContent = "No file selected.";
        return;
    }

    if (file.type !== "application/pdf") {
        pdfStatus.textContent = "Please upload a valid PDF file.";
        return;
    }

    pdfStatus.textContent = "Processing PDF...";

    try {
        const pdfText = await extractTextFromPDF(file);
        inputText.value = pdfText;
        updateWordCount();
        pdfStatus.textContent = "PDF content loaded successfully!";
    } catch (error) {
        console.error("Error processing PDF:", error);
        pdfStatus.textContent = "Failed to process PDF. Please try again.";
    }
}

// Function to extract text from a PDF file using PDF.js
async function extractTextFromPDF(file) {
    const pdfjsLib = window["pdfjs-dist/build/pdf"];
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        text += pageText + "\n";
    }

    return text.trim();
}

// Function to update the word count
function updateWordCount() {
    const text = document.getElementById("inputText").value.trim();
    const wordCount = text === "" ? 0 : text.split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById("wordCount").textContent = wordCount;
    document.getElementById("summarizeBtn").disabled = wordCount < 5;
}

// Function to summarize text
function summarizeText() {
    const inputText = document.getElementById("inputText").value.trim();
    const summaryBox = document.getElementById("summary");
    const summarizeBtn = document.getElementById("summarizeBtn");

    if (!inputText || inputText.split(/\s+/).length < 5) {
        summaryBox.style.display = "block";
        summaryBox.innerHTML = "<h3>Error</h3><p>Please enter at least 5 words to summarize.</p>";
        return;
    }

    // Show loading state
    summarizeBtn.disabled = true;
    summarizeBtn.innerHTML = '<span class="loading"></span> Summarizing...';
    summaryBox.style.display = "block";
    summaryBox.innerHTML = "<h3>Processing</h3><p>Analyzing your content...</p>";

    // Process the text with a better algorithm
    setTimeout(() => {
                try {
                    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
                    const words = inputText.split(/\s+/).filter(w => w.length > 0);

                    let summary = "";

                    if (sentences.length <= 2) {
                        summary = sentences.join(". ") + ".";
                    } else if (sentences.length <= 5) {
                        summary = sentences[0] + ". " + sentences[sentences.length - 1] + ".";
                    } else {
                        const middleIndex = Math.floor(sentences.length / 2);
                        summary = sentences[0] + ". " + sentences[middleIndex] + ". " + sentences[sentences.length - 1] + ".";
                    }

                    // Extract main points (e.g., key sentences or phrases)
                    const mainPoints = extractMainPoints(inputText);

                    summaryBox.innerHTML = `
                <h3>Summary</h3>
                <textarea id="summaryText" style="width: 100%; height: 100px;">${summary}</textarea>
                <p><strong>Reduction:</strong> ${words.length} words → ${summary.split(/\s+/).length} words</p>
                <h3>Main Points</h3>
                <ul>
                    ${mainPoints.map(point => `<li>${point}</li>`).join("")}
                </ul>
                <button id="listenBtn" onclick="listenToSummary()">Listen</button>
                <button id="cancelListenBtn" onclick="cancelListening()">Cancel Listening</button>
            `;
        } catch (error) {
            summaryBox.innerHTML = `
                <h3>Error</h3>
                <p>Could not generate summary. Please try again.</p>
            `;
            console.error("Summarization error:", error);
        }

        summarizeBtn.disabled = false;
        summarizeBtn.innerHTML = "Summarize";
    }, 1500);
}

// Function to extract main points
function extractMainPoints(text) {
    const stopWords = [
        "the", "is", "in", "and", "to", "of", "a", "that", "it", "on", "for", "with", "as", "was", "at", "by", "an", "be", "this", "which"
    ];

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceScores = [];

    sentences.forEach(sentence => {
        const words = sentence
            .toLowerCase()
            .split(/\s+/)
            .filter(w => w.length > 3 && !stopWords.includes(w)); // Filter out short words and stop words

        const score = words.length; // Score based on the number of meaningful words
        sentenceScores.push({ sentence: sentence.trim(), score });
    });

    // Sort sentences by score in descending order and return the top 5
    const topSentences = sentenceScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(item => item.sentence);

    return topSentences;
}

// Function to listen to the summary
function listenToSummary() {
    const summaryText = document.getElementById("summaryText").value;
    const speech = new SpeechSynthesisUtterance(summaryText);
    speech.lang = "en-US";
    speech.rate = 1; // Adjust the rate if needed
    window.speechSynthesis.speak(speech);
}

// Function to cancel listening
function cancelListening() {
    window.speechSynthesis.cancel();
}
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js"></script>