let user = JSON.parse(localStorage.getItem("sonaraUser")) || null;

let generationTimer = null;


/* =========================================================
   DEFAULT USER
   ========================================================= */

function createUser(name, email) {
  return {
    name: name,
    email: email,
    credits: 60,
    songs: []
  };
}


/* =========================================================
   SAVE USER
   ========================================================= */

function saveUser() {
  if (user) {
    localStorage.setItem(
      "sonaraUser",
      JSON.stringify(user)
    );
  } else {
    localStorage.removeItem("sonaraUser");
  }
}


/* =========================================================
   GET CREDITS
   ========================================================= */

function getCredits() {
  if (!user) {
    return 60;
  }

  return Number(user.credits) || 0;
}


/* =========================================================
   UPDATE HEADER
   ========================================================= */

function updateHeader() {

  const creditsCount =
    document.getElementById("creditsCount");

  const accountButton =
    document.getElementById("accountButton");

  const generationCredits =
    document.getElementById("generationCredits");


  if (creditsCount) {
    creditsCount.textContent = getCredits();
  }


  if (generationCredits) {
    generationCredits.textContent = getCredits();
  }


  if (accountButton) {

    if (user) {

      accountButton.textContent =
        user.name
          ? user.name
          : "Account";

    } else {

      accountButton.textContent =
        "Sign In";

    }

  }

}


/* =========================================================
   CHARACTER COUNTER
   ========================================================= */

function updateCharacterCount() {

  const prompt =
    document.getElementById("prompt");

  const counter =
    document.getElementById("characterCounter");


  if (!prompt || !counter) {
    return;
  }


  const length =
    prompt.value.length;


  counter.textContent =
    `${length} / 1000`;

}


/* =========================================================
   SONG COST
   ========================================================= */

function getSongCost() {

  const duration =
    document.getElementById("duration");


  if (!duration) {
    return 10;
  }


  const minutes =
    Number(duration.value);


  return minutes * 10;

}


/* =========================================================
   UPDATE GENERATE COST
   ========================================================= */

function updateSongCost() {

  const cost =
    getSongCost();


  const generateCost =
    document.getElementById("generateCost");


  if (generateCost) {
    generateCost.textContent = cost;
  }

}


/* =========================================================
   AUTH MODAL
   ========================================================= */

function openAuthModal() {

  const modal =
    document.getElementById("authModal");


  if (!modal) {
    return;
  }


  modal.classList.add("active");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  showLoginForm();

}


function closeAuthModal() {

  const modal =
    document.getElementById("authModal");


  if (!modal) {
    return;
  }


  modal.classList.remove("active");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  clearAuthMessage();

}


/* =========================================================
   LOGIN FORM
   ========================================================= */

function showLoginForm() {

  const loginForm =
    document.getElementById("loginForm");

  const signupForm =
    document.getElementById("signupForm");

  const loginTab =
    document.getElementById("loginTab");

  const signupTab =
    document.getElementById("signupTab");

  const title =
    document.getElementById("authTitle");


  if (loginForm) {
    loginForm.style.display = "flex";
  }


  if (signupForm) {
    signupForm.style.display = "none";
  }


  if (loginTab) {
    loginTab.classList.add("active");
  }


  if (signupTab) {
    signupTab.classList.remove("active");
  }


  if (title) {
    title.textContent =
      "Welcome back";
  }


  clearAuthMessage();

}


/* =========================================================
   SIGNUP FORM
   ========================================================= */

function showSignupForm() {

  const loginForm =
    document.getElementById("loginForm");

  const signupForm =
    document.getElementById("signupForm");

  const loginTab =
    document.getElementById("loginTab");

  const signupTab =
    document.getElementById("signupTab");

  const title =
    document.getElementById("authTitle");


  if (loginForm) {
    loginForm.style.display = "none";
  }


  if (signupForm) {
    signupForm.style.display = "flex";
  }


  if (loginTab) {
    loginTab.classList.remove("active");
  }


  if (signupTab) {
    signupTab.classList.add("active");
  }


  if (title) {
    title.textContent =
      "Create your account";
  }


  clearAuthMessage();

}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(message, type = "") {

  const messageElement =
    document.getElementById("authMessage");


  if (!messageElement) {
    return;
  }


  messageElement.textContent =
    message;


  messageElement.className =
    "auth-message";


  if (type) {
    messageElement.classList.add(type);
  }

}


