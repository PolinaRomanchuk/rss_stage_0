let burgerIcon = document.querySelector(".burger-menu");
let burgerMenu = document.querySelector(".mobile-menu");
let burgerMenuContainer = document.querySelector(".mobile-menu_container");
let navigationLinks = document.querySelectorAll('.mobile-menu_navigation_link');
let body = document.querySelector("body");
let petCarts = document.querySelectorAll(".pets-page_pet-cart");
let modalWindow = document.querySelector(".modal-window");
let modalWindowContent = document.querySelector(".modal-window_content");
let closeButton = document.querySelector(".modal-window_close");
let petsContainer = document.querySelector(".pets-page_pet-carts_container");
let arrows = document.querySelectorAll(".slider-arrow");

let cartsNumber = 0;
let currentPets = [];
let previousPets = null;
let isTransitioning = false;

async function getPetsData() {
    const response = await fetch('../shelter/assets/dataPets.json');
    const data = await response.json();
    return data;
}

async function getRandomPets(number) {
    const datapets = await getPetsData();
    let randomPets = [];
    while (randomPets.length != number) {
        let randomIndex = Math.floor(Math.random() * datapets.length);
        let randomPet = datapets[randomIndex];
        if ((!randomPets.some(pet => pet.name === randomPet.name)) && (!currentPets.some(pet => pet.name === randomPet.name))) {
            randomPets.push(randomPet);
        }
    }
    return randomPets;
}

function getCartsNumber() {
    if (window.innerWidth <= 738) {
        cartsNumber = 1;
    } else if (window.innerWidth <= 1260) {
        cartsNumber = 2;
    } else {
        cartsNumber = 3;
    }
    return cartsNumber;
}

function createCart(pet) {
    let cart = document.createElement('div');
    cart.className = 'pets-page_pet-cart';

    cart.innerHTML = `
        <div class="pet-cart-photo">
            <img src="${pet.img}" alt="${pet.name} photo">
        </div>
        <div class="pet-cart-name">${pet.name}</div>
        <button class="pet-cart-button">Learn more</button>
    `;

    cart.onclick = async function () {
        let petname = cart.querySelector(".pet-cart-name").textContent;
        let data = await getPetsData();
        let pet = data.find(p => p.name === petname);
        openModal(pet);
    };

    return cart;
}

async function slideCarousel(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    const petsNumber = getCartsNumber();
    let newPets;

    if (direction === 'right') {
        previousPets = [...currentPets].reverse();

        newPets = await getRandomPets(petsNumber);
        currentPets = newPets;
    } else if (direction === 'left') {
        if (previousPets) {
            newPets = previousPets;
            previousPets = null;
            currentPets = newPets;
        } else {
            newPets = await getRandomPets(petsNumber);
            currentPets = newPets;
        }
    }

    let newCarts = newPets.map(createCart);

    if (direction === 'right') {
        newCarts.forEach(cart => petsContainer.append(cart));
        petsContainer.classList.add('slider-move-right');

        petsContainer.addEventListener('transitionend', () => {
            for (let i = 0; i < cartsNumber; i++) {
                petsContainer.firstElementChild.remove();
            }
            petsContainer.classList.remove('slider-move-right');
            isTransitioning = false;
        }, { once: true });


    } else if (direction === 'left') {
        newCarts.forEach(cart => petsContainer.prepend(cart));

        petsContainer.classList.add('slider-reset'); 
        petsContainer.classList.remove('slider-move-left');
        requestAnimationFrame(() => {
            setTimeout(() => {
                petsContainer.classList.remove('slider-reset');
                petsContainer.classList.add('slider-move-left');
            }, 0);
        });

        petsContainer.addEventListener('transitionend', () => {
            for (let i = 0; i < petsNumber; i++) {
                petsContainer.lastElementChild.remove();
            }
            petsContainer.classList.remove('slider-move-left');
            isTransitioning = false;
        }, { once: true });
    }
}

arrows.forEach(arrow => {
    arrow.addEventListener('click', (e) => {
        let direction = e.target.classList.contains('left') ? 'left' : 'right';
        slideCarousel(direction);
    });
});

async function drawCarts() {
    const petsInSlider = await getRandomPets(getCartsNumber());
    petsContainer.innerHTML = '';
    petsInSlider.forEach(pet => {
        let cart = createCart(pet);
        petsContainer.append(cart);
    });
    currentPets = [...petsInSlider];
}

window.addEventListener('load', drawCarts);
window.addEventListener('resize', drawCarts);














burgerIcon.onclick = function (e) {
    toggleMenu();
}
burgerMenu.onclick = function (e) {
    if (!e.target.closest('.mobile-menu_container')) { toggleMenu(); }
}

navigationLinks.forEach(link => {
    link.onclick = function (e) {
        let linkPath = this.getAttribute('href');

        if (linkPath != null && linkPath.startsWith('#')) {
            e.preventDefault();
            toggleMenu();
            setTimeout(() => {
                document.querySelector(linkPath).scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
        else if (linkPath == null) {
            toggleMenu();
        }
        else {
            e.preventDefault();
            toggleMenu();
            setTimeout(() => {
                window.location.href = linkPath;
            }, 300);
        }
    }
});



closeButton.onclick = function (e) {
    closeWindow();
}

function openModal(pet) {
    fillModal(pet);
    body.classList.toggle('clicked');
    modalWindow.classList.add('clicked');
}

function fillModal(pet) {
    document.querySelector('.modal-window-photo').src = pet.img;
    document.querySelector('.modal-window_pet-name').textContent = pet.name;
    document.querySelector('.modal-window_animal').textContent = `${pet.type} - ${pet.breed}`;
    document.querySelector('.modal-window_description').textContent = pet.description;
    document.querySelector('.modal-window_age').textContent = pet.age;
    document.querySelector('.modal-window_inoculations').textContent = pet.inoculations;
    document.querySelector('.modal-window_diseases').textContent = pet.diseases;
    document.querySelector('.modal-window_parasites').textContent = pet.parasites;
}

modalWindow.onclick = function (e) {
    if (!e.target.closest('.modal-window_content')) { closeWindow(); }
}

function toggleMenu() {
    burgerIcon.classList.toggle('clicked');
    burgerMenu.classList.toggle('clicked');
    body.classList.toggle('clicked');
}

function closeWindow(e) {
    body.classList.remove('clicked');
    modalWindow.classList.remove('clicked');
}

