/**
 * Demo data layer backed by localStorage.
 * Each function here corresponds to a future API call
 * (EC2 server → DynamoDB, SNS notification on booking).
 */
import { useSyncExternalStore } from "react";
import { DEFAULT_MOVIES, DEFAULT_THEATRES, presetBookedSeats, type Movie, type Theatre } from "./data";

export type Booking = {
  id: string;
  userEmail: string;
  movieId: string;
  movieTitle: string;
  theatreId: string;
  theatreName: string;
  date: string;
  time: string;
  seats: string[];
  price: number;
  total: number;
  status: "Confirmed" | "Cancelled";
  createdAt: string;
};
export type User = { name: string; email: string; password: string; isAdmin?: boolean };

type State = {
  movies: Movie[];
  theatres: Theatre[];
  bookings: Booking[];
  users: User[];
  session: { name: string; email: string; isAdmin?: boolean } | null;
  city: string;
};

const KEY = "movie-magic-v1";
const initial: State = {
  movies: DEFAULT_MOVIES,
  theatres: DEFAULT_THEATRES,
  bookings: [],
  users: [{ name: "Demo Admin", email: "admin@moviemagic.in", password: "admin123", isAdmin: true }],
  session: null,
  city: "Pune",
};

let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupted storage */
  }
}
function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      cb();
      return () => listeners.delete(cb);
    },
    () => sel((load(), state)),
    () => sel(initial),
  );
}
export const getState = () => (load(), state);

/* ---------- actions ---------- */
export const setCity = (city: string) => set({ city });

export function signUp(name: string, email: string, password: string) {
  const s = getState();
  if (s.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error("An account with this email already exists.");
  set({ users: [...s.users, { name, email, password }], session: { name, email } });
}
export function login(email: string, password: string) {
  const u = getState().users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (!u || u.password !== password) throw new Error("Invalid email or password.");
  set({ session: { name: u.name, email: u.email, isAdmin: u.isAdmin } });
}
export const logout = () => set({ session: null });

export function bookedSeatsFor(theatreId: string, movieId: string, date: string, time: string) {
  const key = `${theatreId}|${movieId}|${date}|${time}`;
  const fromBookings = getState()
    .bookings.filter((b) => b.status === "Confirmed" && `${b.theatreId}|${b.movieId}|${b.date}|${b.time}` === key)
    .flatMap((b) => b.seats);
  return new Set([...presetBookedSeats(key), ...fromBookings]);
}

export function createBooking(b: Omit<Booking, "id" | "status" | "createdAt" | "userEmail">): Booking {
  const s = getState();
  const taken = bookedSeatsFor(b.theatreId, b.movieId, b.date, b.time);
  const clash = b.seats.filter((x) => taken.has(x));
  if (clash.length) throw new Error(`Seat(s) ${clash.join(", ")} were just booked. Please choose others.`);
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const id = `MM${ymd}${String(s.bookings.length + 1).padStart(4, "0")}`;
  const booking: Booking = { ...b, id, status: "Confirmed", createdAt: d.toISOString(), userEmail: s.session?.email ?? "guest" };
  set({ bookings: [booking, ...s.bookings] });
  return booking;
}
export const cancelBooking = (id: string) =>
  set({ bookings: getState().bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)) });

export const upsertMovie = (m: Movie) => {
  const ms = getState().movies;
  set({ movies: ms.some((x) => x.id === m.id) ? ms.map((x) => (x.id === m.id ? m : x)) : [...ms, m] });
};
export const deleteMovie = (id: string) => set({ movies: getState().movies.filter((m) => m.id !== id) });
export const addTheatre = (t: Theatre) => set({ theatres: [...getState().theatres, t] });
