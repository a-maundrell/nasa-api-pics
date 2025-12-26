'use strict';

const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const noFavorites = document.querySelector('.no-favorites');

let page = 1;
const pageSize = 8;
// You can change the query term to fetch different images: galaxy, mars, stars, etc.
const query = 'nebula'; 
function buildApiUrl() {
  return `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${pageSize}&page=${page}`;
}

let resultsArray = {};
let resultsItems = [];
let favorites = {};

const toastVisibleMs = 3000;
const toastFadeMs = 700;

function showToast(el, visibleMs = toastVisibleMs) {
  if (!el) return;

  el.classList.remove('hidden');
  requestAnimationFrame(() => el.classList.add('show'));

  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.classList.add('hidden'), toastFadeMs);
  }, visibleMs);
}

function saveFavoritesToLocalStorage() {
  localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
}

function getFavoritesFromLocalStorage() {
  const storedFavorites = localStorage.getItem('nasaFavorites');
  favorites = storedFavorites ? JSON.parse(storedFavorites) : {};
}

function showFavoritesPage() {
  resultsNav.classList.add('hidden');
  favoritesNav.classList.remove('hidden');
  updateDOM('favorites');
}

function updateDOM(mode = 'results', append = false, renderItems = null) {
  if (!append) imagesContainer.textContent = '';

  const items = renderItems ?? (mode === 'favorites' ? Object.values(favorites) : resultsItems);

  if (mode === 'favorites' && items.length === 0) {
    showToast(noFavorites);
    return;
  }

  items.forEach((result) => {
    const data = result.data?.[0];
    const imgHref = result.links?.[0]?.href;

    if (!data || !imgHref) return;

    const itemKey = data.nasa_id;

    // Card
    const card = document.createElement('div');
    card.classList.add('card');

    // Link wraps img
    const link = document.createElement('a');
    link.href = imgHref;
    link.title = 'View Full Image';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    // Image
    const image = document.createElement('img');
    image.src = imgHref;
    image.alt = data.title || 'NASA Image';
    image.loading = 'lazy';
    image.classList.add('card-image-top');

    link.appendChild(image);
    card.appendChild(link);

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = data.title || 'Untitled';

    const favoriteSpan = document.createElement('span');
    favoriteSpan.title = favorites[itemKey] ? 'Remove from Favorites' : 'Add to Favorites';

    const favoriteIcon = document.createElement('i');
    favoriteIcon.classList.add('fa-heart', 'favorite');
    favoriteIcon.classList.toggle('fa-solid', !!favorites[itemKey]);
    favoriteIcon.classList.toggle('fa-regular', !favorites[itemKey]);

    favoriteIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (favorites[itemKey]) {
        delete favorites[itemKey];
      } else {
        favorites[itemKey] = result;
      }

      saveFavoritesToLocalStorage();

      favoriteSpan.title = favorites[itemKey] ? 'Remove from Favorites' : 'Add to Favorites';

      if (favorites[itemKey]) {
        showToast(saveConfirmed);
      }

      updateDOM(mode);
    });

    favoriteSpan.appendChild(favoriteIcon);    

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = data.description || 'No description provided.';
    
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(favoriteSpan);
    cardBody.appendChild(cardText);

    // Date, Author and Copyright Info
    const small = document.createElement('small');
    small.classList.add('text-muted');
    
    const strong = document.createElement('strong');
    const date = (data.date_created || '').split('T')[0];
    strong.textContent = date || 'Unknown Date';

    const author = document.createElement('span');
    author.textContent = data.secondary_creator || 'NASA';

    const copyright = document.createElement('span');
    copyright.textContent = ' \u00A9';

    small.appendChild(strong);
    small.appendChild(document.createTextNode(' • '));
    small.appendChild(author);
    small.appendChild(copyright);

    cardBody.appendChild(small);
    card.appendChild(cardBody);
    imagesContainer.appendChild(card);
  });
}

async function getNasaPictures(append = false) {
  try {
    loader.classList.remove('hidden');

    const response = await fetch(buildApiUrl());

    if(!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${text.slice(0, 150)}`);
    }

    resultsArray = await response.json();
    const newItems = resultsArray?.collection?.items || [];
    
    const existingIds = new Set(resultsItems.map(item => item.data?.[0]?.nasa_id).filter(Boolean));

    const filteredNewItems = newItems.filter(item => {
      const id = item.data?.[0]?.nasa_id;
      return id && !existingIds.has(id);
    });

    if (append) {
      resultsItems = [...resultsItems, ...filteredNewItems];
      updateDOM('results', true, filteredNewItems);
    } else {
      resultsItems = newItems;
      updateDOM('results', false);
    }
    
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    loader.classList.add('hidden');
  }
}

document.getElementById('showFavorites').addEventListener('click', showFavoritesPage);
document.getElementById('showResults').addEventListener('click', showResultsPage);

document.getElementById('loadMore').addEventListener('click', () => {
  page += 1;
  getNasaPictures(true);
});

function showResultsPage() {
  page = 1;
  resultsNav.classList.remove('hidden');
  favoritesNav.classList.add('hidden');
  getNasaPictures(false);
}

getFavoritesFromLocalStorage();
getNasaPictures();