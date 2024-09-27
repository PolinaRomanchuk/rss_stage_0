let category = "cat";

const photoContainer = document.querySelector('.photos_container');
let input = document.querySelector('input');
let searchBTN = document.querySelector('.icon-search_button');
let deleteBTN = document.querySelector('.icon_delete');

function getURL(category) {
    return `https://api.unsplash.com/search/photos?query=${category}&per_page=20&orientation=landscape&client_id=a3Y_rXlBg-GXsAltTCNP_LGt55qIJ-8O5EJeR-MHCGs`;
}

async function getPhotos() {
    const res = await fetch(getURL(category));
    const data = await res.json();
    showPhotos(data.results);
}

function showPhotos(photos) {
    photoContainer.innerHTML = '';

    photos.map(({ urls: { regular } }) => {
        let photo = document.createElement('div');
        photo.className = "photo_container";
        photo.innerHTML = `<img src="${regular}">`
        photoContainer.appendChild(photo);
    })
}

searchBTN.addEventListener('click', () => {
    category = input.value;
    getPhotos();
})

deleteBTN.addEventListener('click', () => {
    input.value = '';
})

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        category = input.value;
        getPhotos();
    }
});

getPhotos();