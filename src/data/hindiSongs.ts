export interface HindiSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  year?: number;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  genre: string[];
  mood?: string[];
  language: string;
}

export const hindiSongs: HindiSong[] = [
  {
    id: "1",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    year: 2013,
    duration: 280,
    coverUrl: "/coverImage/Aashiqui-2.webp",
    audioUrl: "/music/tum-hi-ho.mp3",
    genre: ["Romantic", "Bollywood"],
    mood: ["Romantic", "Emotional"],
    language: "hindi",
  },
  {
    id: "2",
    title: "Channa Mereya",
    artist: "Arijit Singh",
    album: "Ae Dil Hai Mushkil",
    year: 2016,
    duration: 298,
    coverUrl: "/coverImage/channa.webp",
    audioUrl: "/music/channa-mereya.mp3",
    genre: ["Romantic", "Sad"],
    mood: ["Emotional", "Heartbreak"],
    language: "hindi",
  },
  {
    id: "3",
    title: "Ghungroo",
    artist: "Arijit Singh, Shilpa Rao",
    album: "War",
    year: 2019,
    duration: 319,
    coverUrl: "/coverImage/gungroo.webp",
    audioUrl: "/music/ghungroo.mp3",
    genre: ["Dance", "Bollywood"],
    mood: ["Energetic", "Happy"],
    language: "hindi",
  },
  {
    id: "4",
    title: "Bekhayali",
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    year: 2019,
    duration: 326,
    coverUrl: "/coverImage/Bekhayali.webp",
    audioUrl: "/music/bekhayali.mp3",
    genre: ["Romantic", "Sad"],
    mood: ["Emotional", "Heartbreak"],
    language: "hindi",
  },
  {
    id: "5",
    title: "Hum Tere",
    artist: "Hasrat Jaipuri",
    album: "lata mangeshkar",
    year: 1963,
    duration: 225,
    coverUrl: "/coverImage/hum-tere.webp",
    audioUrl: "/music/hum-tere.mp3",
    genre: ["Romantic", "Sad"],
    mood: ["Emotional", "Heartbreak"],
    language: "hindi",
  },
  {
    id: "6",
    title: "Dil Aaj Kal",
    artist: "KK",
    album: "Dil Aaj Kal",
    year: 2003,
    duration: 337,
    coverUrl: "/coverImage/dil-aaj-kal.webp",
    audioUrl: "/music/dil-aaj-kal.mp3",
    genre: ["Romantic", "Classic"],
    mood: ["Romantic", "Emotional"],
    language: "hindi",
  },
  {
    id: "7",
    title: "China",
    artist: "Annuel AA , KarolG",
    album: "china",
    year: 2018,
    duration: 194,
    coverUrl: "/coverImage/china.webp",
    audioUrl: "/music/china.mp3",
    genre: ["Traditional", "Folk"],
    mood: ["Cultural", "Energetic"],
    language: "spanish",
  },
  {
    id: "8",
    title: "Hunting Soul",
    artist: "hayashi",
    album: "Dandadan",
    year: 2024,
    duration: 194,
    coverUrl: "/coverImage/hayashi.webp",
    audioUrl: "/music/dandadan.mp3",
    genre: ["Traditional", "Folk"],
    mood: ["Cultural", "Energetic"],
    language: "japanese",
  },
  {
    id: "9",
    title: "Hunting Soul jap",
    artist: "hayashi",
    album: "Dandadan",
    year: 2024,
    duration: 194,
    coverUrl: "/coverImage/hayashi.webp",
    audioUrl: "/music/Hunting Soul - Toshiro.mp3",
    genre: ["Traditional", "Folk"],
    mood: ["Cultural", "Energetic"],
    language: "japanese",
  },
  {
    id: "10",
    title: "bargad",
    artist: "Arpit Bala",
    album: "bargad",
    year: 2024,
    duration: 194,
    coverUrl: "/coverImage/bargad.webp",
    audioUrl: "/music/bargad.mp3",
    genre: ["Traditional", "Folk"],
    mood: ["Cultural", "Energetic"],
    language: "hindi",
  },
  {
    id: "11",
    title: "sanson-ki-mala",
    artist: "Nusrat fateh ali khan",
    album: "sanson-ki-mala",
    year: 2024,
    duration: 194,
    coverUrl: "/coverImage/sanson.webp",
    audioUrl: "/music/sanson ki mala.mp3",
    genre: ["Traditional", "Folk"],
    mood: ["Cultural", "Energetic"],
    language: "hindi",
  },
];

// Helper function to convert seconds to MM:SS format
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Get songs by genre
export function getSongsByGenre(genre: string): HindiSong[] {
  return hindiSongs.filter(song => song.genre.includes(genre));
}

// Get songs by mood
export function getSongsByMood(mood: string): HindiSong[] {
  return hindiSongs.filter(song => song.mood?.includes(mood));
}
