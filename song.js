document.addEventListener("DOMContentLoaded", () => {

    initializeSongPage();

});


/* =========================================
   DEFAULT SONG
========================================= */

const defaultSong = {
    title: "Your New Song",
    artist: "SONARA AI",
    genre: "Pop",
    language: "English",
    vocal: "Male",
    mood: "Energetic",
    duration: "1 minute",
    lyrics: ""
};


/* =========================================
   GET USER
========================================= */

function getUser() {

    try {

        return JSON.parse(
            localStorage.getItem("sonaraUser")
        );

    } catch (error) {

        return null;

    }

}


/* =========================================
   SAVE USER
========================================= */

function saveUser(user) {

    localStorage.setItem(
        "sonaraUser",
        JSON.stringify(user)
    );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeSongPage() {

    const storedSong =
        JSON.parse(
            localStorage.getItem("sonaraCurrentSong")
        ) || defaultSong;

    loadSongData(storedSong);

    updateCredits();

    setupPlayer();

    setupActions();

    setupAccount();

}


/* =========================================
   LOAD SONG DATA
========================================= */

function loadSongData(song) {

    const title =
        song.title ||
        defaultSong.title;

    const artist =
        song.artist ||
        defaultSong.artist;

    const genre =
        song.genre ||
        defaultSong.genre;

    const language =
        song.language ||
        defaultSong.language;

    const vocal =
        song.vocal ||
        defaultSong.vocal;

    const mood =
        song.mood ||
        defaultSong.mood;

    const duration =
        song.duration ||
        defaultSong.duration;


    setText("songTitle", title);
    setText("songArtist", artist);

    setText("playerTitle", title);
    setText("playerArtist", artist);

    setText("coverGenre", genre);
    setText("coverMood", mood);

    setText("detailDuration", duration);
    setText("detailGenre", genre);
    setText("detailLanguage", language);
    setText("detailVocal", vocal);
    setText("detailMood", mood);


    if (song.lyrics) {

        const lyricsContainer =
            document.getElementById(
                "lyricsContent"
            );

        if (lyricsContainer) {

            lyricsContainer.innerHTML =
                formatLyrics(song.lyrics);

        }

    }

}


/* =========================================
   SET TEXT
========================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


/* =========================================
   FORMAT LYRICS
========================================= */

function formatLyrics(lyrics) {

    return lyrics
        .split("\n")
        .map(line => {

            if (line.trim() === "") {

                return "<br>";

            }

            return `<p>${escapeHTML(line)}</p>`;

        })
        .join("");

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   CREDITS
========================================= */

function updateCredits() {

    const user = getUser();

    const credits =
        user && typeof user.credits === "number"
            ? user.credits
            : 60;

    setText(
        "creditsCount",
        credits
    );

}


/* =========================================
   PLAYER
========================================= */

function setupPlayer() {

    const audio =
        document.getElementById(
            "audioPlayer"
        );

    const playButton =
        document.getElementById(
            "playButton"
        );

    const progress =
        document.getElementById(
            "audioProgress"
        );

    const volume =
        document.getElementById(
            "volumeControl"
        );

    const currentTime =
        document.getElementById(
            "currentTime"
        );

    const totalTime =
        document.getElementById(
            "totalTime"
        );

    const waveform =
        document.getElementById(
            "waveform"
        );


    if (!audio) return;


    /* -------------------------------
       Volume
    -------------------------------- */

    if (volume) {

        audio.volume =
            Number(volume.value);

        volume.addEventListener(
            "input",
            () => {

                audio.volume =
                    Number(volume.value);

            }
        );

    }


    /* -------------------------------
       Play / Pause
    -------------------------------- */

    if (playButton) {

        playButton.addEventListener(
            "click",
            () => {

                /*
                 * The audio source will be
                 * supplied by the backend later.
                 */

                if (!audio.src) {

                    showAudioMessage();

                    return;

                }


                if (audio.paused) {

                    audio.play();

                } else {

                    audio.pause();

                }

            }
        );

    }


    /* -------------------------------
       Audio events
    -------------------------------- */

    audio.addEventListener(
        "play",
        () => {

            if (playButton) {

                playButton.textContent = "Ⅱ";

            }

            if (waveform) {

                waveform.classList.add(
                    "playing"
                );

            }

        }
    );


    audio.addEventListener(
        "pause",
        () => {

            if (playButton) {

                playButton.textContent = "▶";

            }

            if (waveform) {

                waveform.classList.remove(
                    "playing"
                );

            }

        }
    );


    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (totalTime) {

                totalTime.textContent =
                    formatTime(audio.duration);

            }

        }
    );


    audio.addEventListener(
        "timeupdate",
        () => {

            if (!audio.duration) return;


            const percentage =
                (audio.currentTime /
                    audio.duration) *
                100;


            if (progress) {

                progress.value =
                    percentage;

            }


            if (currentTime) {

                currentTime.textContent =
                    formatTime(
                        audio.currentTime
                    );

            }

        }
    );


    audio.addEventListener(
        "ended",
        () => {

            if (playButton) {

                playButton.textContent = "▶";

            }

            if (waveform) {

                waveform.classList.remove(
                    "playing"
                );

            }

        }
    );


    /* -------------------------------
       Progress seek
    -------------------------------- */

    if (progress) {

        progress.addEventListener(
            "input",
            () => {

                if (!audio.duration) return;

                audio.currentTime =
                    (Number(progress.value) / 100) *
                    audio.duration;

            }
        );

    }

}


