import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { cancelBooking, useStore, type Booking } from "@/lib/store";
import { formatDate, inr, upcomingDates } from "@/lib/data";
import { PageHero, Empty } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings – Movie Magic" },
      { name: "description", content: "View your upcoming and previous movie ticket bookings." },
      { property: "og:title", content: "My Bookings – Movie Magic" },
      { property: "og:description", content: "All your Movie Magic tickets in one place." },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const all = useStore((s) => s.bookings);
  const session = useStore((s) => s.session);
  const mine = session?.isAdmin ? all : all.filter((b) => b.userEmail === (session?.email ?? "guest"));
  const today = upcomingDates(1)[0];
  const upcoming = mine.filter((b) => b.date >= today && b.status === "Confirmed");
  const previous = mine.filter((b) => !(b.date >= today && b.status === "Confirmed"));

  return (
    <div>
      <PageHero title="My Bookings" subtitle={session ? `Signed in as ${session.email}` : "Showing guest bookings on this device. Log in to keep them with your account."} />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="text-3xl">Upcoming</h2>
        <div className="mt-4 grid gap-3">
          {upcoming.length ? upcoming.map((b) => <Row key={b.id} b={b} canCancel />) : (
            <Empty title="No upcoming bookings"><Button asChild variant="hero" className="mt-3"><Link to="/book">Book a movie</Link></Button></Empty>
          )}
        </div>
        <h2 className="mt-12 text-3xl">Previous</h2>
        <div className="mt-4 grid gap-3">
          {previous.length ? previous.map((b) => <Row key={b.id} b={b} />) : <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
        </div>
      </div>
    </div>
  );
}

function Row({ b, canCancel }: { b: Booking; canCancel?: boolean }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs", b.status === "Confirmed" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>{b.status}</span>
        </div>
        <p className="mt-1 font-display text-3xl leading-none">{b.movieTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {b.theatreName} · {formatDate(b.date)} · {b.time} · Seats {b.seats.join(", ")} · {inr(b.total)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm"><Link to="/confirmation/$bookingId" params={{ bookingId: b.id }}>View Ticket</Link></Button>
        {canCancel && (
          <Button variant="ghost" size="sm" onClick={() => { if (confirm("Cancel this booking?")) { cancelBooking(b.id); toast("Booking cancelled"); } }}>Cancel</Button>
        )}
      </div>
    </div>
  );
}
