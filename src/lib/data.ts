/**
 * Sample/demo data for Movie Magic.
 * In a production cloud deployment these collections map to DynamoDB tables
 * (Movies, Theatres, Showtimes, Bookings, Users).
 */

export type Movie = {
  id: string;
  title: string;
  genres: string[];
  language: string;
  duration: number; // minutes
  rating: number; // out of 10
  certificate: string;
  releaseDate: string; // ISO
  status: "now" | "soon";
  popular?: boolean;
  description: string;
  cast: string[];
  /** two oklch hues used to paint the stylised poster */
  hues: [number, number];
};

export type Theatre = {
  id: string;
  name: string;
  area: string;
  city: string;
  distanceKm: number;
  facilities: string[];
  movieIds: string[];
  showtimes: string[];
};

export const TICKET_PRICE = 180;
export const CITIES = ["Pune", "Mumbai", "Bengaluru"];
export const GENRES = ["Action", "Drama", "Comedy", "Sci-Fi", "Thriller"];
export const LANGUAGES = ["English", "Hindi", "Marathi", "Telugu"];

export const DEFAULT_MOVIES: Movie[] = [
  { id: "avengers-endgame", title: "Avengers: Endgame", genres: ["Action", "Sci-Fi"], language: "English", duration: 181, rating: 8.4, certificate: "UA", releaseDate: "2019-04-26", status: "now", popular: true, description: "After the devastating events of Infinity War, the remaining Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.", cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Mark Ruffalo"], hues: [25, 280] },
  { id: "interstellar", title: "Interstellar", genres: ["Sci-Fi", "Drama"], language: "English", duration: 169, rating: 8.7, certificate: "UA", releaseDate: "2014-11-07", status: "now", popular: true, description: "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], hues: [220, 60] },
  { id: "inception", title: "Inception", genres: ["Sci-Fi", "Thriller"], language: "English", duration: 148, rating: 8.8, certificate: "UA", releaseDate: "2010-07-16", status: "now", description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.", cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"], hues: [200, 30] },
  { id: "spiderman-nwh", title: "Spider-Man: No Way Home", genres: ["Action", "Comedy"], language: "English", duration: 148, rating: 8.2, certificate: "UA", releaseDate: "2021-12-17", status: "now", popular: true, description: "With Spider-Man's identity revealed, Peter asks Doctor Strange for help — but a spell gone wrong opens the multiverse.", cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"], hues: [10, 250] },
  { id: "dune-2", title: "Dune: Part Two", genres: ["Sci-Fi", "Drama"], language: "English", duration: 166, rating: 8.6, certificate: "UA", releaseDate: "2024-03-01", status: "now", description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.", cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"], hues: [60, 30] },
  { id: "pushpa-2", title: "Pushpa 2: The Rule", genres: ["Action", "Drama"], language: "Telugu", duration: 200, rating: 7.9, certificate: "A", releaseDate: "2024-12-05", status: "now", popular: true, description: "Pushpa Raj continues his rise in the red sandalwood smuggling syndicate while facing a relentless police officer.", cast: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"], hues: [40, 15] },
  { id: "stree-2", title: "Stree 2", genres: ["Comedy", "Thriller"], language: "Hindi", duration: 147, rating: 7.6, certificate: "UA", releaseDate: "2024-08-15", status: "now", description: "The town of Chanderi is haunted again — this time by a headless terror, and the old gang must reunite.", cast: ["Shraddha Kapoor", "Rajkummar Rao", "Pankaj Tripathi"], hues: [150, 330] },
  { id: "kalki-2898", title: "Kalki 2898 AD", genres: ["Sci-Fi", "Action"], language: "Hindi", duration: 181, rating: 7.8, certificate: "UA", releaseDate: "2024-06-27", status: "now", description: "In a dystopian future, a modern-day avatar of Vishnu is prophesied to rise against the tyrant Supreme Yaskin.", cast: ["Prabhas", "Amitabh Bachchan", "Deepika Padukone", "Kamal Haasan"], hues: [70, 200] },
  { id: "baipan-bhari-deva-2", title: "Baipan Bhari Deva 2", genres: ["Comedy", "Drama"], language: "Marathi", duration: 140, rating: 0, certificate: "U", releaseDate: "2026-11-20", status: "soon", description: "Six sisters reunite for one more unforgettable journey of laughter, music and second chances.", cast: ["Rohini Hattangadi", "Vandana Gupte", "Sukanya Kulkarni"], hues: [330, 50] },
  { id: "the-last-orbit", title: "The Last Orbit", genres: ["Sci-Fi", "Thriller"], language: "English", duration: 132, rating: 0, certificate: "UA", releaseDate: "2026-12-12", status: "soon", description: "A stranded crew must decide who returns to Earth when their space station's oxygen supply begins to fail.", cast: ["Florence Pugh", "Dev Patel"], hues: [260, 190] },
  { id: "shiva-the-warrior", title: "Shivba: The Warrior", genres: ["Action", "Drama"], language: "Marathi", duration: 158, rating: 0, certificate: "UA", releaseDate: "2027-01-26", status: "soon", description: "An epic historical saga of courage, strategy and the birth of Swarajya in the hills of the Sahyadri.", cast: ["Riteish Deshmukh", "Sai Tamhankar"], hues: [30, 0] },
];

export const DEFAULT_THEATRES: Theatre[] = [
  { id: "pvr-pune", name: "PVR Cinemas", area: "Phoenix Marketcity, Viman Nagar", city: "Pune", distanceKm: 3.2, facilities: ["IMAX", "Dolby Atmos", "Recliners", "F&B"], movieIds: ["avengers-endgame", "interstellar", "dune-2", "pushpa-2", "kalki-2898"], showtimes: ["10:00 AM", "1:30 PM", "4:30 PM", "7:30 PM", "10:30 PM"] },
  { id: "inox-pune", name: "INOX", area: "Bund Garden Road", city: "Pune", distanceKm: 4.8, facilities: ["Dolby Atmos", "4K Laser", "Parking"], movieIds: ["inception", "spiderman-nwh", "stree-2", "avengers-endgame"], showtimes: ["9:45 AM", "12:45 PM", "3:45 PM", "6:45 PM", "9:45 PM"] },
  { id: "cinepolis-pune", name: "Cinepolis", area: "Seasons Mall, Hadapsar", city: "Pune", distanceKm: 7.1, facilities: ["4DX", "VIP Lounge", "F&B"], movieIds: ["dune-2", "kalki-2898", "spiderman-nwh", "interstellar"], showtimes: ["11:00 AM", "2:15 PM", "5:30 PM", "8:45 PM"] },
  { id: "citypride-pune", name: "City Pride", area: "Kothrud", city: "Pune", distanceKm: 9.4, facilities: ["Dolby 7.1", "Parking", "Wheelchair Access"], movieIds: ["pushpa-2", "stree-2", "inception", "avengers-endgame"], showtimes: ["10:30 AM", "1:45 PM", "5:00 PM", "8:15 PM"] },
  { id: "pvr-mumbai", name: "PVR ICON", area: "Infiniti Mall, Andheri", city: "Mumbai", distanceKm: 5.5, facilities: ["IMAX", "Recliners"], movieIds: ["avengers-endgame", "inception", "stree-2"], showtimes: ["10:00 AM", "2:00 PM", "6:00 PM", "9:30 PM"] },
  { id: "inox-blr", name: "INOX", area: "Garuda Mall", city: "Bengaluru", distanceKm: 2.9, facilities: ["Dolby Atmos", "F&B"], movieIds: ["interstellar", "pushpa-2", "dune-2"], showtimes: ["11:30 AM", "3:00 PM", "7:00 PM", "10:15 PM"] },
];

export const OFFERS = [
  { code: "FIRST20", title: "20% OFF on your first booking", desc: "New to Movie Magic? Save 20% on your very first ticket order.", tag: "New users" },
  { code: "WEEKEND", title: "Weekend Movie Offer", desc: "Flat ₹75 off on Saturday & Sunday shows across all partner theatres.", tag: "Sat–Sun" },
  { code: "STUDENT50", title: "Student Special – Flat ₹50 OFF", desc: "Show a valid college ID at the counter and save ₹50 per booking.", tag: "Students" },
  { code: "B2G1", title: "Buy 2 Tickets and Get 1 Free", desc: "Book 3 seats in the same show and pay for only 2. Valid on weekdays.", tag: "Mon–Thu" },
];

export const SEAT_ROWS = ["A", "B", "C", "D", "E"];
export const SEATS_PER_ROW = 8;

/** Deterministic pseudo-random "already booked" seats for a given show. */
export function presetBookedSeats(key: string): string[] {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const out: string[] = [];
  for (const r of SEAT_ROWS)
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      h = (h * 1103515245 + 12345) >>> 0;
      if (h % 100 < 22) out.push(`${r}${n}`);
    }
  return out;
}

/** Next 5 days starting today as ISO date strings. */
export function upcomingDates(count = 5): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < count; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    out.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`);
  }
  return out;
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", opts);
}

export const formatDuration = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
