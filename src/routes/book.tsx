import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SEAT_ROWS, SEATS_PER_ROW, TICKET_PRICE, formatDate, inr, upcomingDates } from "@/lib/data";
import { bookedSeatsFor, createBooking, useStore } from "@/lib/store";
import { Poster } from "@/components/Poster";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/Section";
import { cn } from "@/lib/utils";

type Search = { movie?: string; theatre?: string; date?: string; time?: string };

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    movie: typeof s.movie === "string" ? s.movie : undefined,
    theatre: typeof s.theatre === "string" ? s.theatre : undefined,
    date: typeof s.date === "string" ? s.date : undefined,
    time: typeof s.time === "string" ? s.time : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book Tickets – Movie Magic" },
      { name: "description", content: "Pick a movie, theatre, showtime and seats to book your tickets." },
      { property: "og:title", content: "Book Tickets – Movie Magic" },
      { property: "og:description", content: "Seven quick steps to your movie ticket." },
    ],
  }),
  component: BookPage,
});

const STEPS = ["Movie", "Theatre", "Date", "Showtime", "Seats", "Review", "Confirm"];

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const movies = useStore((s) => s.movies);
  const theatres = useStore((s) => s.theatres);
  const city = useStore((s) => s.city);
  const bookings = useStore((s) => s.bookings);
  const dates = upcomingDates();

  const [movieId, setMovieId] = useState(search.movie);
  const [theatreId, setTheatreId] = useState(search.theatre);
  const [date, setDate] = useState(search.date);
  const [time, setTime] = useState(search.time);
  const [seats, setSeats] = useState<string[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const movie = movies.find((m) => m.id === movieId && m.status === "now");
  const theatre = theatres.find((t) => t.id === theatreId);

  // Keep selections consistent: a theatre must screen the chosen movie.
  useEffect(() => {
    if (movie && theatre && !theatre.movieIds.includes(movie.id)) { setTheatreId(undefined); setTime(undefined); }
  }, [movie, theatre]);
  useEffect(() => setSeats([]), [movieId, theatreId, date, time]);

  const booked = useMemo(
    () => (movie && theatre && date && time ? bookedSeatsFor(theatre.id, movie.id, date, time) : new Set<string>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [movie, theatre, date, time, bookings],
  );

  const step = !movie ? 0 : !theatre ? 1 : !date ? 2 : !time ? 3 : !reviewing ? 4 : 5;
  const total = seats.length * TICKET_PRICE;

  const toggleSeat = (id: string) => {
    if (booked.has(id)) return toast.error(`Seat ${id} is already booked.`);
    setSeats((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 10 ? (toast.error("Max 10 seats per booking"), s) : [...s, id]));
  };

  const goBack = () => {
    if (step === 5) setReviewing(false);
    else if (step === 4) setTime(undefined);
    else if (step === 3) setDate(undefined);
    else if (step === 2) setTheatreId(undefined);
    else if (step === 1) setMovieId(undefined);
  };

  const confirm = async () => {
    // Validation guards (also enforced in the UI).
    if (!movie) return toast.error("Please select a movie.");
    if (!theatre) return toast.error("Please select a theatre.");
    if (!date || !time) return toast.error("Please select a date and showtime.");
    if (!seats.length) return toast.error("Please select at least one seat.");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate EC2 API → DynamoDB write
    try {
      const b = createBooking({ movieId: movie.id, movieTitle: movie.title, theatreId: theatre.id, theatreName: `${theatre.name} – ${theatre.city}`, date, time, seats: [...seats].sort(), price: TICKET_PRICE, total });
      toast.success("Booking confirmed!");
      navigate({ to: "/confirmation/$bookingId", params: { bookingId: b.id } });
    } catch (e) {
      toast.error((e as Error).message);
      setSubmitting(false);
      setReviewing(false);
    }
  };

  const tile = (active: boolean) =>
    cn("rounded-xl border p-4 text-left transition", active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Stepper */}
      <ol className="flex gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <li key={s} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs", i < step ? "border-success/40 text-success" : i === step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}>
            <span className="grid size-5 place-items-center rounded-full bg-background/30">{i < step ? <Check className="size-3" /> : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {step > 0 && (
            <Button variant="ghost" size="sm" onClick={goBack} className="mb-4"><ChevronLeft /> Back</Button>
          )}

          {step === 0 && (
            <>
              <h1 className="text-5xl">Select a movie</h1>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {movies.filter((m) => m.status === "now").map((m) => (
                  <button key={m.id} onClick={() => setMovieId(m.id)} className="text-left">
                    <Poster movie={m} className="transition hover:shadow-glow" />
                    <p className="mt-2 truncate text-sm font-semibold">{m.title}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && movie && (
            <>
              <h1 className="text-5xl">Select a theatre</h1>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {theatres.filter((t) => t.city === city && t.movieIds.includes(movie.id)).map((t) => (
                  <button key={t.id} onClick={() => setTheatreId(t.id)} className={tile(false)}>
                    <p className="font-display text-2xl">{t.name} – {t.city}</p>
                    <p className="text-sm text-muted-foreground">{t.area} · {t.distanceKm} km</p>
                  </button>
                ))}
              </div>
              {!theatres.some((t) => t.city === city && t.movieIds.includes(movie.id)) && <Empty title={`Not showing in ${city}`}>Change your location in the header.</Empty>}
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-5xl">Select a date</h1>
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {dates.map((d) => (
                  <button key={d} onClick={() => setDate(d)} className={tile(false)}>
                    <p className="text-xs uppercase text-muted-foreground">{formatDate(d, { weekday: "short" })}</p>
                    <p className="font-display text-4xl">{formatDate(d, { day: "numeric" })}</p>
                    <p className="text-xs">{formatDate(d, { month: "short" })}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && theatre && (
            <>
              <h1 className="text-5xl">Select a showtime</h1>
              <div className="mt-6 flex flex-wrap gap-3">
                {theatre.showtimes.map((t) => (
                  <Button key={t} variant="outline" size="lg" onClick={() => setTime(t)} className="border-success/50 text-success hover:bg-success/10 hover:text-success">{t}</Button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="text-5xl">Choose your seats</h1>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card p-6">
                <div className="mx-auto mb-10 h-2 max-w-md rounded-full bg-gradient-primary shadow-glow" />
                <p className="-mt-8 mb-8 text-center text-xs uppercase tracking-[0.4em] text-muted-foreground">Screen this way</p>
                <div className="mx-auto grid w-max gap-2">
                  {SEAT_ROWS.map((r) => (
                    <div key={r} className="flex items-center gap-2">
                      <span className="w-5 text-xs text-muted-foreground">{r}</span>
                      {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                        const id = `${r}${i + 1}`;
                        const isBooked = booked.has(id);
                        const isSel = seats.includes(id);
                        return (
                          <button
                            key={id}
                            onClick={() => toggleSeat(id)}
                            disabled={isBooked}
                            aria-label={`Seat ${id}${isBooked ? " booked" : isSel ? " selected" : ""}`}
                            className={cn(
                              "grid size-9 place-items-center rounded-t-lg rounded-b-sm text-[10px] font-semibold transition sm:size-10",
                              i === 3 && "mr-4",
                              isBooked ? "cursor-not-allowed bg-seat-booked text-muted-foreground/40 line-through" : isSel ? "bg-primary text-primary-foreground shadow-glow" : "bg-seat hover:bg-accent hover:ring-1 hover:ring-primary",
                            )}
                          >
                            {id}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2"><span className="size-4 rounded bg-seat" /> Available</span>
                  <span className="flex items-center gap-2"><span className="size-4 rounded bg-primary" /> Selected</span>
                  <span className="flex items-center gap-2"><span className="size-4 rounded bg-seat-booked" /> Booked</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">{seats.length ? `Selected: ${[...seats].sort().join(", ")}` : "No seats selected yet"}</p>
                <Button variant="hero" size="lg" onClick={() => (seats.length ? setReviewing(true) : toast.error("Please select at least one seat."))}>
                  Continue · {inr(total)}
                </Button>
              </div>
            </>
          )}

          {step === 5 && movie && theatre && date && time && (
            <>
              <h1 className="text-5xl">Review booking</h1>
              <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
                {([
                  ["Movie", movie.title],
                  ["Theatre", `${theatre.name} – ${theatre.city}`],
                  ["Date", formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                  ["Showtime", time],
                  ["Selected Seats", [...seats].sort().join(", ")],
                  ["Ticket Price", inr(TICKET_PRICE)],
                  ["Number of Tickets", String(seats.length)],
                ] as const).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-5 py-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                ))}
                <div className="flex justify-between px-5 py-4 text-lg"><dt className="font-semibold">Total Amount</dt><dd className="font-display text-3xl text-primary">{inr(total)}</dd></div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Demo project — no payment is collected.</p>
              <Button variant="hero" size="lg" className="mt-6 w-full sm:w-auto" onClick={confirm} disabled={submitting}>
                {submitting ? <><Loader2 className="animate-spin" /> Confirming…</> : "Confirm Booking"}
              </Button>
            </>
          )}
        </div>

        {/* Summary sidebar */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your booking</p>
          {movie ? (
            <div className="mt-3 flex gap-3">
              <Poster movie={movie} className="w-16 shrink-0 rounded-md [&_p]:hidden" />
              <div className="min-w-0">
                <p className="font-display text-2xl leading-none">{movie.title}</p>
                <p className="text-xs text-muted-foreground">{movie.language} · {movie.certificate}</p>
              </div>
            </div>
          ) : <p className="mt-3 text-sm text-muted-foreground">Start by choosing a movie.</p>}
          <dl className="mt-4 space-y-2 text-sm">
            <Row k="Theatre" v={theatre ? theatre.name : "—"} />
            <Row k="Date" v={date ? formatDate(date) : "—"} />
            <Row k="Showtime" v={time ?? "—"} />
            <Row k="Seats" v={seats.length ? `${seats.length} (${[...seats].sort().join(", ")})` : "—"} />
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm">Total</span>
            <span className="font-display text-3xl text-primary">{inr(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="truncate text-right">{v}</dd></div>
);
