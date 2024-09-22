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

let listMusicContainer = document.querySelector('.list-music');

let activeMusicCart = null;
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
        } else {
            currentMusicIndex = 0;
        }
    }
    if (direction == "left") {
        if (currentMusicIndex > 0) {
            currentMusicIndex -= 1;
        }
        else {
            currentMusicIndex = musicList.length - 1;
        }
    }

    showMusic(currentMusicIndex);
    isPlay = false;
    playMusic();
    if (activeMusicCart) {
        activeMusicCart.classList.remove("active");
    }
    let musicCart = document.querySelectorAll('.music-cart');
    activeMusicCart = musicCart[currentMusicIndex];
    activeMusicCart.classList.add("active");
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

async function createMusicCarts() {
    for (let music of musicList) {
        let audio = new Audio(music.path);

        await new Promise(resolve => {
            audio.addEventListener('loadedmetadata', () => resolve());
        });

        let cart = document.createElement('div');
        cart.className = "music-cart";
        cart.setAttribute('data-id', music.id);

        cart.innerHTML = `
        <div class="img-music-cart">
            <img src="${music.img}" alt="cover photo">
        </div>
        <div class="main-info-music-cart">
            <div class="author-music-cart">${music.author}</div>
            <div class="name-music-cart">${music.musicName}</div>
        </div>
        <div class="duration-music-cart">${formattedTime(audio.duration)}</div>
        `;

        listMusicContainer.appendChild(cart);
    }

    let musicCart = document.querySelectorAll('.music-cart');
    musicCart.forEach(cart => {
        cart.addEventListener('click', (e) => {
            let cartElement = e.currentTarget;
            if (cartElement == activeMusicCart) {
                playMusic();
            }
            else {
                let cartId = cartElement.getAttribute('data-id');
                let index = musicList.findIndex(music => music.id == cartId);
                currentMusicIndex = index;
                showMusic(currentMusicIndex);
                isPlay = false;
                playMusic();
                if (activeMusicCart) {
                    activeMusicCart.classList.remove("active");
                }
                activeMusicCart = cartElement;
                activeMusicCart.classList.add("active");
            }
        });
    });
    if (musicCart.length > 0) {
        musicCart[0].classList.add("active");
        activeMusicCart = musicCart[0];
    }
}

timeline.addEventListener('click', handUpdateProgress);

music.addEventListener('timeupdate', autoUpdateProgress);

playOrStopMusicBtn.addEventListener('click', playMusic);

music.addEventListener('ended', () => switchMusic('right'));

window.addEventListener('load', () => {
    showMusic(0);
    createMusicCarts();
});

function formattedTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
}