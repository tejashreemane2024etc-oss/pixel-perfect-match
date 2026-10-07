import { Link } from "@tanstack/react-router";
import { Star, Clock } from "lucide-react";
import type { Movie } from "@/lib/data";
import { formatDate, formatDuration } from "@/lib/data";
import { Poster } from "./Poster";
import { Button } from "./ui/button";

export function MovieCard({ movie, showDescription }: { movie: Movie; showDescription?: boolean }) {
  return (
    <div className="group animate-rise flex flex-col">
      <Link to="/movies/$movieId" params={{ movieId: movie.id }} className="block">
        <Poster movie={movie} className="transition duration-500 group-hover:-translate-y-1 group-hover:shadow-glow" />
      </Link>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link to="/movies/$movieId" params={{ movieId: movie.id }} className="min-w-0 truncate font-semibold hover:text-primary">
            {movie.title}
          </Link>
          {movie.rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-sm text-gold">
              <Star className="size-3.5 fill-current" /> {movie.rating}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {movie.genres.join(", ")} · {movie.language}
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" /> {formatDuration(movie.duration)}
          {movie.status === "soon" && <> · Releases {formatDate(movie.releaseDate, { day: "numeric", month: "short", year: "numeric" })}</>}
        </p>
        {showDescription && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{movie.description}</p>}
        <div className="mt-auto pt-3">
          {movie.status === "now" ? (
            <Button asChild size="sm" className="w-full rounded-full">
              <Link to="/book" search={{ movie: movie.id }}>Book Now</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="secondary" className="w-full rounded-full">
              <Link to="/movies/$movieId" params={{ movieId: movie.id }}>View Details</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
