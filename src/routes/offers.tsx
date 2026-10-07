import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Percent } from "lucide-react";
import { toast } from "sonner";
import { OFFERS } from "@/lib/data";
import { PageHero } from "@/components/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Deals – Movie Magic" },
      { name: "description", content: "Student discounts, weekend deals and more on movie tickets." },
      { property: "og:title", content: "Offers & Deals – Movie Magic" },
      { property: "og:description", content: "Save on your next movie night." },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  return (
    <div>
      <PageHero title="Offers" subtitle="Demo offers — codes are shown for presentation and not applied at checkout." />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-2">
        {OFFERS.map((o) => (
          <div key={o.code} className="animate-rise relative overflow-hidden rounded-2xl border border-border bg-card p-6">
            <Percent className="absolute -right-6 -top-6 size-36 text-primary/10" />
            <span className="rounded-full bg-accent px-3 py-1 text-xs text-primary">{o.tag}</span>
            <h3 className="mt-3 text-4xl leading-none">{o.title}</h3>
            <p className="mt-2 text-muted-foreground">{o.desc}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => { navigator.clipboard?.writeText(o.code); toast.success(`Code ${o.code} copied`); }}
                className="flex items-center gap-2 rounded-lg border border-dashed border-primary px-3 py-2 font-mono text-sm"
              >
                {o.code} <Copy className="size-3.5" />
              </button>
              <Button asChild variant="hero"><Link to="/book">Book now</Link></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