function clearAuthMessage() {

  const messageElement =
    document.getElementById("authMessage");


  if (!messageElement) {
    return;
  }


  messageElement.textContent = "";

  messageElement.className =
    "auth-message";

}


/* =========================================================
   SIGN UP
   ========================================================= */

function handleSignup(event) {

  event.preventDefault();


  const name =
    document.getElementById("signupName")
      ?.value
      .trim();


  const email =
    document.getElementById("signupEmail")
      ?.value
      .trim()
      .toLowerCase();


  const password =
    document.getElementById("signupPassword")
      ?.value;


  if (!name || !email || !password) {

    showAuthMessage(
      "Please fill in all fields.",
      "error"
    );

    return;
  }


  if (password.length < 6) {

    showAuthMessage(
      "Password must contain at least 6 characters.",
      "error"
    );

    return;
  }


  /*
    FRONTEND DEMO ONLY

    Real authentication will be connected
    to a backend later.
  */


  user = createUser(
    name,
    email
  );


  /*
    Store demo login information locally.
    This is NOT secure authentication.
  */

  user.demoPassword = password;


  saveUser();

  updateHeader();


  showAuthMessage(
    "Account created! You received 60 free credits.",
    "success"
  );


  setTimeout(() => {

    closeAuthModal();

    /*
      If the user originally clicked
      Generate Song, continue generation.
    */

    if (window.pendingGeneration) {

      window.pendingGeneration = false;

      generateSong();

    }

  }, 800);

}


/* =========================================================
   LOGIN
   ========================================================= */

function handleLogin(event) {

  event.preventDefault();


  const email =
    document.getElementById("loginEmail")
      ?.value
      .trim()
      .toLowerCase();


  const password =
    document.getElementById("loginPassword")
      ?.value;


  if (!email || !password) {

    showAuthMessage(
      "Please enter your email and password.",
      "error"
    );

    return;
  }


  /*
    FRONTEND DEMO LOGIN

    If a previous SONARA account exists,
    restore it.

    Otherwise a demo account is created.
  */


  const savedUser =
    JSON.parse(
      localStorage.getItem("sonaraUser")
    );


  if (
    savedUser &&
    savedUser.email === email
  ) {

    user = savedUser;

  } else {

    user = createUser(
      email.split("@")[0],
      email
    );

    user.demoPassword = password;

  }


  saveUser();

  updateHeader();


  showAuthMessage(
    "Signed in successfully.",
    "success"
  );


  setTimeout(() => {

    closeAuthModal();


    if (window.pendingGeneration) {

      window.pendingGeneration = false;

      generateSong();

    }

  }, 600);

}


/* =========================================================
   ACCOUNT BUTTON
   ========================================================= */

function handleAccountClick() {

  if (!user) {

    openAuthModal();

    return;

  }


  /*
    Simple account menu for the prototype.
  */

  const shouldLogout =
    confirm(
      `Signed in as ${user.email}\n\nDo you want to sign out?`
    );


  if (shouldLogout) {

    logout();

  }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

  user = null;

  localStorage.removeItem(
    "sonaraUser"
  );


  updateHeader();


  alert(
    "You have been signed out."
  );

}


/* =========================================================
   SHOW CREDIT INFORMATION
   ========================================================= */

function showCreditsInfo() {

  const credits =
    getCredits();


  alert(
    `You currently have ${credits} credits.\n\n` +
    `1 minute = 10 credits\n` +
    `2 minutes = 20 credits\n` +
    `3 minutes = 30 credits\n` +
    `4 minutes = 40 credits\n` +
    `5 minutes = 50 credits`
  );

}


/* =========================================================
   GENERATE SONG
   ========================================================= */

