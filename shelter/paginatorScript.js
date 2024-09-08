let ourPetsContainer = document.querySelector(".pets-page_pet-carts_container__our-pets-page");
let btnpaginator = document.querySelectorAll(".btn-paginator");
let activeBtn = document.querySelector(".btn-paginator.active");
let petsCartsNumberPerPage = 0;
let maxPagesNumber = 0;
let activePage = 1;
let currentValuePaginatorPage = 1;
const petsList = [];




let burgerIcon = document.querySelector(".burger-menu");
let burgerMenu = document.querySelector(".mobile-menu");
let burgerMenuContainer = document.querySelector(".mobile-menu_container");
let navigationLinks = document.querySelectorAll('.mobile-menu_navigation_link');
let body = document.querySelector("body");
let petCarts = document.querySelectorAll(".pets-page_pet-cart");
let modalWindow = document.querySelector(".modal-window");
let modalWindowContent = document.querySelector(".modal-window_content");
let closeButton = document.querySelector(".modal-window_close");
let previousWidth = window.innerWidth;





async function getPetsData() {
    const response = await fetch('../shelter/assets/dataPets.json');
    const data = await response.json();
    return data;
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
        petsList.push(...pagePets);
    }

    maxPagesNumber = 48 / number;

    console.log(petsList);
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


async function drawCartsinPaginator(activePage) {
    petsCartsNumberPerPage = getCartsNumberinPaginator();

    let startindex = (petsCartsNumberPerPage * activePage) - petsCartsNumberPerPage;

    let pets = petsList.slice([startindex], [petsCartsNumberPerPage * activePage]);

    ourPetsContainer.innerHTML = '';
    pets.forEach(pet => {
        let cart = createCart(pet, 'pets-page_pet-cart our-pets-page');
        ourPetsContainer.append(cart);
    });

}


function resetPaginator() {
    activeBtn.textContent = 1;
    activePage = 1;
    currentValuePaginatorPage = 1;

    document.querySelector(".btn-paginator.to-first").classList.add('inactive');
    document.querySelector(".btn-paginator.prev").classList.add('inactive');
    document.querySelector(".btn-paginator.next").classList.remove('inactive');
    document.querySelector(".btn-paginator.to-last").classList.remove('inactive');

}


btnpaginator.forEach(btn => btn.addEventListener('click', (e) => {
    currentValuePaginatorPage = parseInt(activeBtn.textContent, 10);
    if (e.target.classList.contains('next')) {
        if (currentValuePaginatorPage < maxPagesNumber) {
            activePage++;
            currentValuePaginatorPage++;
            activeBtn.textContent = currentValuePaginatorPage;
            drawCartsinPaginator(activePage);
        }
        if (currentValuePaginatorPage > 1) {
            document.querySelector(".btn-paginator.prev").classList.remove('inactive');
            document.querySelector(".btn-paginator.to-first").classList.remove('inactive');
        }
        if (currentValuePaginatorPage == maxPagesNumber) {
            e.target.classList.add('inactive');
            document.querySelector(".btn-paginator.to-last").classList.add('inactive');
        }
    }

    if (e.target.classList.contains('prev')) {
        if (currentValuePaginatorPage > 1) {
            activePage--;
            currentValuePaginatorPage--;
            activeBtn.textContent = currentValuePaginatorPage;
            drawCartsinPaginator(activePage);
        }
        if (currentValuePaginatorPage == 1) {
            document.querySelector(".btn-paginator.prev").classList.add('inactive');
            document.querySelector(".btn-paginator.to-first").classList.add('inactive');
        }
        if (currentValuePaginatorPage < maxPagesNumber) {
            document.querySelector(".btn-paginator.to-last").classList.remove('inactive');
            document.querySelector(".btn-paginator.next").classList.remove('inactive');
        }
    }

    if (e.target.classList.contains('to-last')) {
        activeBtn.textContent = maxPagesNumber;
        activePage = maxPagesNumber;
        currentValuePaginatorPage = maxPagesNumber;

        e.target.classList.add('inactive');
        document.querySelector(".btn-paginator.next").classList.add('inactive');
        document.querySelector(".btn-paginator.prev").classList.remove('inactive');
        document.querySelector(".btn-paginator.to-first").classList.remove('inactive');
        drawCartsinPaginator(activePage);
    }
    if (e.target.classList.contains('to-first')) {
        activeBtn.textContent = 1;
        activePage = 1;

        e.target.classList.add('inactive');
        document.querySelector(".btn-paginator.prev").classList.add('inactive');
        document.querySelector(".btn-paginator.next").classList.remove('inactive');
        document.querySelector(".btn-paginator.to-last").classList.remove('inactive');
        drawCartsinPaginator(activePage);
    }

}))


window.addEventListener('load', async () => {
    await getAllPetsinPaginator(getCartsNumberinPaginator());
    drawCartsinPaginator(1);
});

window.addEventListener('resize', async () => {
    const newCartsNumber = getCartsNumberinPaginator();
    if (newCartsNumber !== petsCartsNumberPerPage) {
        petsCartsNumberPerPage = newCartsNumber;
        maxPagesNumber = 48 / petsCartsNumberPerPage;
        resetPaginator();
        drawCartsinPaginator(1);
    }
});












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

