let burgerIcon = document.querySelector(".burger-menu");
let burgerMenu = document.querySelector(".mobile-menu");
let burgerNavigationLinks = document.querySelectorAll('.mobile-menu_navigation_link');
let body = document.querySelector("body");
let modalWindow = document.querySelector(".modal-window");
let closeButton = document.querySelector(".modal-window_close");
let sliderPetsContainer = document.querySelector(".pets-page_pet-carts_container");
let sliderArrows = document.querySelectorAll(".slider-arrow");
let previousWidth = window.innerWidth;
let sliderCartsNumber = 0;
let currentPetsinSlider = [];
let previousPetsinSlider = null;
let isTransitioning = false;

let paginatorPetsContainer = document.querySelector(".pets-page_pet-carts_container__our-pets-page");
let paginatorButton = document.querySelectorAll(".btn-paginator");
let activePaginatorButton = document.querySelector(".btn-paginator.active");
let petsCartsNumberPerPageinPaginator = 0;
let maxPagesNumberinPaginator = 0;
let activePageNumber = 1;
let currentPageNumber = 1;
const petsListinPaginator = [];


async function getPetsData() {
    const response = await fetch('../shelter/assets/dataPets.json');
    const data = await response.json();
    return data;
}

async function getRandomPetsForSlider(number) {
    const datapets = await getPetsData();
    let randomPetsList = [];
    while (randomPetsList.length != number) {
        let randomIndex = Math.floor(Math.random() * datapets.length);
        let randomPet = datapets[randomIndex];
        if ((!randomPetsList.some(pet => pet.name === randomPet.name)) && (!currentPetsinSlider.some(pet => pet.name === randomPet.name))) {
            randomPetsList.push(randomPet);
        }
    }
    return randomPetsList;
}

function getCartsNumberForSlider() {
    if (window.innerWidth <= 710) {
        return 1;
    } else if (window.innerWidth <= 1260) {
        return 2;
    } else {
        return 3;
    }
}

function createCart(pet, className) {
    let cart = document.createElement('div');
    cart.className = className;

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

    const petsNumber = getCartsNumberForSlider();
    let newPetsList;

    if (direction === 'right') {
        previousPetsinSlider = [...currentPetsinSlider].reverse();
        newPetsList = await getRandomPetsForSlider(petsNumber);
        currentPetsinSlider = newPetsList;

    } else if (direction === 'left') {
        if (previousPetsinSlider) {
            newPetsList = previousPetsinSlider;
            previousPetsinSlider = null;
            currentPetsinSlider = newPetsList;
        } else {
            newPetsList = await getRandomPetsForSlider(petsNumber);
            currentPetsinSlider = newPetsList;
        }
    }

    let newCarts = newPetsList.map(pet => createCart(pet, 'pets-page_pet-cart'));

    if (direction === 'right') {
        newCarts.forEach(cart => sliderPetsContainer.append(cart));
        sliderPetsContainer.classList.add('slider-move-right');

        sliderPetsContainer.addEventListener('transitionend', () => {
            for (let i = 0; i < sliderCartsNumber; i++) {
                sliderPetsContainer.firstElementChild.remove();
            }
            sliderPetsContainer.classList.remove('slider-move-right');
            isTransitioning = false;
        }, { once: true });


    } else if (direction === 'left') {
        newCarts.forEach(cart => sliderPetsContainer.prepend(cart));
        sliderPetsContainer.classList.add('slider-reset');
        sliderPetsContainer.classList.remove('slider-move-left');
        requestAnimationFrame(() => {
            setTimeout(() => {
                sliderPetsContainer.classList.remove('slider-reset');
                sliderPetsContainer.classList.add('slider-move-left');
            }, 0);
        });

        sliderPetsContainer.addEventListener('transitionend', () => {
            for (let i = 0; i < petsNumber; i++) {
                sliderPetsContainer.lastElementChild.remove();
            }
            sliderPetsContainer.classList.remove('slider-move-left');
            isTransitioning = false;
        }, { once: true });
    }
}

sliderArrows.forEach(arrow => {
    arrow.addEventListener('click', (e) => {
        let direction = e.target.classList.contains('left') ? 'left' : 'right';
        slideCarousel(direction);
    });
});

async function drawCartsinSlider(initialLoad = false) {
    const newCartsNumber = getCartsNumberForSlider();

    if (initialLoad || (window.innerWidth < previousWidth && newCartsNumber !== sliderCartsNumber)) {
        sliderCartsNumber = newCartsNumber;
        const petsInSlider = await getRandomPetsForSlider(sliderCartsNumber);
        sliderPetsContainer.innerHTML = '';
        petsInSlider.forEach(pet => {
            let cart = createCart(pet, 'pets-page_pet-cart');
            sliderPetsContainer.append(cart);
        });
        currentPetsinSlider = [...petsInSlider];
    }
    previousWidth = window.innerWidth;
}