function generateSong() {

  const promptElement =
    document.getElementById("prompt");


  const prompt =
    promptElement
      ? promptElement.value.trim()
      : "";


  /*
    Check prompt
  */

  if (!prompt) {

    alert(
      "Please describe the song you want to create."
    );

    if (promptElement) {
      promptElement.focus();
    }

    return;
  }


  /*
    Check login
  */

  if (!user) {

    window.pendingGeneration = true;

    openAuthModal();

    return;

  }


  /*
    Calculate cost
  */

  const duration =
    Number(
      document.getElementById("duration")?.value || 1
    );


  const cost =
    duration * 10;


  /*
    Check credits
  */

  if (getCredits() < cost) {

    alert(
      `You need ${cost} credits to create this song.\n\n` +
      `You currently have ${getCredits()} credits.`
    );

    return;

  }


  /*
    Deduct credits
  */

  user.credits =
    getCredits() - cost;


  /*
    Save song request
  */

  const songData = {

    id:
      Date.now(),

    prompt:
      prompt,

    duration:
      duration,

    genre:
      document.getElementById("genre")?.value || "Pop",

    language:
      document.getElementById("language")?.value || "English",

    vocalStyle:
      document.getElementById("vocalStyle")?.value || "Male",

    mood:
      document.getElementById("mood")?.value || "Energetic",

    createdAt:
      new Date().toISOString(),

    status:
      "generating"

  };


  if (!Array.isArray(user.songs)) {
    user.songs = [];
  }


  user.songs.unshift(
    songData
  );


  saveUser();

  updateHeader();


  /*
    Open generation screen
  */

  openGenerationPage(
    songData
  );

}


/* =========================================================
   OPEN GENERATION PAGE
   ========================================================= */

function openGenerationPage(songData) {

  const page =
    document.getElementById("generationPage");


  if (!page) {
    return;
  }


  /*
    Fill generation information
  */

  const durationElement =
    document.getElementById(
      "generationDuration"
    );


  const genreElement =
    document.getElementById(
      "generationGenre"
    );


  const languageElement =
    document.getElementById(
      "generationLanguage"
    );


  const vocalElement =
    document.getElementById(
      "generationVocal"
    );


  const moodElement =
    document.getElementById(
      "generationMood"
    );


  const creditsElement =
    document.getElementById(
      "generationCredits"
    );


  if (durationElement) {

    durationElement.textContent =
      `${songData.duration} ${
        songData.duration === 1
          ? "minute"
          : "minutes"
      }`;

  }


  if (genreElement) {
    genreElement.textContent =
      songData.genre;
  }


  if (languageElement) {
    languageElement.textContent =
      songData.language;
  }


  if (vocalElement) {
    vocalElement.textContent =
      songData.vocalStyle;
  }


  if (moodElement) {
    moodElement.textContent =
      songData.mood;
  }


  if (creditsElement) {
    creditsElement.textContent =
      getCredits();
  }


  /*
    Reset progress
  */

  const progressBar =
    document.getElementById(
      "progressBar"
    );


  const progressPercent =
    document.getElementById(
      "progressPercent"
    );


  if (progressBar) {
    progressBar.style.width = "0%";
  }


  if (progressPercent) {
    progressPercent.textContent = "0%";
  }


  /*
    Open page
  */

  page.classList.add("active");

  page.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "generation-open"
  );


  /*
    Start fake generation
    until real AI backend is connected.
  */

  startGenerationProgress(
    songData
  );

}


/* =========================================================
   GENERATION PROGRESS
   ========================================================= */

