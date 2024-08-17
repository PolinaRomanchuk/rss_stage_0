let burgerIcon = document.querySelector(".burger-menu");
let burgerMenu = document.querySelector(".mobile-menu");
let burgerMenuContainer = document.querySelector(".mobile-menu_container");
let navigationLinks = document.querySelectorAll('.mobile-menu_navigation_link');
let body = document.querySelector("body");
let petCarts = document.querySelectorAll(".pets-page_pet-cart");
let modalWindow = document.querySelector(".modal-window");
let modalWindowContent = document.querySelector(".modal-window_content");
let closeButton = document.querySelector(".modal-window_close");

async function getPetsData() {
    const response = await fetch('../shelter/assets/dataPets.json');
    const data = await response.json();
    return data;
}

burgerIcon.onclick = function (e) {
    toggleMenu();
}
burgerMenu.onclick = function (e) {
    if (!e.target.closest('.mobile-menu.clicked')) { toggleMenu(); }
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



petCarts.forEach(cart => {
    cart.onclick = async function (e) {
        let petname = cart.querySelector(".pet-cart-name").textContent;
        console.log(petname);
        let data = await getPetsData();
        let pet = data.find(p => p.name === petname);
        openModal(pet);
    }
})

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