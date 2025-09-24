import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const defaultPoster = require('../assets/MovieHub.png');

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  theme: 'light' | 'dark';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isBookmarked, onToggleBookmark, theme }) => {
  const styles = getStyles(theme);

  const handleBookmarkPress = () => {
    onToggleBookmark();
  };
  
  return (
    <View style={styles.card}>
      {/* ✅ We now wrap the Image in a styled View to act as a container */}
      <View style={styles.posterContainer}>
        <Image
          source={movie.poster_path ? { uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` } : defaultPoster}
          // The image now fills the container, and resizeMode handles the fit
          style={styles.posterImage}
          // Use 'cover' for movie posters, 'contain' for our fallback logo
          resizeMode={movie.poster_path ? "cover" : "contain"} 
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {movie.vote_average?.toFixed(1)}</Text>
          <TouchableOpacity onPress={handleBookmarkPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.bookmarkIcon}>{isBookmarked ? '🔖' : '📌'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    card: { margin: 5, backgroundColor: theme === 'dark' ? '#222' : '#fff', borderRadius: 8, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
    // ✅ New styles for the container and the image itself
    posterContainer: {
        width: '100%',
        aspectRatio: 2 / 3,
        backgroundColor: '#333',
        justifyContent: 'center', // This centers the logo vertically
        alignItems: 'center',     // This centers the logo horizontally
    },
    posterImage: {
        width: '100%',
        height: '100%',
    },
    cardBody: { padding: 10 },
    movieTitle: { fontSize: 14, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' },
    ratingContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    rating: { fontSize: 12, color: theme === 'dark' ? '#ccc' : '#444' },
    bookmarkIcon: { fontSize: 20 },
});

export default React.memo(MovieCard);