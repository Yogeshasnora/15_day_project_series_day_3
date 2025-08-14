const sentences = [
  "I am a dreamer. I know so little of real life that I just can’t help re-living such moments",

  "May your sky always be clear, may your dear smile always be bright and happy\nand may you be for ever blessed for that moment of bliss and happiness.",

  "It was a marvelous night, the sort of night one only experiences when one is young\nthe sky was so bright, and there were so many stars that one couldn't help wondering…",

  "Pain and suffering are always inevitable for a large intelligence and a deep heart\n the really great men must, I think, have great sadness on earth." ,

  "To go wrong in one's own way is better than to go right in someone else's\nIn the first case you are a man, in the second you are no better than a bird." ,

  "Taking a new step, uttering a new word, is what people fear most\nYet it is by such steps that transformation begins." ,

  "A man who lies to himself and listens to his own lie comes to a point\nwhere he does not discern any truth either in himself or anywhere around him.",

  "Man only likes to count his troubles; he doesn’t calculate his happiness\nYet within that neglect lies the seed of redemption." ,

  "A strange affinity with unknown people is always an invitation to chaos…\nTo the cosmos. To passion." ,

  "Some say that I will still have a lot of time to sleep after death\nbut who said that I am not living while I dream?" ,
]



let currentSentence = "";
let startTime;
let timerInterval;
let playerName = "";
let typedChars = 0;

const sentenceEl = document.getElementById("sentence");
const inputEl = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");
const leaderboardList = document.getElementById("leaderboardList");

function askName() {
    playerName = prompt("Enter your name for the leaderboard:") || "Anonymous";
}

function renderSentence() {
    sentenceEl.innerHTML = "";
    currentSentence.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        sentenceEl.appendChild(span);
    });
}

function newSentence() {
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    renderSentence();
    inputEl.value = "";
    typedChars = 0;
    startTime = null;
    clearInterval(timerInterval);
    timeEl.textContent = "0";
}

inputEl.addEventListener("input", () => {
    const typedText = inputEl.value;
    typedChars++;

    if (!startTime) {
        startTime = new Date();
        timerInterval = setInterval(updateTime, 1000);
    }

    const sentenceSpans = sentenceEl.querySelectorAll("span");
    sentenceSpans.forEach((span, index) => {
        const typedChar = typedText[index];
        if (typedChar == null) {
            span.classList.remove("correct", "wrong", "current");
        } else if (typedChar === currentSentence[index]) {
            span.classList.add("correct");
            span.classList.remove("wrong");
        } else {
            span.classList.add("wrong");
            span.classList.remove("correct");
        }
    });

    // highlight current letter
    if (typedText.length < sentenceSpans.length) {
        sentenceSpans[typedText.length].classList.add("current");
    }

    if (typedText === currentSentence) {
        clearInterval(timerInterval);
        updateStats();
        saveScore();
        loadLeaderboard();
        newSentence();
    } else {
        updateStats();
    }
});

function updateStats() {
    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    const words = inputEl.value.trim().split(/\s+/).filter(Boolean).length;
    const wpm = Math.round(words / elapsedTime) || 0;
    const correctChars = inputEl.value.split("").filter((ch, i) => ch === currentSentence[i]).length;
    const accuracy = Math.round((correctChars / currentSentence.length) * 100) || 0;
    wpmEl.textContent = wpm;
    accuracyEl.textContent = accuracy;
}

function updateTime() {
    timeEl.textContent = Math.floor((new Date() - startTime) / 1000);
}

function restartTest() {
    newSentence();
}

function saveScore() {
    const score = {
        name: playerName,
        wpm: parseInt(wpmEl.textContent),
        accuracy: parseInt(accuracyEl.textContent),
        date: new Date().toLocaleString()
    };
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push(score);
    leaderboard.sort((a, b) => b.wpm - a.wpm);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function loadLeaderboard() {
    leaderboardList.innerHTML = "";
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.forEach(score => {
        const li = document.createElement("li");
        li.textContent = `${score.name} - ${score.wpm} WPM | ${score.accuracy}% | ${score.date}`;
        leaderboardList.appendChild(li);
    });
}

function updateClock() {
    const now = new Date();
    document.getElementById("clock").textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);

askName();
newSentence();
loadLeaderboard();
