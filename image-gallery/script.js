const CLIENT_ID = "a3Y_rXlBg-GXsAltTCNP_LGt55qIJ-8O5EJeR-MHCGs";
let category = "cat";

const photosContainer = document.querySelector('.photos_container');
const topicsContainer = document.querySelector('.topics_container');
const inputField = document.querySelector('input');
const searchBTN = document.querySelector('.search_button');
const deleteBTN = document.querySelector('.icon_delete');

const hiddenMenuBTH = document.querySelector('.left');
const showMenuBTH = document.querySelector('.right');


const navTopicsMenu = document.querySelector('.navigation_topics_menu');


function getURLByCategory(category) {
    return `https://api.unsplash.com/search/photos?query=${category}&per_page=20&orientation=landscape&client_id=${CLIENT_ID}`;
}

async function getPhotos() {
    const res = await fetch(getURLByCategory(category));
    const data = await res.json();

    if (data.results && data.results.length > 0) {
        showPhotos(data.results);
    } else {
        showError();
    }
}

function showError(){
    photosContainer.innerHTML = `
    <div class="error_container">
    <span>Nothing was found on the search. Try another option.</span>
    <img src="./assets/img/error.png" alt="error img">
    </div>
    `
    
    ;
}


function showPhotos(photos) {
    photosContainer.innerHTML = '';

    photos.map(({ urls: { regular } }) => {
        let photo = document.createElement('div');
        photo.className = "photo_container";
        photo.innerHTML = `<img src="${regular}">`
        photosContainer.appendChild(photo);
    })
}

async function getTopics() {
    const url = `https://api.unsplash.com/topics?per_page=20&client_id=${CLIENT_ID}`;
    const res = await fetch(url);
    const data = await res.json();
    showTopics(data);
}

function showTopics(topics) {
    topics.forEach(({ title }) => {
        let tag = document.createElement('button');
        tag.className = "tag_btn"
        tag.textContent = title;
        topicsContainer.appendChild(tag);
    })
    const topicsBNT = document.querySelectorAll('.tag_btn');
    topicsBNT.forEach(topic => {
        topic.addEventListener('click', () => {
            category = topic.textContent;
            inputField.value = topic.textContent;
            getPhotos();
        })
    })
}

searchBTN.addEventListener('click', () => {
    category = inputField.value;
    getPhotos();
})

deleteBTN.addEventListener('click', () => {
    inputField.value = '';
})

inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        category = inputField.value;
        getPhotos();
    }
});

hiddenMenuBTH.addEventListener('click', () => {
    toggleMenu();
});

showMenuBTH.addEventListener('click', () => {
    toggleMenu();
});

function toggleMenu() {
    navTopicsMenu.classList.toggle('hidden');
    photosContainer.classList.toggle('full_width');
    showMenuBTH.classList.toggle('active');
}

function checkWindowSize() {
    let isSmallScreen = window.innerWidth <= 630;
    navTopicsMenu.classList.toggle('hidden', isSmallScreen);
    photosContainer.classList.toggle('full_width', isSmallScreen);
    showMenuBTH.classList.toggle('active', isSmallScreen);
}

getPhotos();
getTopics();

window.addEventListener('resize', checkWindowSize);
window.addEventListener('DOMContentLoaded', checkWindowSize);