async function getAllPetsinPaginator(number) {
    const datapets = await getPetsData();
    let allPetsInPaginator = Array(6).fill(datapets).flat();
    allPetsInPaginator.sort(() => Math.random() - 0.5);
    while (allPetsInPaginator.length) {
        let pagePets = [];

        while (pagePets.length < 8 && allPetsInPaginator.length) {
            let pet = allPetsInPaginator.shift();

            if (!pagePets.some(p => p.name === pet.name)) {
                pagePets.push(pet);
            } else {
                allPetsInPaginator.push(pet);
            }
        }
        petsListinPaginator.push(...pagePets);
    }
    maxPagesNumberinPaginator = 48 / number;
}

function getCartsNumberinPaginator() {
    if (window.innerWidth <= 600) {
        return 3;
    } else if (window.innerWidth <= 1080) {
        return 6;
    } else {
        return 8;
    }
}

async function drawCartsinPaginator(activePage) {
    petsCartsNumberPerPageinPaginator = getCartsNumberinPaginator();
    let startindex = (petsCartsNumberPerPageinPaginator * activePage) - petsCartsNumberPerPageinPaginator;
    let pets = petsListinPaginator.slice([startindex], [petsCartsNumberPerPageinPaginator * activePage]);
    paginatorPetsContainer.innerHTML = '';
    pets.forEach(pet => {
        let cart = createCart(pet, 'pets-page_pet-cart our-pets-page');
        paginatorPetsContainer.append(cart);
    });
}

function resetPaginator() {
    activePaginatorButton.textContent = 1;
    activePageNumber = 1;
    currentPageNumber = 1;
    document.querySelector(".btn-paginator.to-first").classList.add('inactive');
    document.querySelector(".btn-paginator.prev").classList.add('inactive');
    document.querySelector(".btn-paginator.next").classList.remove('inactive');
    document.querySelector(".btn-paginator.to-last").classList.remove('inactive');
}

paginatorButton.forEach(btn => btn.addEventListener('click', (e) => {
    currentPageNumber = parseInt(activePaginatorButton.textContent, 10);
    if (e.target.classList.contains('next')) {
        if (currentPageNumber < maxPagesNumberinPaginator) {
            activePageNumber++;
            currentPageNumber++;
            activePaginatorButton.textContent = currentPageNumber;
            drawCartsinPaginator(activePageNumber);
        }
        if (currentPageNumber > 1) {
            document.querySelector(".btn-paginator.prev").classList.remove('inactive');
            document.querySelector(".btn-paginator.to-first").classList.remove('inactive');
        }
        if (currentPageNumber == maxPagesNumberinPaginator) {
            e.target.classList.add('inactive');
            document.querySelector(".btn-paginator.to-last").classList.add('inactive');
        }
    }

    if (e.target.classList.contains('prev')) {
        if (currentPageNumber > 1) {
            activePageNumber--;
            currentPageNumber--;
            activePaginatorButton.textContent = currentPageNumber;
            drawCartsinPaginator(activePageNumber);
        }
        if (currentPageNumber == 1) {
            document.querySelector(".btn-paginator.prev").classList.add('inactive');
            document.querySelector(".btn-paginator.to-first").classList.add('inactive');
        }
        if (currentPageNumber < maxPagesNumberinPaginator) {
            document.querySelector(".btn-paginator.to-last").classList.remove('inactive');
            document.querySelector(".btn-paginator.next").classList.remove('inactive');
        }
    }

    if (e.target.classList.contains('to-last')) {
        activePaginatorButton.textContent = maxPagesNumberinPaginator;
        activePageNumber = maxPagesNumberinPaginator;
        currentPageNumber = maxPagesNumberinPaginator;
        e.target.classList.add('inactive');
        document.querySelector(".btn-paginator.next").classList.add('inactive');
        document.querySelector(".btn-paginator.prev").classList.remove('inactive');
        document.querySelector(".btn-paginator.to-first").classList.remove('inactive');
        drawCartsinPaginator(activePageNumber);
    }

    if (e.target.classList.contains('to-first')) {
        activePaginatorButton.textContent = 1;
        activePageNumber = 1;
        e.target.classList.add('inactive');
        document.querySelector(".btn-paginator.prev").classList.add('inactive');
        document.querySelector(".btn-paginator.next").classList.remove('inactive');
        document.querySelector(".btn-paginator.to-last").classList.remove('inactive');
        drawCartsinPaginator(activePageNumber);
    }
}))


burgerIcon.onclick = function (e) {
    toggleMenu();
}
burgerMenu.onclick = function (e) {
    if (!e.target.closest('.mobile-menu_container')) { toggleMenu(); }
}

burgerNavigationLinks.forEach(link => {
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

window.addEventListener('load', async () => {
    drawCartsinSlider(true);
    await getAllPetsinPaginator(getCartsNumberinPaginator());
    drawCartsinPaginator(1);
});

window.addEventListener('resize', async () => {
    drawCartsinSlider;
    const newCartsNumber = getCartsNumberinPaginator();
    if (newCartsNumber !== petsCartsNumberPerPageinPaginator) {
        petsCartsNumberPerPageinPaginator = newCartsNumber;
        maxPagesNumberinPaginator = 48 / petsCartsNumberPerPageinPaginator;
        resetPaginator();
        drawCartsinPaginator(1);
    }
});