let user = null;
let pendingGeneration = false;

try {
    const savedUser = localStorage.getItem("sonaraUser");

    if (savedUser) {
        user = JSON.parse(savedUser);
    }
} catch (error) {
    console.warn("SONARA: Invalid saved user data. Resetting account.", error);
    localStorage.removeItem("sonaraUser");
    user = null;
}


/* =========================================
   DEFAULT USER
========================================= */

function createUser(name, email) {

    return {
        name: name,
        email: email,
        credits: 60,
        songs: []
    };

}


/* =========================================
   SAVE USER
========================================= */

function saveUser() {

    if (user) {

        localStorage.setItem(
            "sonaraUser",
            JSON.stringify(user)
        );

    }

}


/* =========================================
   GET CREDITS
========================================= */

function getCredits() {

    return user ? user.credits : 60;

}


/* =========================================
   UPDATE HEADER
========================================= */

function updateHeader() {

    const creditsElement =
        document.getElementById("creditsCount");

    const accountButton =
        document.getElementById("accountButton");


    if (creditsElement) {

        creditsElement.textContent =
            getCredits();

    }


    if (accountButton) {

        if (user) {

            accountButton.textContent =
                user.name
                    ? user.name.split(" ")[0]
                    : "Account";

        } else {

            accountButton.textContent =
                "Sign In";

        }

    }

}


/* =========================================
   CHARACTER COUNTER
========================================= */

function updateCharacterCount() {

    const prompt =
        document.getElementById("prompt");

    const counter =
        document.getElementById("characterCounter");


    if (!prompt || !counter) return;


    counter.textContent =
        `${prompt.value.length}/1000`;

}


const promptInput =
    document.getElementById("prompt");


if (promptInput) {

    promptInput.addEventListener(
        "input",
        updateCharacterCount
    );

}


/* =========================================
   SONG COST
========================================= */

function updateSongCost() {

    const duration =
        document.getElementById("duration");

    const cost =
        document.getElementById("generateCost");


    if (!duration || !cost) return;


    const minutes =
        Number(duration.value) || 1;


    const credits =
        minutes * 10;


    cost.textContent =
        `${credits} credits`;

}


const durationSelect =
    document.getElementById("duration");


if (durationSelect) {

    durationSelect.addEventListener(
        "change",
        updateSongCost
    );

}


/* =========================================
   AUTH MODAL
========================================= */

function openAuthModal() {

    const modal =
        document.getElementById("authModal");


    if (!modal) return;


    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

}


function closeAuthModal() {

    const modal =
        document.getElementById("authModal");


    if (!modal) return;


    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

}


function showLoginForm() {

    const loginTab =
        document.getElementById("loginTab");

    const signupTab =
        document.getElementById("signupTab");

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");


    if (loginTab) {
        loginTab.classList.add("active");
    }

    if (signupTab) {
        signupTab.classList.remove("active");
    }

    if (loginForm) {
        loginForm.style.display = "block";
    }

    if (signupForm) {
        signupForm.style.display = "none";
    }

}


function showSignupForm() {

    const loginTab =
        document.getElementById("loginTab");

    const signupTab =
        document.getElementById("signupTab");

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");


    if (loginTab) {
        loginTab.classList.remove("active");
    }

    if (signupTab) {
        signupTab.classList.add("active");
    }

    if (loginForm) {
        loginForm.style.display = "none";
    }

    if (signupForm) {
        signupForm.style.display = "block";
    }

}


/* =========================================
   LOGIN
========================================= */

function handleLogin(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail")?.value.trim();


    const password =
        document.getElementById("loginPassword")?.value;


    if (!email || !password) {

        showAuthMessage(
            "Please enter your email and password."
        );

        return;

    }


    /*
     * Frontend demo login.
     * Real authentication will be connected later.
     */

    let savedUser = null;

    try {

        const savedUserRaw =
            localStorage.getItem("sonaraUser");

        if (savedUserRaw) {
            savedUser = JSON.parse(savedUserRaw);
        }

    } catch (error) {

        localStorage.removeItem("sonaraUser");
        savedUser = null;

    }


    if (savedUser) {

        user = savedUser;

    } else {

        user =
            createUser(
                email.split("@")[0],
                email
            );

    }


    saveUser();

    updateHeader();

    closeAuthModal();


    if (pendingGeneration) {

        pendingGeneration = false;

        setTimeout(
            generateSong,
            200
        );

    }

}


