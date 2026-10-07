import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { MovieCard } from "@/components/MovieCard";
import { TheatreCard } from "@/components/TheatreCard";
import { PageHero, Empty } from "@/components/Section";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Search – Movie Magic" },
      { name: "description", content: "Search movies by name, theatre, genre or language." },
      { property: "og:title", content: "Search – Movie Magic" },
      { property: "og:description", content: "Find movies and theatres instantly." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const movies = useStore((s) => s.movies);
  const theatres = useStore((s) => s.theatres);
  const term = q.trim().toLowerCase();

  const theatreHits = term ? theatres.filter((t) => `${t.name} ${t.area} ${t.city}`.toLowerCase().includes(term)) : [];
  const movieHits = term
    ? movies.filter(
        (m) =>
          m.title.toLowerCase().includes(term) ||
          m.language.toLowerCase().includes(term) ||
          m.genres.some((g) => g.toLowerCase().includes(term)) ||
          theatreHits.some((t) => t.movieIds.includes(m.id)),
      )
    : [];

  return (
    <div>
      <PageHero title="Search" subtitle="Movie name, theatre, genre or language.">
        <div className="relative mt-6 max-w-xl">
          <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => navigate({ search: { q: e.target.value }, replace: true })}
            placeholder="Try “Sci-Fi”, “Hindi” or “INOX”"
            className="h-12 w-full rounded-full border border-input bg-secondary pl-12 pr-4 outline-none focus:border-primary"
          />
        </div>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {!term ? <Empty title="Start typing to search" /> : movieHits.length + theatreHits.length === 0 ? (
          <Empty title={`No results for “${q}”`}>Check the spelling or try a genre or language.</Empty>
        ) : (
          <>
            {movieHits.length > 0 && (
              <>
                <h2 className="text-3xl">Movies ({movieHits.length})</h2>
                <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">{movieHits.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
              </>
            )}
            {theatreHits.length > 0 && (
              <>
                <h2 className="mt-10 text-3xl">Theatres ({theatreHits.length})</h2>
                <div className="mt-4 grid gap-5 md:grid-cols-2">{theatreHits.map((t) => <TheatreCard key={t.id} theatre={t} />)}</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
