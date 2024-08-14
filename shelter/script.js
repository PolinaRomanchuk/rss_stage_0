let burgerIcon = document.querySelector(".burger-menu");
let burgerMenu = document.querySelector(".mobile-menu");


function rotateIcon (){
    burgerIcon.classList.toggle('clicked');
    burgerMenu.classList.toggle('clicked');
}