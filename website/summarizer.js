// Initialize Bootstrap modal
const summarizationModal = new bootstrap.Modal(document.getElementById('summarizationModal'));

// Get DOM elements
const inputText = document.getElementById('inputText');
const summaryOutput = document.getElementById('summaryOutput');
const summarizeBtn = document.getElementById('summarizeBtn');
const copySummaryBtn = document.getElementById('copySummaryBtn');
const autoSummarize = document.getElementById('autoSummarize');
const summarizationProgress = document.getElementById('summarizationProgress');
const summarizationStatus = document.getElementById('summarizationStatus');

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to update progress bar
function updateProgress(progress) {
    const progressBar = summarizationProgress.querySelector('.progress-bar');
    progressBar.style.width = `${progress}%`;
}

// Function to show status message
function showStatus(message, isError = false) {
    summarizationStatus.textContent = message;
    summarizationStatus.className = `small ${isError ? 'text-danger' : 'text-muted'}`;
}

// Function to clean and normalize text
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n+/g, ' ') // Replace newlines with space
        .trim();
}

// Function to extract important sentences
function extractImportantSentences(text) {
    // Split text into sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    // Common words to filter out
    const commonWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at']);
    
    // Score each sentence based on various factors
    const scoredSentences = sentences.map(sentence => {
        const words = sentence.toLowerCase().split(/\s+/);
        const wordCount = words.length;
        const uniqueWords = new Set(words.filter(w => !commonWords.has(w)));
        const uniqueWordCount = uniqueWords.size;
        
        // Calculate score based on:
        // 1. Number of unique words (non-common words)
        // 2. Sentence length (prefer medium-length sentences)
        // 3. Presence of important words
        const score = (uniqueWordCount * 2) + 
                     (wordCount > 5 && wordCount < 20 ? 3 : 0) +
                     (sentence.includes('important') || sentence.includes('key') || sentence.includes('main') ? 2 : 0);
        
        return { sentence: sentence.trim(), score };
    });

    // Sort by score and get top sentences
    return scoredSentences
        .sort((a, b) => b.score - a.score)
        .map(s => s.sentence);
}

// Function to create a concise summary
function createSummary(text) {
    // Clean the input text
    const cleanInput = cleanText(text);
    
    // Get important sentences
    const importantSentences = extractImportantSentences(cleanInput);
    
    // Calculate how many sentences to include (30% of original)
    const numSentences = Math.max(3, Math.min(5, Math.ceil(importantSentences.length * 0.3)));
    
    // Take top sentences
    const selectedSentences = importantSentences.slice(0, numSentences);
    
    // Create a coherent summary
    let summary = selectedSentences.join('. ');
    
    // Add ellipsis if we're not including all sentences
    if (selectedSentences.length < importantSentences.length) {
        summary += '...';
    }
    
    return summary;
}

// Function to summarize text
async function summarizeText(text) {
    if (!text.trim()) {
        showStatus('Please enter some text to summarize', true);
        return;
    }

    try {
        // Show progress bar
        summarizationProgress.classList.remove('d-none');
        updateProgress(0);
        showStatus('Analyzing text...');

        // Simulate progress (replace with actual API call)
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 200));
            updateProgress(i);
        }

        // Create summary
        const summary = createSummary(text);
        
        // Update output
        summaryOutput.value = summary;

        showStatus('Summary created successfully!');
    } catch (error) {
        showStatus('Error generating summary: ' + error.message, true);
    } finally {
        // Hide progress bar after a short delay
        setTimeout(() => {
            summarizationProgress.classList.add('d-none');
        }, 500);
    }
}

// Event Listeners
summarizeBtn.addEventListener('click', () => {
    summarizeText(inputText.value);
});

copySummaryBtn.addEventListener('click', () => {
    if (summaryOutput.value) {
        navigator.clipboard.writeText(summaryOutput.value)
            .then(() => showStatus('Summary copied to clipboard!'))
            .catch(() => showStatus('Failed to copy summary', true));
    }
});

// Auto-summarize on input (with debounce)
const debouncedSummarize = debounce((text) => {
    if (autoSummarize.checked) {
        summarizeText(text);
    }
}, 1000);

inputText.addEventListener('input', (e) => {
    debouncedSummarize(e.target.value);
});

// Handle modal close
document.getElementById('summarizationModal').addEventListener('hidden.bs.modal', function () {
    // Reset the form
    inputText.value = '';
    summaryOutput.value = '';
    summarizationProgress.classList.add('d-none');
    showStatus('');
}); 