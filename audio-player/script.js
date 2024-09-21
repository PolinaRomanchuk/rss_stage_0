const music = document.querySelector("audio");

let cover = document.querySelector(".music-cover");
let author = document.querySelector(".author-music");
let musicName = document.querySelector(".name-music");
let musicDuration = document.querySelector(".end-time");

const playorstopMusicBtn = document.querySelector('.play-btn');
let musicSwitch = document.querySelectorAll('.arrow');


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
        "musicName": "In The End"
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
        "musicName": "Знаешь Ли Ты"
    }
]

function playMusic() {
    if (!isPlay) {
        isPlay = true;
        playorstopMusicBtn.classList.add('pause-btn');
        music.play();
    }
    else {
        isPlay = false;
        playorstopMusicBtn.classList.toggle('pause-btn');
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
            const duration = music.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
            musicDuration.textContent = `${minutes}:${formattedSeconds}`;
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


playorstopMusicBtn.addEventListener('click', playMusic);

window.addEventListener('load', () => {
    showMusic(0);
});