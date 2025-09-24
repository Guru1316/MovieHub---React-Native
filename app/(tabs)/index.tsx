import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { API_KEY } from '../../config.js';
import MovieCard from '../components/MovieCard';
import { Link } from 'expo-router';

// --- Type Definitions ---
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
}
interface Genre {
  id: number;
  name: string;
}
interface Language {
  iso_639_1: string;
  english_name: string;
}

// --- Main App Component ---
export default function HomeScreen(): React.JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark mode
  const [genres, setGenres] = useState<Genre[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [bookmarked, setBookmarked] = useState<Movie[]>([]);
  const flatListRef = useRef<FlatList<Movie>>(null);

  useEffect(() => {
    const loadAppData = async () => {
      const stored = await AsyncStorage.getItem('bookmarked');
      if (stored) setBookmarked(JSON.parse(stored) as Movie[]);
      await fetchGenres();
      await fetchLanguages();
    };
    void loadAppData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    void fetchMovies(1);
  }, [debouncedSearch, selectedGenre, sortBy, selectedLanguage]);

  const fetchMovies = async (pageNumber: number, loadMore = false): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const endpoint = debouncedSearch ? 'https://api.themoviedb.org/3/search/movie' : 'https://api.themoviedb.org/3/discover/movie';
      const { data } = await axios.get<{ results: Movie[]; total_pages: number }>(endpoint, {
        params: {
          api_key: API_KEY,
          page: pageNumber,
          query: debouncedSearch || undefined,
          with_genres: selectedGenre || undefined,
          sort_by: sortBy || undefined,
          with_original_language: selectedLanguage || undefined,
        },
      });
      setMovies(prev => (loadMore ? [...prev, ...data.results] : data.results));
      setPage(pageNumber);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async (): Promise<void> => {
    try {
      const { data } = await axios.get<{ genres: Genre[] }>('https://api.themoviedb.org/3/genre/movie/list', { params: { api_key: API_KEY } });
      setGenres(data.genres);
    } catch (error) { console.error('Error fetching genres:', error); }
  };

  const fetchLanguages = async (): Promise<void> => {
    try {
      const { data } = await axios.get<Language[]>('https://api.themoviedb.org/3/configuration/languages', { params: { api_key: API_KEY } });
      setAvailableLanguages(data.sort((a, b) => a.english_name.localeCompare(b.english_name)));
    } catch (error) { console.error('Error fetching languages:', error); }
  };

  const handleLoadMore = (): void => {
    if (page < totalPages && !loading) {
      void fetchMovies(page + 1, true);
    }
  };

  const toggleTheme = (): void => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const toggleBookmark = async (movie: Movie): Promise<void> => {
    let updated: Movie[] = bookmarked.find(m => m.id === movie.id)
      ? bookmarked.filter(m => m.id !== movie.id)
      : [...bookmarked, movie];
    setBookmarked(updated);
    await AsyncStorage.setItem('bookmarked', JSON.stringify(updated));
  };

  const styles = getStyles(theme);

  const renderMovieCard = ({ item }: ListRenderItemInfo<Movie>): React.JSX.Element => (
    <Link
      href={{
        pathname: "/movie/[id]",
        params: { id: item.id }
      } as any} // ✅ FINAL FIX APPLIED HERE
      asChild
    >
      <TouchableOpacity style={{ flex: 1/2 }}>
        <MovieCard
          movie={item}
          isBookmarked={!!bookmarked.find(m => m.id === item.id)}
          onToggleBookmark={() => toggleBookmark(item)}
          theme={theme}
        />
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 MovieHub</Text>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Text style={styles.themeToggleText}>{theme === 'dark' ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search movies..."
        placeholderTextColor={theme === 'dark' ? '#888' : '#777'}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={styles.filtersRow}>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedGenre} onValueChange={(itemValue) => setSelectedGenre(itemValue)} style={styles.picker} dropdownIconColor={theme === 'dark' ? '#fff' : '#000'}>
            <Picker.Item label="All Genres" value="" />
            {genres.map(g => <Picker.Item key={g.id} label={g.name} value={String(g.id)} />)}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={sortBy} onValueChange={(itemValue) => setSortBy(itemValue)} style={styles.picker} dropdownIconColor={theme === 'dark' ? '#fff' : '#000'}>
            <Picker.Item label="Popularity" value="popularity.desc" />
            <Picker.Item label="Top Rated" value="vote_average.desc" />
            <Picker.Item label="Newest" value="release_date.desc" />
          </Picker>
        </View>
      </View>
      <View style={[styles.filtersRow, { marginBottom: 10 }]}>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedLanguage} onValueChange={(itemValue) => setSelectedLanguage(itemValue)} style={styles.picker} dropdownIconColor={theme === 'dark' ? '#fff' : '#000'}>
            <Picker.Item label="All Languages" value="" />
            {availableLanguages.map(lang => <Picker.Item key={lang.iso_639_1} label={lang.english_name} value={lang.iso_639_1} />)}
          </Picker>
        </View>
      </View>
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#007bff" style={{ flex: 1 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          ref={flatListRef} data={movies} keyExtractor={item => item.id.toString()} numColumns={2}
          renderItem={renderMovieCard} contentContainerStyle={{ paddingHorizontal: 5 }}
          onEndReached={handleLoadMore} onEndReachedThreshold={0.5}
          ListFooterComponent={loading && page > 1 ? <ActivityIndicator size="small" color="#007bff" /> : null}
          ListEmptyComponent={<Text style={styles.errorText}>No movies found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

// --- Styles ---
const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' },
    themeToggle: { padding: 8, borderRadius: 20, backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0' },
    themeToggleText: { fontSize: 18 },
    searchBar: { height: 40, marginHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: theme === 'dark' ? '#555' : '#ccc', paddingHorizontal: 10, borderRadius: 8, backgroundColor: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' },
    filtersRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 10, marginBottom: 5 },
    pickerContainer: { flex: 1, height: 40, justifyContent: 'center', borderWidth: 1, borderColor: theme === 'dark' ? '#555' : '#ccc', borderRadius: 8, marginHorizontal: 5, backgroundColor: theme === 'dark' ? '#333' : '#fff' },
    picker: { color: theme === 'dark' ? '#fff' : '#000' },
    errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  });