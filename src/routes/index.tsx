import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticket as TicketIcon, Sparkles } from "lucide-react";
import hero from "@/assets/hero-cinema.jpg";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { TheatreCard } from "@/components/TheatreCard";
import { Section } from "@/components/Section";
import { OFFERS } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Movie Magic – Book Your Movie Experience" },
      { name: "description", content: "Book movie tickets in seconds: now showing, coming soon, nearby theatres and offers." },
      { property: "og:title", content: "Movie Magic – Book Your Movie Experience" },
      { property: "og:description", content: "Smart movie ticket booking with live seat selection." },
    ],
  }),
  component: Home,
});

function Home() {
  const movies = useStore((s) => s.movies);
  const theatres = useStore((s) => s.theatres);
  const city = useStore((s) => s.city);
  const now = movies.filter((m) => m.status === "now");
  const soon = movies.filter((m) => m.status === "soon");
  const popular = now.filter((m) => m.popular);
  const nearby = theatres.filter((t) => t.city === city).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 4);

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-fade" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-32">
          <p className="animate-rise flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            <Sparkles className="size-4" /> Now booking in {city}
          </p>
          <h1 className="animate-rise mt-3 max-w-4xl text-6xl leading-[0.9] sm:text-8xl">Book Your Movie Experience</h1>
          <p className="animate-rise mt-5 max-w-xl text-lg text-muted-foreground">
            Find what's playing, pick the perfect seats and get your ticket instantly — all in under a minute.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="hero"><Link to="/book"><TicketIcon /> Book Tickets</Link></Button>
            <Button asChild size="lg" variant="glass"><Link to="/movies">Explore Movies</Link></Button>
          </div>
        </div>
      </section>

      <Section title="Now Showing" kicker="In cinemas" action={<Link to="/movies" className="text-sm text-primary">View all →</Link>}>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {now.slice(0, 5).map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      </Section>

      <Section title="Popular Movies" kicker="Trending this week">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {popular.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      </Section>

      <Section title="Coming Soon" kicker="Mark your calendar">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {soon.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      </Section>

      <Section title={`Nearby Theatres`} kicker={city} action={<Link to="/theatres" className="text-sm text-primary">All theatres →</Link>}>
        <div className="grid gap-5 md:grid-cols-2">
          {nearby.map((t) => <TheatreCard key={t.id} theatre={t} />)}
        </div>
      </Section>

      <Section title="Special Offers" kicker="Save more">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map((o) => (
            <Link key={o.code} to="/offers" className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
              <span className="text-xs text-primary">{o.tag}</span>
              <p className="mt-1 font-display text-2xl leading-tight">{o.title}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">CODE: {o.code}</p>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
