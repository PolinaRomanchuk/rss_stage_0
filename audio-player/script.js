const music = document.querySelector("audio");
const playorstopMusicBtn = document.querySelector('.play-btn');

let isPlay = false;

function playMusic() {
    if (!isPlay) {
        isPlay = true;
        playorstopMusicBtn.classList.toggle('pause-btn');
        music.play();
    }
    else {
        isPlay = false;
        playorstopMusicBtn.classList.toggle('pause-btn');
        music.pause();
    }
}

playorstopMusicBtn.addEventListener('click', playMusic);
