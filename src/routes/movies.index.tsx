import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { GENRES, LANGUAGES } from "@/lib/data";
import { useStore } from "@/lib/store";
import { MovieCard } from "@/components/MovieCard";
import { PageHero, Empty } from "@/components/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/movies/")({
  head: () => ({
    meta: [
      { title: "Movies – Movie Magic" },
      { name: "description", content: "Browse now showing and coming soon movies. Filter by genre, language and rating." },
      { property: "og:title", content: "Movies – Movie Magic" },
      { property: "og:description", content: "Browse and filter movies playing near you." },
    ],
  }),
  component: MoviesPage,
});

const sel = "h-10 rounded-full border border-input bg-secondary px-4 text-sm outline-none focus:border-primary [&>option]:bg-card";

function MoviesPage() {
  const movies = useStore((s) => s.movies);
  const [tab, setTab] = useState<"now" | "soon">("now");
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [lang, setLang] = useState("");
  const [minRating, setMinRating] = useState(0);

  const list = movies.filter(
    (m) =>
      m.status === tab &&
      m.title.toLowerCase().includes(q.toLowerCase()) &&
      (!genre || m.genres.includes(genre)) &&
      (!lang || m.language === lang) &&
      (tab === "soon" || m.rating >= minRating),
  );
  const reset = () => { setQ(""); setGenre(""); setLang(""); setMinRating(0); };

  return (
    <div>
      <PageHero title="Movies" subtitle="Everything playing now and what's coming next.">
        <div className="mt-6 inline-flex rounded-full border border-border bg-secondary p-1">
          {(["now", "soon"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-sm transition ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {t === "now" ? "Now Showing" : "Coming Soon"}
            </button>
          ))}
        </div>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search movies" className={`${sel} w-full pl-9`} />
          </div>
          <select aria-label="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} className={sel}>
            <option value="">All genres</option>
            {GENRES.map((g) => <option key={g}>{g}</option>)}
          </select>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)} className={sel}>
            <option value="">All languages</option>
            {LANGUAGES.map((g) => <option key={g}>{g}</option>)}
          </select>
          <select aria-label="Rating" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className={sel} disabled={tab === "soon"}>
            <option value={0}>Any rating</option>
            <option value={7}>7+</option>
            <option value={8}>8+</option>
            <option value={8.5}>8.5+</option>
          </select>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{list.length} movie{list.length !== 1 && "s"} found</p>
        <div className="mt-6">
          {list.length ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((m) => <MovieCard key={m.id} movie={m} showDescription />)}
            </div>
          ) : (
            <Empty title="No movies match">
              Try different filters. <Button variant="link" onClick={reset}>Clear filters</Button>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
}
