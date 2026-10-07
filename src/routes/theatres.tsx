import { createFileRoute } from "@tanstack/react-router";
import { CITIES } from "@/lib/data";
import { setCity, useStore } from "@/lib/store";
import { PageHero, Empty } from "@/components/Section";
import { TheatreCard } from "@/components/TheatreCard";

export const Route = createFileRoute("/theatres")({
  head: () => ({
    meta: [
      { title: "Theatres Near You – Movie Magic" },
      { name: "description", content: "Find cinemas near you with facilities, movies and showtimes." },
      { property: "og:title", content: "Theatres Near You – Movie Magic" },
      { property: "og:description", content: "Browse partner cinemas by location." },
    ],
  }),
  component: TheatresPage,
});

function TheatresPage() {
  const theatres = useStore((s) => s.theatres);
  const city = useStore((s) => s.city);
  const list = theatres.filter((t) => t.city === city).sort((a, b) => a.distanceKm - b.distanceKm);
  return (
    <div>
      <PageHero title="Theatres" subtitle="Partner cinemas sorted by distance from you.">
        <div className="mt-6 flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button key={c} onClick={() => setCity(c)} className={`rounded-full border px-4 py-2 text-sm ${c === city ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}>{c}</button>
          ))}
        </div>
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-2">
        {list.length ? list.map((t) => <TheatreCard key={t.id} theatre={t} />) : <Empty title="No theatres here yet" />}
      </div>
    </div>
  );
}
