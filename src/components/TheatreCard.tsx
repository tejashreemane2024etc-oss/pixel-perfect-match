import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { Theatre } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Button } from "./ui/button";

export function TheatreCard({ theatre }: { theatre: Theatre }) {
  const movies = useStore((s) => s.movies);
  const showing = movies.filter((m) => theatre.movieIds.includes(m.id) && m.status === "now");
  return (
    <div className="animate-rise flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-2xl">{theatre.name} – {theatre.city}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{theatre.area}</span>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs">{theatre.distanceKm} km</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {theatre.facilities.map((f) => (
          <span key={f} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">{f}</span>
        ))}
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Now playing</p>
      <p className="mt-1 text-sm">{showing.map((m) => m.title).join(" · ") || "No shows today"}</p>
      <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Showtimes</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {theatre.showtimes.map((t) => (
          <span key={t} className="rounded-md bg-secondary px-2 py-1 text-xs">{t}</span>
        ))}
      </div>
      <Button asChild className="mt-5 rounded-full" variant="outline">
        <Link to="/book" search={{ theatre: theatre.id }}>View Shows</Link>
      </Button>
    </div>
  );
}
