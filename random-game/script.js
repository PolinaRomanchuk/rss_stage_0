const memeList = [
    {
        id: "1",
        img: "./assets/img/1.png"
    },
    {
        id: "2",
        img: "./assets/img/2.png"
    },
    {
        id: "3",
        img: "./assets/img/3.png"
    },
    {
        id: "4",
        img: "./assets/img/4.png"
    },
    {
        id: "5",
        img: "./assets/img/5.jpg"
    },
    {
        id: "6",
        img: "./assets/img/6.png"
    },
    {
        id: "7",
        img: "./assets/img/7.png"
    },
    {
        id: "8",
        img: "./assets/img/8.png"
    },
    {
        id: "9",
        img: "./assets/img/9.png"
    },
    {
        id: "10",
        img: "./assets/img/10.png"
    }
]

let matchedPairs = 0;
let moves = 0;
let time = 0;

let seconds = 0;
let minutes = 0;
let timerInterval;

movesGoal = 0;
timeGoal = 2;
isMovesGoal = false;
isTimesGoal = true;

let difficulty = 'easy';
let resultGame = '';
let gif = '';

const levelCardPairs = {
    easy: 4,
    medium: 6,
    hard: 10
};

const memeContainer = document.querySelector('.cards_container');
const resultsContainer = document.querySelector('.result_container');
const resultContainer = document.querySelector('.curr_user_result');
const rules = document.querySelector('.rules');

const timer = document.querySelector('.timer');
const movesCounter = document.querySelector('.moves_checking');

const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const gridDemo = document.getElementById('grid_demo');
const goalRadios = document.querySelectorAll('input[name="goal"]');
const startBtn = document.querySelector('.start_btn');

let isRolledCard = false;
let isBlockedClickCards = false;
let firstCard, secondCard = null;

function createHint() {
    const hint = document.querySelector('.rules_text');
    hint.innerHTML = '';
    isTimesGoal ? hint.innerHTML = `You have ${timeGoal} minutes to win` : hint.innerHTML = `You have ${movesGoal} moves to win`;
}

function createGrid(pairCount) {
    gridDemo.innerHTML = '';
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid');

    for (let i = 0; i < pairCount * 2; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = '?';
        gridContainer.appendChild(card);
    }

    if (pairCount === 4) {
        gridContainer.classList.add('easy_grid');
    } else if (pairCount === 6) {
        gridContainer.classList.add('medium_grid');
    } else if (pairCount === 10) {
        gridContainer.classList.add('hard_grid');
    }

    gridDemo.appendChild(gridContainer);
}

createGrid(levelCardPairs['easy']);

function setGameGoal() {
    if (isMovesGoal) {
        movesGoal = 20;
        timeGoal = 0;
    } else {
        timeGoal = 2;
        movesGoal = 0;
    }
}

difficultyRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        difficulty = event.target.value;
        createGrid(levelCardPairs[difficulty]);
        setGameGoal();
    });
});

goalRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.value == 'time') {
            isTimesGoal = true;
            isMovesGoal = false;
        } else if (event.target.value == 'moves') {
            isMovesGoal = true;
            isTimesGoal = false;
        }
        setGameGoal();
        createHint();
    });
});

startBtn.addEventListener('click', startGame);

