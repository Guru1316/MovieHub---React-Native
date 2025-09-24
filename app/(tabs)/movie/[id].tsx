import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Linking, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_KEY } from '../../../config';
const defaultPoster = require('../../assets/MovieHub.png');

// --- Type Definitions (Updated) ---
interface Genre { id: number; name: string; }
interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Genre[];
  adult: boolean;
}
// ✅ Added credit_id for unique keys
interface CastMember { id: number; credit_id: string; name: string; character: string; profile_path: string | null; }
interface CrewMember { id: number; credit_id: string; name: string; job: string; profile_path: string | null; }
interface Video { id: string; key: string; name: string; site: string; type: string; }

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = 'dark';
  const styles = getStyles(theme);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const movieUrl = `https://api.themoviedb.org/3/movie/${id}`;
        const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits`;
        const videosUrl = `https://api.themoviedb.org/3/movie/${id}/videos`;
        const params = { api_key: API_KEY };

        const [movieRes, creditsRes, videosRes] = await Promise.all([
          axios.get<MovieDetails>(movieUrl, { params }),
          axios.get<{ cast: CastMember[], crew: CrewMember[] }>(creditsUrl, { params }),
          axios.get<{ results: Video[] }>(videosUrl, { params }),
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast);
        setCrew(creditsRes.data.crew);

        const officialTrailer = videosRes.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailer(officialTrailer || videosRes.data.results[0] || null);

      } catch (err) {
        setError('Could not fetch movie details.');
      } finally {
        setLoading(false);
      }
    };
    void fetchDetails();
  }, [id]);

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#fff" /></View>;
  if (error || !movie) return <View style={styles.loadingContainer}><Text style={styles.errorText}>{error}</Text></View>;

  const getCertification = (isAdult: boolean) => (movie?.adult ? 'A' : 'U/A');
  const formatRuntime = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

  const renderCastMember = ({ item }: { item: CastMember | CrewMember }) => (
    <View style={styles.personCard}>
      <Image
        source={item.profile_path ? { uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` } : defaultPoster}
        style={styles.personImage}
      />
      <Text style={styles.personName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.personRole} numberOfLines={1}>{'character' in item ? item.character : item.job}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground
          source={movie.backdrop_path ? { uri: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` } : defaultPoster}
          style={styles.backdrop}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.headerContainer}>
          <Image
            source={movie.poster_path ? { uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` } : defaultPoster}
            style={styles.poster}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.tagline}>{movie.release_date.substring(0, 4)} · {getCertification(movie.adult)} · {formatRuntime(movie.runtime)}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)} / 10</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.genreContainer}>
            {movie.genres.map(g => <Text key={g.id} style={styles.genre}>{g.name}</Text>)}
          </View>
        </View>

        {trailer && (
          <TouchableOpacity style={styles.trailerButton} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}>
            <Text style={styles.trailerButtonText}>▶ Watch Trailer</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              data={cast}
              // ✅ Updated keyExtractor for Cast
              keyExtractor={(item) => item.credit_id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderCastMember}
            />
          </View>
        )}

        {crew.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crew</Text>
            <FlatList
              data={crew}
              // ✅ Updated keyExtractor for Crew
              keyExtractor={(item) => item.credit_id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderCastMember}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
    container: { flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' },
    errorText: { color: 'red', fontSize: 18 },
    backdrop: { width: '100%', height: 250, justifyContent: 'flex-start', backgroundColor: '#222' },
    backButton: { position: 'absolute', top: 50, left: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    backButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    headerContainer: { flexDirection: 'row', padding: 15, marginTop: -80 },
    poster: { width: 120, height: 180, borderRadius: 8, borderWidth: 2, borderColor: '#fff' },
    headerTextContainer: { flex: 1, marginLeft: 15, justifyContent: 'flex-end' },
    title: { color: '#fff', fontSize: 24, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
    tagline: { color: '#ccc', fontSize: 14, marginTop: 4 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    rating: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    section: { paddingHorizontal: 15, marginBottom: 20 },
    sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    overview: { color: '#ccc', fontSize: 16, lineHeight: 24 },
    genreContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    genre: { color: '#fff', backgroundColor: '#333', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 15, marginRight: 8, marginBottom: 8, overflow: 'hidden' },
    trailerButton: { backgroundColor: '#E50914', margin: 15, padding: 15, borderRadius: 8, alignItems: 'center' },
    trailerButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    personCard: { marginRight: 15, width: 100 },
    personImage: { width: 100, height: 150, borderRadius: 8, backgroundColor: '#333' },
    personName: { color: '#fff', marginTop: 8, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
    personRole: { color: '#ccc', fontSize: 12, textAlign: 'center' },
});