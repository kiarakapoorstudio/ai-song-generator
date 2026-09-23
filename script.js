let user = JSON.parse(
  localStorage.getItem("sonaraUser")
) || null;


// =========================================
// DEFAULT CREDITS
// =========================================

const DEFAULT_CREDITS = 60;


// =========================================
// GET CREDITS
// =========================================

function getCredits() {

  if (!user) {
    return DEFAULT_CREDITS;
  }

  return Number(user.credits);

}


// =========================================
// SAVE USER
// =========================================

function saveUser() {

  localStorage.setItem(
    "sonaraUser",
    JSON.stringify(user)
  );

}


// =========================================
// UPDATE HEADER
// =========================================

function updateHeader() {

  const creditsAmount =
    document.getElementById("creditsAmount");

  const accountButton =
    document.getElementById("accountButton");

  const generationCredits =
    document.getElementById("generationCredits");


  if (creditsAmount) {

    creditsAmount.textContent =
      getCredits();

  }


  if (generationCredits) {

    generationCredits.textContent =
      getCredits();

  }


  if (accountButton) {

    if (user) {

      accountButton.textContent =
        user.name || "Account";

      accountButton.onclick =
        logoutUser;

    } else {

      accountButton.textContent =
        "Sign In";

      accountButton.onclick =
        openAuthModal;

    }

  }

}


// =========================================
// CHARACTER COUNTER
// =========================================

const promptInput =
  document.getElementById("prompt");

const charCount =
  document.getElementById("charCount");


if (promptInput && charCount) {

  promptInput.addEventListener(
    "input",
    () => {

      charCount.textContent =
        `${promptInput.value.length} characters`;

    }
  );

}


// =========================================
// AUTH MODAL
// =========================================

function openAuthModal() {

  const modal =
    document.getElementById("authModal");

  modal.classList.add("show");

  document.body.classList.add("modal-open");

}


function closeAuthModal() {

  const modal =
    document.getElementById("authModal");

  modal.classList.remove("show");

  document.body.classList.remove("modal-open");

}


// =========================================
// AUTH TABS
// =========================================

function switchAuth(type) {

  const loginForm =
    document.getElementById("loginForm");

  const signupForm =
    document.getElementById("signupForm");

  const loginTab =
    document.getElementById("loginTab");

  const signupTab =
    document.getElementById("signupTab");


  if (type === "login") {

    loginForm.classList.remove("hidden");

    signupForm.classList.add("hidden");

    loginTab.classList.add("active");

    signupTab.classList.remove("active");

  } else {

    loginForm.classList.add("hidden");

    signupForm.classList.remove("hidden");

    loginTab.classList.remove("active");

    signupTab.classList.add("active");

  }

}


// =========================================
// SIGN UP
// =========================================

function handleSignup(event) {

  event.preventDefault();


  const name =
    document.getElementById("signupName").value.trim();

  const email =
    document.getElementById("signupEmail").value.trim();

  const password =
    document.getElementById("signupPassword").value;


  if (!name || !email || !password) {
    return;
  }


  /*
    FRONTEND DEMO ONLY

    Real authentication will be connected
    to a backend later.
  */

  user = {

    name: name,

    email: email,

    credits: DEFAULT_CREDITS

  };


  saveUser();

  updateHeader();

  closeAuthModal();


  alert(
    `Welcome to SONARA, ${name}! You received 60 free credits.`
  );

}


// =========================================
// LOGIN
// =========================================

function handleLogin(event) {

  event.preventDefault();


  const email =
    document.getElementById("loginEmail").value.trim();


  if (!email) {
    return;
  }


  /*
    FRONTEND DEMO LOGIN

    Real authentication will be added later.
  */


  const storedUser =
    JSON.parse(
      localStorage.getItem("sonaraUser")
    );


  if (storedUser) {

    user = storedUser;

  } else {

    user = {

      name: email.split("@")[0],

      email: email,

      credits: DEFAULT_CREDITS

    };

  }


  saveUser();

  updateHeader();

  closeAuthModal();


  alert(
    "Welcome back to SONARA!"
  );

}


// =========================================
// LOGOUT
// =========================================

function logoutUser() {

  const confirmLogout =
    confirm("Do you want to log out?");


  if (!confirmLogout) {
    return;
  }


  user = null;

  localStorage.removeItem(
    "sonaraUser"
  );

  updateHeader();

}