/* =========================================
   TIME FORMAT
========================================= */

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {

        return "0:00";

    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;

}


/* =========================================
   AUDIO MESSAGE
========================================= */

function showAudioMessage() {

    const note =
        document.getElementById(
            "audioNote"
        );

    if (!note) return;

    note.textContent =
        "Audio generation will be available when the SONARA AI music API is connected.";

    note.style.color = "#ffffff";

    setTimeout(() => {

        note.textContent =
            "Your generated audio will appear here once the music generation API is connected.";

        note.style.color = "";

    }, 3500);

}


/* =========================================
   ACTION BUTTONS
========================================= */

function setupActions() {

    const downloadButton =
        document.getElementById(
            "downloadButton"
        );

    const shareButton =
        document.getElementById(
            "shareButton"
        );

    const regenerateButton =
        document.getElementById(
            "regenerateButton"
        );

    const favoriteButton =
        document.getElementById(
            "favoriteButton"
        );

    const copyLyricsButton =
        document.getElementById(
            "copyLyricsButton"
        );


    /* -------------------------------
       Download
    -------------------------------- */

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            () => {

                const song =
                    JSON.parse(
                        localStorage.getItem(
                            "sonaraCurrentSong"
                        )
                    ) || defaultSong;


                if (!song.audioUrl) {

                    alert(
                        "Your song audio will be downloadable once the SONARA AI backend is connected."
                    );

                    return;

                }


                const link =
                    document.createElement("a");

                link.href =
                    song.audioUrl;

                link.download =
                    `${song.title || "sonara-song"}.mp3`;

                document.body.appendChild(link);

                link.click();

                link.remove();

            }
        );

    }


    /* -------------------------------
       Share
    -------------------------------- */

    if (shareButton) {

        shareButton.addEventListener(
            "click",
            async () => {

                const song =
                    JSON.parse(
                        localStorage.getItem(
                            "sonaraCurrentSong"
                        )
                    ) || defaultSong;


                const shareData = {

                    title:
                        song.title ||
                        "My SONARA Song",

                    text:
                        "Check out my AI-generated song created with SONARA AI.",

                    url:
                        window.location.href

                };


                try {

                    if (
                        navigator.share
                    ) {

                        await navigator.share(
                            shareData
                        );

                    } else {

                        await navigator.clipboard.writeText(
                            window.location.href
                        );

                        alert(
                            "Song page link copied!"
                        );

                    }

                } catch (error) {

                    console.log(
                        "Share cancelled."
                    );

                }

            }
        );

    }


    /* -------------------------------
       Regenerate
    -------------------------------- */

    if (regenerateButton) {

        regenerateButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "index.html";

            }
        );

    }


    /* -------------------------------
       Favorite
    -------------------------------- */

    if (favoriteButton) {

        favoriteButton.addEventListener(
            "click",
            () => {

                favoriteButton.classList.toggle(
                    "active"
                );


                const isSaved =
                    favoriteButton.classList.contains(
                        "active"
                    );


                favoriteButton.textContent =
                    isSaved
                        ? "♥"
                        : "♡";


                saveFavoriteState(
                    isSaved
                );

            }
        );

    }


    /* -------------------------------
       Copy Lyrics
    -------------------------------- */

    if (copyLyricsButton) {

        copyLyricsButton.addEventListener(
            "click",
            copyLyrics
        );

    }

}