/* =========================================
   SIGN UP
========================================= */

function handleSignup(event) {

    event.preventDefault();


    const name =
        document.getElementById("signupName")?.value.trim();


    const email =
        document.getElementById("signupEmail")?.value.trim();


    const password =
        document.getElementById("signupPassword")?.value;


    if (!name || !email || !password) {

        showAuthMessage(
            "Please fill in all fields."
        );

        return;

    }


    user =
        createUser(
            name,
            email
        );


    saveUser();

    updateHeader();

    closeAuthModal();


    if (pendingGeneration) {

        pendingGeneration = false;

        setTimeout(
            generateSong,
            200
        );

    }

}


/* =========================================
   AUTH MESSAGE
========================================= */

function showAuthMessage(message) {

    const element =
        document.getElementById("authMessage");


    if (element) {

        element.textContent =
            message;

    }

}


/* =========================================
   CREDITS INFO
========================================= */

function showCreditsInfo() {

    const credits = getCredits();

    alert(
        `You currently have ${credits} credits.`
    );

}


/* =========================================
   ACCOUNT BUTTON
========================================= */

function handleAccountClick() {

    if (!user) {

        openAuthModal();

        return;

    }


    const shouldLogout =
        confirm(
            "You are currently signed in. Do you want to sign out?"
        );


    if (shouldLogout) {

        user = null;

        localStorage.removeItem(
            "sonaraUser"
        );

        updateHeader();

    }

}


/* =========================================
   GENERATE SONG
========================================= */

function generateSong() {

    const prompt =
        document.getElementById("prompt");

    const duration =
        document.getElementById("duration");

    const genre =
        document.getElementById("genre");

    const language =
        document.getElementById("language");

    const vocal =
        document.getElementById("vocalStyle");

    const mood =
        document.getElementById("mood");


    if (!prompt || !prompt.value.trim()) {

        alert(
            "Please describe the song you want to create."
        );

        prompt?.focus();

        return;

    }


    /*
     * Require login.
     */

    if (!user) {

        pendingGeneration = true;

        openAuthModal();

        return;

    }


    const minutes =
        Number(duration?.value) || 1;


    const cost =
        minutes * 10;


    /*
     * Check credits.
     */

    if (user.credits < cost) {

        alert(
            `You need ${cost} credits to generate this song, but you only have ${user.credits}.`
        );

        return;

    }


    /*
     * Deduct credits.
     */

    user.credits -= cost;

    saveUser();

    updateHeader();


    /*
     * Create song data.
     */

    const songData = {

        id:
            Date.now(),

        title:
            createSongTitle(prompt.value),

        artist:
            "SONARA AI",

        prompt:
            prompt.value.trim(),

        duration:
            `${minutes} minute${minutes > 1 ? "s" : ""}`,

        durationMinutes:
            minutes,

        genre:
            genre?.value || "Pop",

        language:
            language?.value || "English",

        vocal:
            vocal?.value || "Male",

        mood:
            mood?.value || "Energetic",

        lyrics:
            "",

        audioUrl:
            "",

        status:
            "generating",

        createdAt:
            new Date().toISOString()

    };


    /*
     * Save current song.
     */

    localStorage.setItem(
        "sonaraCurrentSong",
        JSON.stringify(songData)
    );


    /*
     * Save in user's songs.
     */

    if (!Array.isArray(user.songs)) {

        user.songs = [];

    }


    user.songs.unshift(
        songData
    );


    saveUser();


    /*
     * Open generation screen.
     */

    openGenerationPage(
        songData
    );


    /*
     * Start fake generation.
     */

    startGeneration(
        songData
    );

}


/* =========================================
   CREATE SONG TITLE
========================================= */

function createSongTitle(prompt) {

    const text =
        prompt
            .trim()
            .replace(/\s+/g, " ");


    if (!text) {

        return "Untitled Song";

    }


    /*
     * Use the first few words
     * to create a temporary title.
     */

    const words =
        text
            .split(" ")
            .slice(0, 5);


    let title =
        words.join(" ");


    title =
        title.charAt(0).toUpperCase() +
        title.slice(1);


    return title;

}


/* =========================================
   OPEN GENERATION PAGE
========================================= */

