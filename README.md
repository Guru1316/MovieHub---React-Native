🎬 MovieHub
A sleek and performant mobile application for discovering movies, built with React Native and Expo. Browse, search, and filter through thousands of movies, view detailed information, and keep a list of your bookmarked favorites.

✨ Features
Discover & Browse: Scroll through an infinite list of movies fetched from The Movie Database (TMDB).

Powerful Search: Instantly search for any movie by title.

Advanced Filtering: Filter the movie list by Genre, Language, and sort by Popularity, Rating, or Release Date.

Detailed Movie Info: Tap on any movie to see a dedicated screen with its poster, backdrop, overview, rating, cast, and crew.

Watch Trailers: Directly open the official movie trailer on YouTube.

Bookmarking: Save your favorite movies for later. Your bookmarks are saved locally on your device.

Dark & Light Theme: Switch between a sleek dark mode and a clean light mode.

Optimized Performance: Built for a smooth user experience with high-performance components like expo-image for efficient image caching and useCallback to prevent unnecessary re-renders.

🛠️ Tech Stack
Framework: React Native with Expo

Language: TypeScript

Navigation: Expo Router (File-based routing)

Data Fetching: Axios for making requests to the TMDB API

UI Components:

@react-native-picker/picker for dropdown filters

expo-image for high-performance image rendering

Local Storage: @react-native-async-storage/async-storage for saving bookmarks

🚀 Get the App
You can install the latest version of the app directly on your Android device.

Scan the QR code below with your phone's camera or click the link.

Download the .apk file.

When prompted, allow your browser to "Install from unknown sources". This is a standard Android security step for apps outside the Play Store.

Direct Download Link: MovieHubApp.apk

🔧 Running the Project Locally
To run this project on your own machine for development, follow these steps:

1. Prerequisites

Node.js (LTS version)

Git

Expo Go app on your phone (optional, for quick testing)

2. Clone the Repository

Bash

git clone https://github.com/your-username/MovieHubApp.git
cd MovieHubApp
3. Install Dependencies

Bash

npm install
4. Set Up Your API Key
The app requires an API key from The Movie Database (TMDB).

Create a file named config.js in the root of the project.

Add your API key to it like this:

JavaScript

// config.js
export const API_KEY = 'YOUR_TMDB_API_KEY_HERE';
(Note: config.js is included in .gitignore and will not be committed to the repository).

5. Start the Development Server

Bash

npx expo start
Scan the QR code with the Expo Go app on your phone, or run it on an emulator.

🙏 Acknowledgments
This project was created by Guru (guru1613).

All movie data and images are provided by The Movie Database (TMDB).

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
