# NASA Image Explorer

A client-side web application that fetches and displays images from NASA’s public image library.  
Users can browse results, load additional images, and save favorites locally for later viewing.

---

## ✨ Features

- Fetches images from NASA’s public Images API
- Dynamic image cards with titles, descriptions, and metadata
- “Load More” pagination
- Favorite images saved to `localStorage`
- Toggle between results and favorites views
- Loading indicator during API requests
- Responsive layout for desktop and mobile

---

## 🧰 Tech Stack

- **HTML5**
- **CSS3 (Vanilla CSS)**
- **JavaScript (ES6+)**
- **NASA Images API**
- **Font Awesome**

---

## 🔄 API Adaptation & Problem Solving

The original project course relied on a NASA API that was no longer functioning.  
Instead of abandoning the project, I:

- Researched available NASA APIs
- Identified the **NASA Images API** as a viable replacement
- Adapted the data model to a **completely different response structure**
- Refactored the application logic to handle nested metadata, pagination, and image links

This required reworking:
- Data parsing
- DOM rendering logic
- Pagination and duplicate filtering
- Favorites storage structure

The final result preserves the intended functionality while using a modern, stable API.

---

## 🖥️ How It Works (High Level)

- Images are fetched from the NASA Images API using `fetch`
- Results are rendered dynamically into reusable card components
- Favorites are stored in `localStorage` using NASA image IDs as keys
- Duplicate images are filtered when loading additional pages
- UI state toggles between “Results” and “Favorites” without page reloads

---

## ▶️ How to Run

No build tools or dependencies required.

1. Clone or download the repository
2. Open `index.html` in your browser