function startGame() {
    rules.classList.add('hidden');
    memeContainer.classList.remove('hidden');
    isTimesGoal ? countdownTimer() : startTimer();
    createCards();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createMemeArray() {
    let number = levelCardPairs[difficulty];
    totalPairs = number;

    let myArray = [];
    for (let i = 0; i < number; i++) {
        myArray.push(memeList[i]);
    }
    const fullMemeArray = [...myArray, ...myArray];
    return shuffle(fullMemeArray);
}

function createCards() {
    memeContainer.textContent = '';
    const memeList = createMemeArray();
    for (let meme of memeList) {
        let memeCard = document.createElement('div');
        memeCard.className = "card_container";
        memeCard.setAttribute('data-id', meme.id);
        memeCard.innerHTML = `
        <img class="front_card" src="./assets/img/cover.png" alt="card"> 
        <img class="back_card" src="${meme.img}" alt="card">`;
        memeContainer.appendChild(memeCard);
    }

    isTimesGoal ? movesCounter.textContent = 0 : movesCounter.textContent = `0/${movesGoal}`;;

    const cards = document.querySelectorAll('.card_container');
    cards.forEach(card => card.addEventListener('click', showCardsMeme));
}

function showCardsMeme() {
    if (isBlockedClickCards) return;
    this.classList.add('roll');
    if (!isRolledCard) {
        isRolledCard = true;
        firstCard = this;
        return;
    }

    if (firstCard != null && this != firstCard) {
        secondCard = this;
        checkCards();
    }
    return;
}

function checkCards() {
    moves++;
    isTimesGoal ? movesCounter.textContent = `${moves}` : movesCounter.textContent = `${moves}/${movesGoal}`;

    if (isMovesGoal && moves >= movesGoal) {
        gameOver();
        return;
    }

    if ((isMovesGoal && moves < movesGoal) || (isTimesGoal && minutes > 0 || seconds > 0)) {
        if (firstCard.getAttribute('data-id') === secondCard.getAttribute('data-id')) {
            firstCard.removeEventListener('click', showCardsMeme);
            secondCard.removeEventListener('click', showCardsMeme);
            matchedPairs++;
            if (matchedPairs === totalPairs) {
                gameOver();
            }
            reset();
            return;
        }
        showCardsCover();
    } else {
        gameOver();
    }
}

function showCardsCover() {
    isBlockedClickCards = true;
    setTimeout(() => {
        firstCard.classList.remove('roll');
        secondCard.classList.remove('roll');
        reset();
    }, 900);
}

function reset() {
    isRolledCard = false;
    isBlockedClickCards = false;
    firstCard = null;
    secondCard = null;
}

function gameOver() {
    if (isTimesGoal) {
        const timeSpent = timeGoal * 60 - convertTimeToSeconds(timer.textContent);
        const mins = Math.floor(timeSpent / 60);
        const secs = timeSpent % 60;
        time = formatTime(mins, secs);
    }
    else {
        time = timer.textContent;
    }

    stopTimer();
    memeContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    checkResult();

    resultContainer.innerHTML = ` <div class="result_text">${resultGame}</div> 
    <div class="result_img"> <img src="${gif}"> </div>
    <div class="moves">Your moves: ${moves}</div>
    <div class="time">Your time: ${time}</div>
    <button class="restart_btn">Play again</button> `

    if (resultGame === 'You win!') {
        saveResult(moves, time);
    }
    displayResults();

    const restartBtn = document.querySelector('.restart_btn');
    restartBtn.addEventListener('click', () => {
        stopTimer();
        restartGame();
        rules.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        createCards();
    });
}

function countdownTimer() {
    minutes = timeGoal;
    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                stopTimer();
                timer.textContent = "00:00";
                gameOver();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        timer.textContent = formatTime(minutes, seconds);
    }, 1000);
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        timer.textContent = formatTime(minutes, seconds);
    }, 1000);
}

function formatTime(minutes, seconds) {
    let min = minutes < 10 ? `0${minutes}` : minutes;
    let sec = seconds < 10 ? `0${seconds}` : seconds;
    return `${min}:${sec}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function saveResult(moves, time) {
    let allResults = JSON.parse(localStorage.getItem('gameResults')) || {};

    if (!allResults[difficulty]) {
        allResults[difficulty] = [];
    }

    allResults[difficulty].push({ moves, time, date: new Date().toLocaleString() });

    allResults[difficulty].sort((a, b) => {
        if (a.moves === b.moves) {
            return convertTimeToSeconds(a.time) - convertTimeToSeconds(b.time);
        }
        return a.moves - b.moves;
    });

    if (allResults[difficulty].length > 10) {
        allResults[difficulty] = allResults[difficulty].slice(0, 10);
    }

    localStorage.setItem('gameResults', JSON.stringify(allResults));
}

function displayResults() {
    let allResults = JSON.parse(localStorage.getItem('gameResults')) || {};

    let results = allResults[difficulty] || [];

    const statisticContainer = document.querySelector('.statistic');
    statisticContainer.innerHTML = `<div class="header">The best players, level ${difficulty}:</div>`;

    results.forEach((result, index) => {
        const resultCard = document.createElement('div');
        resultCard.classList.add('result_card');

        resultCard.innerHTML = `
            <div class="position">#${index + 1}</div>
            <div class="moves">Moves: ${result.moves}</div>
            <div class="time">Time: ${result.time}</div>
            <div class="date">${result.date}</div>
        `;

        statisticContainer.appendChild(resultCard);
    });
}

function restartGame() {
    reset();
    stopTimer();
    timer.textContent = '00:00';
    matchedPairs = 0;
    moves = 0;
    time = 0;
    seconds = 0;
    minutes = 0;
}

function convertTimeToSeconds(time) {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
}

function checkResult() {
    if (isMovesGoal) {
        if (moves < movesGoal && totalPairs == matchedPairs) {
            win();
        } else {
            lose();
        }
    }

    if (isTimesGoal) {
        const [min, sec] = timer.textContent.split(':').map(Number);
        const currentTimeInSeconds = min * 60 + sec;
        const timeGoalInSeconds = timeGoal * 60;

        if (totalPairs == matchedPairs && minutes > 0 || seconds > 0) {
            win();
        } else {
            lose();
        }
    }
}

function win() {
    resultGame = 'You win!';
    gif = './assets/gif/victory.gif';
}
function lose() {
    resultGame = 'You lose';
    gif = './assets/gif/loss.gif';
}