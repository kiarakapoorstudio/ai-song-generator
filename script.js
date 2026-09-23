const promptInput = document.getElementById("prompt");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");
const charCount = document.getElementById("charCount");


// =========================
// CHARACTER COUNTER
// =========================

if (promptInput && charCount) {
  promptInput.addEventListener("input", () => {
    const length = promptInput.value.length;

    charCount.textContent = `${length} characters`;
  });
}


// =========================
// GENERATE SONG
// =========================

function generateSong() {

  const prompt = promptInput.value.trim();

  if (!prompt) {
    alert("Please describe your song first.");
    promptInput.focus();
    return;
  }

  const duration =
    document.getElementById("duration").value;

  const genre =
    document.getElementById("genre").value;

  const language =
    document.getElementById("language").value;

  const vocals =
    document.getElementById("vocals").value;

  const moodElement =
    document.getElementById("mood");

  const mood =
    moodElement ? moodElement.value : "Emotional";


  // Show result section
  result.classList.add("show");


  // Display current selections
  resultText.textContent =
    `${duration} • ${genre} • ${language} • ${vocals} • ${mood}`;


  // Scroll to result
  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// =========================
// ENTER KEY SUPPORT
// =========================

if (promptInput) {

  promptInput.addEventListener("keydown", (event) => {

    // Ctrl + Enter generates the song
    if (event.ctrlKey && event.key === "Enter") {

      generateSong();

    }

  });

}


// =========================
// NAVIGATION
// =========================

document.querySelectorAll("a[href^='#']").forEach(link => {

  link.addEventListener("click", (event) => {

    const targetId =
      link.getAttribute("href");

    if (targetId === "#") {
      return;
    }

    const target =
      document.querySelector(targetId);

    if (target) {

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });

    }

  });

});
