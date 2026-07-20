var imgSrc;
var videoSrc = "sonic-frontiers.mp4";
var playlist = [];
var currentSong_Index = 0;

// 🖥️ Wallpaper 🖥️
async function LoadMedia() {
    try {
        const response = await fetch("media.json");
        const data = await response.json();
        videoSrc = data["media"][0];

        document.getElementById("bg-video").src = `media/${videoSrc}`;
    }
    catch (error) {
        console.error("Error loading media:", error);
    }
}

// 🕑 Timings 🕑
var fadeInTime = 5, fadeOutTime = 5;
var fadeInterval = 20, songInterval = 3;
var fading;

// 🎵 JSON Playlist 🎵
// Fetch the song list asynchronously
async function LoadSongsAndStart() {
    try {
        const response = await fetch("playlist.json");
        const data = await response.json();
        playList = data["playlist"];

        // Shuffle the playlist after loading
        shuffle(playList);

        // Start the first song
        var audioSrc = playList[currentSong_Index];
        document.getElementById("bg-music").src = `music/${audioSrc}`;

    } catch (error) {
        console.error("Error loading song names:", error);
    }
}

// Fisher-Yates Shuffle Algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// On-Page Load
window.addEventListener('load', () => {
    LoadMedia();
    LoadSongsAndStart();
});

// On-Run Logic
window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById("bg-music");

    // Paused Listener
    var truly_paused = false;
    audio.addEventListener('pause', () => {
        audio.play();
        if (fading) { clearInterval(fading); }
        fadeOut(audio, fadeOutTime * 400);
        truly_paused = truly_paused == false ? true : false;
    });

    // Play (Fade-In) Listener
    audio.addEventListener('play', () => {
        if (!truly_paused) { fadeIn(audio, fadeInTime * 1000); }
    });

    // End of Song (Fade-Out) Listener
    audio.addEventListener('timeupdate', () => {
        let timeRemaining = audio.duration - audio.currentTime;
        console.log("ad: " + audio.duration);
        console.log("ac: " + audio.currentTime);
        console.log("tr: " + timeRemaining);

        if (timeRemaining <= fadeOutTime && !audio.dataset.fadingOut) {
            audio.dataset.fadingOut = "true"; // Flag set

            // We use a callback or chain to run AutoSong *after* fading completes
            fadeOut(audio, fadeOutTime * 1000, () => { AutoNextSong(audio); });
        }
    });
});

// Automatically Play Next Song
function AutoNextSong(audioElement) {
    setTimeout(() => {
        if (currentSong_Index < playList.length - 1) { currentSong_Index++; }
        else { currentSong_Index = 0; }

        audioElement.src = "music/" + playList[currentSong_Index];
        audioElement.dataset.fadingOut = "";
        audioElement.play();
    }, songInterval * 1000);
}

// Fade-In Handler
function fadeIn(audioElement, duration) {
    let step = fadeInterval / duration;

    fading = setInterval(() => {
        if (audioElement.volume + step >= 1) {
            audioElement.volume = 1;
            clearInterval(fade);
        }
        else { audioElement.volume += step; }
    }, fadeInterval);
}

// Fade-Out Handler
function fadeOut(audioElement, duration = 2000, onComplete) {
    let step = fadeInterval / duration;

    let fade = setInterval(() => {
        if (audioElement.volume - step <= 0) {
            audioElement.volume = 0
            clearInterval(fade);

            onComplete();
        }
        else { audioElement.volume -= step; }
    }, fadeInterval);
}