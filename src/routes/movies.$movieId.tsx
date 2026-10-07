import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Star, Clock, Calendar, Globe } from "lucide-react";
import { formatDate, formatDuration, upcomingDates, DEFAULT_MOVIES } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Poster } from "@/components/Poster";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/Section";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/movies/$movieId")({
  head: ({ params }) => {
    const m = DEFAULT_MOVIES.find((x) => x.id === params.movieId);
    const title = `${m?.title ?? "Movie"} – Showtimes & Tickets | Movie Magic`;
    const desc = m?.description ?? "Movie details and showtimes.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }] };
  },
  component: MovieDetails,
});

function MovieDetails() {
  const { movieId } = Route.useParams();
  const movies = useStore((s) => s.movies);
  const allTheatres = useStore((s) => s.theatres);
  const city = useStore((s) => s.city);
  const dates = upcomingDates();
  const [date, setDate] = useState(dates[0]);
  const [trailer, setTrailer] = useState(false);
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) return <div className="mx-auto max-w-3xl px-4 py-20"><Empty title="Movie not found"><Link to="/movies" className="text-primary">Back to movies</Link></Empty></div>;
  const theatres = allTheatres.filter((t) => t.movieIds.includes(movie.id) && t.city === city);

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 scale-110 opacity-40 blur-3xl"><Poster movie={movie} className="h-full w-full rounded-none" /></div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[300px_1fr]">
          <Poster movie={movie} large className="mx-auto w-60 shadow-glow md:w-full" />
          <div className="self-end">
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => <span key={g} className="rounded-full bg-accent px-3 py-1 text-xs">{g}</span>)}
              <span className="rounded-full border border-border px-3 py-1 text-xs">{movie.certificate}</span>
            </div>
            <h1 className="mt-3 text-6xl leading-none sm:text-7xl">{movie.title}</h1>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
              {movie.rating > 0 && <span className="flex items-center gap-1 text-gold"><Star className="size-4 fill-current" /> {movie.rating}/10</span>}
              <span className="flex items-center gap-1"><Clock className="size-4" /> {formatDuration(movie.duration)}</span>
              <span className="flex items-center gap-1"><Globe className="size-4" /> {movie.language}</span>
              <span className="flex items-center gap-1"><Calendar className="size-4" /> {formatDate(movie.releaseDate, { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <p className="mt-5 max-w-2xl text-lg">{movie.description}</p>
            <p className="mt-4 text-sm text-muted-foreground"><span className="text-foreground">Cast:</span> {movie.cast.join(", ")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {movie.status === "now" && <Button asChild variant="hero" size="lg"><Link to="/book" search={{ movie: movie.id }}>Book Tickets</Link></Button>}
              <Button variant="glass" size="lg" onClick={() => setTrailer(true)}><Play /> Watch Trailer</Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={trailer} onOpenChange={setTrailer}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="font-display text-3xl">{movie.title} – Trailer</DialogTitle>
          <div className="grid aspect-video place-items-center rounded-xl bg-secondary text-center text-muted-foreground">
            <div><Play className="mx-auto size-12 text-primary" /><p className="mt-2 text-sm">Trailer playback is a future feature.</p></div>
          </div>
        </DialogContent>
      </Dialog>

      {movie.status === "now" && (
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-4xl">Theatres & Showtimes <span className="text-muted-foreground">· {city}</span></h2>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {dates.map((d) => (
              <button key={d} onClick={() => setDate(d)} className={`shrink-0 rounded-xl border px-4 py-2 text-sm transition ${d === date ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`}>
                {formatDate(d)}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4">
            {theatres.length === 0 && <Empty title={`Not playing in ${city}`}>Try another location from the header.</Empty>}
            {theatres.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl">{t.name} – {t.city}</h3>
                  <span className="text-sm text-muted-foreground">{t.area} · {t.distanceKm} km</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.showtimes.map((time) => (
                    <Button key={time} asChild variant="outline" className="border-success/50 text-success hover:bg-success/10 hover:text-success">
                      <Link to="/book" search={{ movie: movie.id, theatre: t.id, date, time }}>{time} · Select</Link>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