function openGenerationPage(song) {

    const page =
        document.getElementById(
            "generationPage"
        );


    if (!page) return;


    page.classList.add("active");
    page.setAttribute("aria-hidden", "false");


    setText(
        "generationCredits",
        user?.credits ?? 0
    );

    setText(
        "generationDuration",
        song.duration
    );

    setText(
        "generationGenre",
        song.genre
    );

    setText(
        "generationLanguage",
        song.language
    );

    setText(
        "generationVocal",
        song.vocal
    );

    setText(
        "generationMood",
        song.mood
    );

    setText(
        "generationTitle",
        song.title
    );

    setText(
        "generationDescription",
        song.prompt
    );

    setText(
        "progressPercent",
        "0%"
    );

    setText(
        "generationStatus",
        "Preparing your song..."
    );


    const progressBar =
        document.getElementById(
            "progressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            "0%";

    }

}


/* =========================================
   GENERATION PROGRESS
========================================= */

function startGeneration(songData) {

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


    const interval =
        setInterval(() => {

            /*
             * Increase progress.
             */

            progress +=
                Math.floor(
                    Math.random() * 7
                ) + 3;


            /*
             * Never go above 100.
             */

            if (progress >= 100) {

                progress = 100;

            }


            /*
             * Update progress bar.
             */

            if (progressBar) {

                progressBar.style.width =
                    `${progress}%`;

            }


            /*
             * Update percentage.
             */

            if (progressPercent) {

                progressPercent.textContent =
                    `${progress}%`;

            }


            /*
             * Update status.
             */

            if (status) {

                if (progress < 25) {

                    status.textContent =
                        "Writing your song idea...";

                } else if (progress < 50) {

                    status.textContent =
                        "Creating melody...";

                } else if (progress < 75) {

                    status.textContent =
                        "Generating vocals...";

                } else if (progress < 95) {

                    status.textContent =
                        "Mixing your song...";

                } else {

                    status.textContent =
                        "Finalizing your song...";

                }

            }


            /*
             * FINISHED
             */

            if (progress >= 100) {

                clearInterval(interval);


                /*
                 * Update song status.
                 */

                songData.status =
                    "ready";


                /*
                 * Save updated song.
                 */

                localStorage.setItem(
                    "sonaraCurrentSong",
                    JSON.stringify(songData)
                );


                /*
                 * Update the matching song
                 * inside the user's songs.
                 */

                if (
                    user &&
                    Array.isArray(user.songs)
                ) {

                    const index =
                        user.songs.findIndex(
                            song =>
                                song.id ===
                                songData.id
                        );


                    if (index !== -1) {

                        user.songs[index] =
                            songData;

                    }


                    saveUser();

                }


                if (status) {

                    status.textContent =
                        "Your song is ready. Opening your song...";

                }


                /*
                 * IMPORTANT:
                 * Redirect to song.html
                 */

                setTimeout(() => {

                    window.location.href =
                        "song.html";

                }, 700);

            }

        }, 500);

}


/* =========================================
   SET TEXT
========================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================
   CLOSE GENERATION PAGE
========================================= */

function closeGenerationPage() {

    const page =
        document.getElementById(
            "generationPage"
        );


    if (page) {

        page.classList.remove(
            "active"
        );

        page.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


/* =========================================
   SCROLL TO CREATE
========================================= */

function scrollToCreate() {

    const element =
        document.getElementById(
            "create"
        );


    if (element) {

        element.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   MODAL TAB EVENTS
========================================= */

const loginTab =
    document.getElementById("loginTab");


if (loginTab) {

    loginTab.addEventListener(
        "click",
        showLoginForm
    );

}


const signupTab =
    document.getElementById("signupTab");


if (signupTab) {

    signupTab.addEventListener(
        "click",
        showSignupForm
    );

}


/* =========================================
   LOGIN FORM
========================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

}


/* =========================================
   SIGNUP FORM
========================================= */

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        handleSignup
    );

}


/* =========================================
   ACCOUNT
========================================= */

const accountButton =
    document.getElementById("accountButton");


if (accountButton) {

    accountButton.addEventListener(
        "click",
        handleAccountClick
    );

}


/* =========================================
   CLOSE AUTH MODAL
========================================= */

const authModal =
    document.getElementById("authModal");


if (authModal) {

    authModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                authModal
            ) {

                closeAuthModal();

            }

        }
    );

}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeAuthModal();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCharacterCount();

        updateSongCost();

        updateHeader();

    }
);
