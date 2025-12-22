'use strict';

const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 5;
// You can change the query term to fetch different images: galaxy, mars, stars, etc.
const query = 'nebula'; 
const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${count}`;

let resultsArray = {};
let resultsItems = [];

function updateDOM() {
  imagesContainer.textContent = '';

  resultsItems.forEach((result) => {
    const data = result.data?.[0];
    const imgHref = result.links?.[0]?.href;

    if (!data || !imgHref) {
      console.warn('Missing data or image link for result:', result);
      return;
    }
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

    const favouriteSpan = document.createElement('span');
    favouriteSpan.title = 'Add to Favourites';
    
    const favouriteIcon = document.createElement('i');
    favouriteIcon.classList.add('fa-regular', 'fa-heart', 'favourite');

    favouriteSpan.appendChild(favouriteIcon);    

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = data.description || 'No description provided.';
    
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(favouriteSpan);
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
    small.appendChild(document.createTextNode(' '));
    small.appendChild(author);
    small.appendChild(copyright);

    cardBody.appendChild(small);
    card.appendChild(cardBody);
    imagesContainer.appendChild(card);
  });
}

async function getNasaPictures() {
  try {
    const response = await fetch(apiUrl);
    if(!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${text.slice(0, 150)}`);
    }

    resultsArray = await response.json();
    console.log('Full response:', resultsArray);

    resultsItems = resultsArray?.collection?.items || [];
    console.log('Fetched items:', resultsItems);

    updateDOM();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getNasaPictures();