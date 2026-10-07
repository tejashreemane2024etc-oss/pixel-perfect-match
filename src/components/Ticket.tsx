import type { Booking } from "@/lib/store";
import { formatDate, inr } from "@/lib/data";
import { Clapperboard } from "lucide-react";

/** Digital ticket card — also used for printing. */
export function Ticket({ booking }: { booking: Booking }) {
  const rows: [string, string][] = [
    ["Theatre", booking.theatreName],
    ["Date", formatDate(booking.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })],
    ["Showtime", booking.time],
    ["Seats", booking.seats.join(", ")],
    ["Tickets", `${booking.seats.length} × ${inr(booking.price)}`],
    ["Total", inr(booking.total)],
  ];
  return (
    <div id="ticket" className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-glow">
      <div className="flex items-center justify-between bg-gradient-primary px-6 py-4">
        <span className="flex items-center gap-2 font-display text-2xl"><Clapperboard className="size-5" /> MovieMagic</span>
        <span className="text-xs font-semibold uppercase tracking-widest">{booking.status}</span>
      </div>
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Movie</p>
        <p className="font-display text-4xl leading-none">{booking.movieTitle}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4">
          {rows.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
              <dd className="truncate font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative border-t border-dashed border-border px-6 py-4">
        <span className="absolute -left-3 -top-3 size-6 rounded-full bg-background" />
        <span className="absolute -right-3 -top-3 size-6 rounded-full bg-background" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Booking ID</p>
            <p className="font-mono text-lg font-bold tracking-wider">{booking.id}</p>
          </div>
          {/* decorative barcode */}
          <div className="flex h-10 items-end gap-[2px]" aria-hidden>
            {booking.id.split("").map((c, i) => (
              <span key={i} className="bg-foreground" style={{ width: (c.charCodeAt(0) % 3) + 1, height: "100%" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
