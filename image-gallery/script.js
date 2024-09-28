const CLIENT_ID = "a3Y_rXlBg-GXsAltTCNP_LGt55qIJ-8O5EJeR-MHCGs";
let category = "cat";

const photosContainer = document.querySelector('.photos_container');
const topicsContainer = document.querySelector('.topics_container');
const inputField = document.querySelector('input');
const searchBTN = document.querySelector('.icon-search_button');
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
    showPhotos(data.results);
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
    navTopicsMenu.classList.add('hidden');
    photosContainer.classList.add('full_width');
    showMenuBTH.classList.add('active');
});

showMenuBTH.addEventListener('click', () => {
    navTopicsMenu.classList.remove('hidden');
    photosContainer.classList.remove('full_width');
    showMenuBTH.classList.remove('active');
});

getPhotos();
getTopics();
