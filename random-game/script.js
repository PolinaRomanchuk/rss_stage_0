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
const fullMemeList = [...memeList, ...memeList];


const memeContainer = document.querySelector('.cards_container');

let isRolledCard = false;
let isBlockedClickCards = false;
let firstCard, secondCard = null;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createCards() {
    const shuffledMemes = shuffle(fullMemeList);

    for (let meme of shuffledMemes) {
        let memeCard = document.createElement('div');
        memeCard.className = "card_container";
        memeCard.setAttribute('data-id', meme.id);

        memeCard.innerHTML = `
        <img class="front_card" src="./assets/img/cover.png" alt="card"> 
        <img class="back_card" src="${meme.img}" alt="card">`;

        memeContainer.appendChild(memeCard);
    }
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
    if (firstCard.getAttribute('data-id') === secondCard.getAttribute('data-id')) {
        firstCard.removeEventListener('click', showCardsMeme);
        secondCard.removeEventListener('click', showCardsMeme);
        reset();
        return;
    }
    showCardsCover();
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

createCards();

