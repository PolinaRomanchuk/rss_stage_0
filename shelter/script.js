let burgerIcon = document.querySelector(".burger-menu");
let burgerMenu = document.querySelector(".mobile-menu");
let burgerMenuContainer = document.querySelector(".mobile-menu_container");
let navigationLinks = document.querySelectorAll('.mobile-menu_navigation_link');
let body = document.querySelector("body");


burgerIcon.onclick = function (e) {
    toggleMenu();
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

burgerMenu.onclick = function (e) {
    if (!e.target.closest('.mobile-menu_container')) { toggleMenu(); }
}

function toggleMenu() {
    burgerIcon.classList.toggle('clicked');
    burgerMenu.classList.toggle('clicked');
    body.classList.toggle('clicked');
}