/* =========================================
   COPY LYRICS
========================================= */

async function copyLyrics() {

    const lyricsElement =
        document.getElementById(
            "lyricsContent"
        );

    const button =
        document.getElementById(
            "copyLyricsButton"
        );


    if (!lyricsElement) return;


    const text =
        lyricsElement.innerText.trim();


    if (!text) {

        return;

    }


    try {

        await navigator.clipboard.writeText(
            text
        );


        if (button) {

            button.textContent =
                "Copied!";


            setTimeout(() => {

                button.textContent =
                    "Copy";

            }, 1500);

        }

    } catch (error) {

        alert(
            "Could not copy lyrics."
        );

    }

}


/* =========================================
   FAVORITE STATE
========================================= */

function saveFavoriteState(isSaved) {

    const song =
        JSON.parse(
            localStorage.getItem(
                "sonaraCurrentSong"
            )
        ) || defaultSong;


    song.saved =
        isSaved;


    localStorage.setItem(
        "sonaraCurrentSong",
        JSON.stringify(song)
    );

}


/* =========================================
   ACCOUNT
========================================= */

function setupAccount() {

    const accountButton =
        document.getElementById(
            "accountButton"
        );

    const creditsButton =
        document.getElementById(
            "creditsButton"
        );


    updateAccountButton();


    if (accountButton) {

        accountButton.addEventListener(
            "click",
            () => {

                const user =
                    getUser();


                if (user) {

                    const logout =
                        confirm(
                            "You are signed in. Do you want to sign out?"
                        );


                    if (logout) {

                        localStorage.removeItem(
                            "sonaraUser"
                        );

                        updateAccountButton();

                        updateCredits();

                    }

                } else {

                    openAuthModal();

                }

            }
        );

    }


    if (creditsButton) {

        creditsButton.addEventListener(
            "click",
            () => {

                const user =
                    getUser();

                const credits =
                    user &&
                    typeof user.credits === "number"
                        ? user.credits
                        : 60;


                alert(
                    `You currently have ${credits} credits.`
                );

            }
        );

    }

}


/* =========================================
   ACCOUNT BUTTON
========================================= */

function updateAccountButton() {

    const button =
        document.getElementById(
            "accountButton"
        );


    if (!button) return;


    const user =
        getUser();


    if (user) {

        button.textContent =
            user.name
                ? user.name.split(" ")[0]
                : "Account";

    } else {

        button.textContent =
            "Sign In";

    }

}


/* =========================================
   AUTH MODAL
========================================= */

function openAuthModal() {

    const modal =
        document.getElementById(
            "authModal"
        );


    if (!modal) return;


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeAuthModal() {

    const modal =
        document.getElementById(
            "authModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


const closeAuthButton =
    document.getElementById(
        "closeAuthButton"
    );


if (closeAuthButton) {

    closeAuthButton.addEventListener(
        "click",
        closeAuthModal
    );

}


const modalLoginButton =
    document.getElementById(
        "modalLoginButton"
    );


if (modalLoginButton) {

    modalLoginButton.addEventListener(
        "click",
        () => {

            closeAuthModal();

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================
   OUTSIDE MODAL CLICK
========================================= */

const authModal =
    document.getElementById(
        "authModal"
    );


if (authModal) {

    authModal.addEventListener(
        "click",
        (event) => {

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
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            closeAuthModal();

        }

    }
);
