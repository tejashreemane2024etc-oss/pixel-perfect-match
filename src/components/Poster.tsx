import type { Movie } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Stylised generated poster: layered gradients keyed to each movie's hues. */
export function Poster({ movie, className, large }: { movie: Movie; className?: string; large?: boolean }) {
  const [a, b] = movie.hues;
  const style = {
    backgroundImage: `radial-gradient(circle at 30% 20%, oklch(0.7 0.18 ${a} / 0.9), transparent 55%),
      radial-gradient(circle at 80% 85%, oklch(0.55 0.2 ${b} / 0.85), transparent 60%),
      linear-gradient(160deg, oklch(0.25 0.06 ${a}), oklch(0.1 0.02 ${b}))`,
  };
  return (
    <div
      className={cn("relative aspect-[2/3] overflow-hidden rounded-xl", className)}
      style={style}
      role="img"
      aria-label={`${movie.title} poster`}
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:repeating-linear-gradient(0deg,transparent_0_2px,oklch(1_0_0/0.15)_2px_3px)]" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-fade p-4 pt-16">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{movie.genres.join(" • ")}</p>
        <p className={cn("font-display leading-none text-foreground", large ? "text-5xl" : "text-3xl")}>{movie.title}</p>
      </div>
      <span className="absolute right-3 top-3 rounded border border-border bg-background/60 px-1.5 text-[10px] font-bold">
        {movie.certificate}
      </span>
    </div>
  );
}