function startGenerationProgress(songData) {

  /*
    Stop previous timer
  */

  if (generationTimer) {

    clearInterval(
      generationTimer
    );

  }


  let progress = 0;


  const progressBar =
    document.getElementById(
      "progressBar"
    );


  const progressPercent =
    document.getElementById(
      "progressPercent"
    );


  const status =
    document.getElementById(
      "generationStatus"
    );


  const title =
    document.getElementById(
      "generationTitle"
    );


  const description =
    document.getElementById(
      "generationDescription"
    );


  if (title) {

    title.textContent =
      "Your song is being created.";

  }


  if (description) {

    description.textContent =
      "SONARA is turning your idea into an original track.";

  }


  if (status) {

    status.textContent =
      "Creating music...";

  }


  generationTimer =
    setInterval(() => {

      /*
        Increase progress
      */

      progress += Math.floor(
        Math.random() * 5
      ) + 2;


      if (progress >= 100) {

        progress = 100;

      }


      /*
        Update progress bar
      */

      if (progressBar) {

        progressBar.style.width =
          `${progress}%`;

      }


      if (progressPercent) {

        progressPercent.textContent =
          `${progress}%`;

      }


      /*
        Update messages
      */

      if (progress < 30) {

        if (status) {
          status.textContent =
            "Writing your musical structure...";
        }

      } else if (progress < 60) {

        if (status) {
          status.textContent =
            "Building melody and instrumentation...";
        }

      } else if (progress < 85) {

        if (status) {
          status.textContent =
            "Creating vocals and arrangement...";
        }

      } else if (progress < 100) {

        if (status) {
          status.textContent =
            "Finishing your song...";
        }

      }


      /*
        Complete
      */

      if (progress >= 100) {

        clearInterval(
          generationTimer
        );

        generationTimer = null;


        finishGeneration(
          songData
        );

      }

    }, 700);

}


/* =========================================================
   FINISH GENERATION
   ========================================================= */

function finishGeneration(songData) {

  /*
    Find the saved song
  */

  if (user && Array.isArray(user.songs)) {

    const savedSong =
      user.songs.find(
        song =>
          song.id === songData.id
      );


    if (savedSong) {

      savedSong.status =
        "ready";

    }


    saveUser();

  }


  const title =
    document.getElementById(
      "generationTitle"
    );


  const description =
    document.getElementById(
      "generationDescription"
    );


  const status =
    document.getElementById(
      "generationStatus"
    );


  if (title) {

    title.textContent =
      "Your song is ready.";

  }


  if (description) {

    description.textContent =
      "Your song has been created successfully.";

  }


  if (status) {

    status.innerHTML =
      `
        <strong>Song created successfully.</strong>
        <br>
        The real AI audio player will appear
        here after the music-generation backend
        is connected.
      `;

  }


  /*
    Keep this prototype generation page open.
    Later this will automatically show:
    
    - Cover artwork
    - Audio player
    - Waveform
    - Lyrics
    - Download
    - Share
    - Regenerate
  */

}


/* =========================================================
   CLOSE GENERATION PAGE
   ========================================================= */

function closeGenerationPage() {

  const page =
    document.getElementById(
      "generationPage"
    );


  if (!page) {
    return;
  }


  if (generationTimer) {

    clearInterval(
      generationTimer
    );

    generationTimer = null;

  }


  page.classList.remove("active");

  page.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "generation-open"
  );


  updateHeader();

}


/* =========================================================
   SCROLL TO CREATE
   ========================================================= */

function scrollToCreate() {

  const createSection =
    document.getElementById(
      "create"
    );


  if (!createSection) {
    return;
  }


  createSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

  const navLinks =
    document.querySelectorAll(
      ".nav-link"
    );


  navLinks.forEach(link => {

    link.addEventListener(
      "click",
      function () {

        navLinks.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        this.classList.add(
          "active"
        );

      }
    );

  });

}


/* =========================================================
   MODAL CLICK OUTSIDE
   ========================================================= */

function setupModalEvents() {

  const modal =
    document.getElementById(
      "authModal"
    );


  if (!modal) {
    return;
  }


  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === modal
      ) {

        closeAuthModal();

      }

    }
  );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

function setupKeyboardEvents() {

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape"
      ) {

        closeAuthModal();

        closeGenerationPage();

      }

    }
  );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeSONARA() {

  updateHeader();

  updateCharacterCount();

  updateSongCost();

  setupNavigation();

  setupModalEvents();

  setupKeyboardEvents();

}


/* =========================================================
   START APP
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeSONARA
);
