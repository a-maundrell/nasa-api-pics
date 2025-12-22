'use strict';

const count = 10;
// You can change the query term to fetch different images: galaxy, mars, stars, etc.
const query = 'nebula'; 
const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${count}`;

let resultsArray = [];

// function displayResults() {}

async function getNasaPictures() {
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    console.log(resultsArray);
    // displayResults();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getNasaPictures();