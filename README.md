# 🎬 MovieHub

A sleek and performant mobile application for discovering movies, built with React Native and Expo. Browse, search, and filter through thousands of movies, view detailed information, and keep a list of your bookmarked favorites.

---

## ✨ Features

* **Discover & Browse:** Scroll through an infinite list of movies fetched from The Movie Database (TMDB).
* **Powerful Search:** Instantly search for any movie by title.
* **Advanced Filtering:** Filter the movie list by **Genre**, **Language**, and sort by **Popularity**, **Rating**, or **Release Date**.
* **Detailed Movie Info:** Tap on any movie to see a dedicated screen with its poster, backdrop, overview, rating, cast, and crew.
* **Watch Trailers:** Directly open the official movie trailer on YouTube.
* **Bookmarking:** Save your favorite movies for later. Your bookmarks are saved locally on your device.
* **Dark & Light Theme:** Switch between a sleek dark mode and a clean light mode.
* **Optimized Performance:** Built for a smooth user experience with high-performance components like `expo-image` for efficient image caching and `useCallback` to prevent unnecessary re-renders.

---

## 🛠️ Tech Stack

* **Framework:** React Native with Expo
* **Language:** TypeScript
* **Navigation:** Expo Router (File-based routing)
* **Data Fetching:** Axios for making requests to the TMDB API
* **UI Components:**
    * `@react-native-picker/picker` for dropdown filters
    * `expo-image` for high-performance image rendering
* **Local Storage:** `@react-native-async-storage/async-storage` for saving bookmarks

---
