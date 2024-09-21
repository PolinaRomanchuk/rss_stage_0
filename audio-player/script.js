let music = document.querySelector("audio");

let cover = document.querySelector(".music-cover");
let author = document.querySelector(".author-music");
let musicName = document.querySelector(".name-music");
let musicDuration = document.querySelector(".end-time");
let currentMusicTime = document.querySelector(".start-time");

let playOrStopMusicBtn = document.querySelector('.play-btn');
let musicSwitch = document.querySelectorAll('.arrow');

let timeline = document.querySelector('.progress-bar');
let progressline = document.querySelector('.progress-line');
let playpointer = document.querySelector('.playpointer');

let currentMusicIndex = 0;
let isPlay = false;

let musicList = [
    {
        "id": 1,
        "path": "./assets/audio/Rammstein - Rosenrot.mp3",
        "img": "./assets/img/Rammstein_Rosenrot.jpg",
        "author": "Rammstein",
        "musicName": "Rosenrot"
    },
    {
        "id": 2,
        "path": "./assets/audio/Linkin Park - In The End.mp3",
        "img": "./assets/img/linkin.jpg",
        "author": "Linkin Park",
        "musicName": "In the end"
    },
    {
        "id": 3,
        "path": "./assets/audio/Miley Cyrus - Flowers.mp3",
        "img": "./assets/img/flowers.jpg",
        "author": "Miley Cyrus",
        "musicName": "Flowers"
    },
    {
        "id": 4,
        "path": "./assets/audio/Виктор Цой - Группа крови.mp3",
        "img": "./assets/img/группа.jpg",
        "author": "Виктор Цой",
        "musicName": "Группа крови"
    },
    {
        "id": 5,
        "path": "./assets/audio/МакSим - Знаешь Ли Ты.mp3",
        "img": "./assets/img/максим.jpg",
        "author": "МакSим",
        "musicName": "Знаешь ли ты"
    }
]

function playMusic() {
    if (!isPlay) {
        isPlay = true;
        playOrStopMusicBtn.classList.add('pause-btn');
        music.play();
    }
    else {
        isPlay = false;
        playOrStopMusicBtn.classList.toggle('pause-btn');
        music.pause();
    }
}

function showMusic(index) {
    const track = musicList[index];
    if (track) {
        music.src = track.path;
        document.body.style.setProperty('--background-url', `url(${track.img})`);
        cover.src = track.img;
        author.textContent = track.author;
        musicName.textContent = track.musicName;
        music.onloadedmetadata = () => {
            musicDuration.textContent = formattedTime(music.duration);
        }
    }
}

function switchMusic(direction) {
    if (direction == "right") {
        if (currentMusicIndex < musicList.length - 1) {
            currentMusicIndex += 1;
            showMusic(currentMusicIndex);
        } else {
            currentMusicIndex = 0;
            showMusic(currentMusicIndex);
        }

    }
    if (direction == "left") {
        if (currentMusicIndex > 0) {
            currentMusicIndex -= 1;
            showMusic(currentMusicIndex);
        }
        else {
            currentMusicIndex = musicList.length - 1;
            showMusic(currentMusicIndex);
        }
    }
    isPlay = false;
    playMusic();
}

musicSwitch.forEach(arrow => {
    arrow.addEventListener('click', (e) => {
        let direction = e.target.classList.contains('next-music') ? 'right' : 'left';
        switchMusic(direction);
    });
});

function autoUpdateProgress() {
    let duration = music.duration;
    let currentTime = music.currentTime;
    let progressPercent = (currentTime / duration) * 100;
    progressline.style.width = `${progressPercent}%`;
    playpointer.style.left = `${progressPercent}%`;
    currentMusicTime.textContent = formattedTime(currentTime);
}


function handUpdateProgress(e) {
    let timelineСoordinates = timeline.getBoundingClientRect();
    let cursorX = e.clientX - timelineСoordinates.left;
    let totalWidth = timelineСoordinates.width;
    let percent = cursorX / totalWidth;
    let newTime = percent * music.duration;

    music.currentTime = newTime;
    if (!isPlay) {
        playMusic();
    }
}

timeline.addEventListener('click', handUpdateProgress);

music.addEventListener('timeupdate', autoUpdateProgress);

playOrStopMusicBtn.addEventListener('click', playMusic);

music.addEventListener('ended', () => switchMusic('right'));

window.addEventListener('load', () => {
    showMusic(0);
});

function formattedTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
}