// =========================================
// CREDIT COST
// =========================================

function getSongCost() {

  const duration =
    Number(
      document.getElementById("duration").value
    );


  return duration * 10;

}


// =========================================
// GENERATE SONG
// =========================================

function generateSong() {

  const prompt =
    document.getElementById("prompt").value.trim();


  if (!prompt) {

    alert(
      "Please describe your song first."
    );

    document.getElementById("prompt").focus();

    return;

  }


  // Login required

  if (!user) {

    openAuthModal();

    return;

  }


  const duration =
    Number(
      document.getElementById("duration").value
    );


  const cost =
    duration * 10;


  const currentCredits =
    getCredits();


  // Not enough credits

  if (currentCredits < cost) {

    alert(
      `You need ${cost} credits, but you only have ${currentCredits}.`
    );

    return;

  }


  // Deduct credits

  user.credits =
    currentCredits - cost;


  saveUser();

  updateHeader();


  // Open generation page

  openGenerationPage();

}


// =========================================
// OPEN GENERATION PAGE
// =========================================

function openGenerationPage() {

  const page =
    document.getElementById("generationPage");


  const durationValue =
    Number(
      document.getElementById("duration").value
    );


  const durationText =
    `${durationValue} minute${durationValue > 1 ? "s" : ""}`;


  const genre =
    document.getElementById("genre").value;


  const language =
    document.getElementById("language").value;


  const vocals =
    document.getElementById("vocals").value;


  document.getElementById(
    "generationDuration"
  ).textContent = durationText;


  document.getElementById(
    "generationGenre"
  ).textContent = genre;


  document.getElementById(
    "generationLanguage"
  ).textContent = language;


  document.getElementById(
    "generationVocals"
  ).textContent = vocals;


  document.getElementById(
    "generationCredits"
  ).textContent = getCredits();


  page.classList.add("show");

  document.body.classList.add(
    "generation-open"
  );


  startGenerationAnimation();

}


// =========================================
// GENERATION ANIMATION
// =========================================

function startGenerationAnimation() {

  const progressBar =
    document.getElementById("progressBar");

  const progressPercent =
    document.getElementById("progressPercent");

  const description =
    document.getElementById(
      "generationDescription"
    );


  let progress = 0;


  progressBar.style.width = "0%";

  progressPercent.textContent = "0";


  description.textContent =
    "Preparing your song idea...";


  const messages = [

    "Preparing your song idea...",

    "Creating the musical structure...",

    "Building instruments and rhythm...",

    "Preparing vocal arrangement...",

    "Mixing your track...",

    "Finalizing your song..."

  ];


  const interval =
    setInterval(() => {

      progress += 1;


      progressBar.style.width =
        `${progress}%`;


      progressPercent.textContent =
        progress;


      const messageIndex =
        Math.min(
          Math.floor(progress / 17),
          messages.length - 1
        );


      description.textContent =
        messages[messageIndex];


      if (progress >= 100) {

        clearInterval(interval);

        finishGeneration();

      }

    }, 120);

}


// =========================================
// GENERATION FINISHED
// =========================================

function finishGeneration() {

  const title =
    document.getElementById(
      "generationTitle"
    );

  const description =
    document.getElementById(
      "generationDescription"
    );


  title.textContent =
    "Your song is ready";


  description.textContent =
    "Your AI-generated track will appear here once the music engine is connected.";


  /*
    The real audio player will be added
    when we connect the AI music backend.
  */

}


// =========================================
// CLOSE GENERATION PAGE
// =========================================

function closeGenerationPage() {

  const page =
    document.getElementById(
      "generationPage"
    );


  page.classList.remove("show");

  document.body.classList.remove(
    "generation-open"
  );

}


// =========================================
// CLOSE MODAL BY CLICKING OUTSIDE
// =========================================

document.addEventListener(
  "click",
  (event) => {

    const modal =
      document.getElementById(
        "authModal"
      );


    if (
      event.target === modal
    ) {

      closeAuthModal();

    }

  }
);


// =========================================
// ESC KEY
// =========================================

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {

      closeAuthModal();

      closeGenerationPage();

    }

  }
);


// =========================================
// INITIALIZE
// =========================================

updateHeader();
```
