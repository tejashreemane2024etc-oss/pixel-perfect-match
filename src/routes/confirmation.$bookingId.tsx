import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, CheckCircle2, Download, Printer } from "lucide-react";
import { useStore, type Booking } from "@/lib/store";
import { formatDate, inr } from "@/lib/data";
import { Ticket } from "@/components/Ticket";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/Section";

export const Route = createFileRoute("/confirmation/$bookingId")({
  head: () => ({
    meta: [
      { title: "Booking Confirmed – Movie Magic" },
      { name: "description", content: "Your Movie Magic e-ticket and booking details." },
      { property: "og:title", content: "Booking Confirmed – Movie Magic" },
      { property: "og:description", content: "Your digital movie ticket." },
    ],
  }),
  component: Confirmation,
});

/** Download a plain-text e-ticket (no external libraries needed). */
function downloadTicket(b: Booking) {
  const text = [
    "MOVIE MAGIC – E-TICKET", "======================",
    `Booking ID : ${b.id}`, `Movie      : ${b.movieTitle}`, `Theatre    : ${b.theatreName}`,
    `Date       : ${formatDate(b.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`,
    `Showtime   : ${b.time}`, `Seats      : ${b.seats.join(", ")}`, `Tickets    : ${b.seats.length}`,
    `Total      : Rs. ${b.total}`, `Status     : ${b.status}`, "", "Show this ticket at the theatre entrance.",
  ].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: `${b.id}.txt` });
  a.click();
  URL.revokeObjectURL(url);
}

function Confirmation() {
  const { bookingId } = Route.useParams();
  const bookings = useStore((s) => s.bookings);
  const b = bookings.find((x) => x.id === bookingId);
  if (!b) return <div className="mx-auto max-w-3xl px-4 py-20"><Empty title="Booking not found"><Link to="/bookings" className="text-primary">Go to My Bookings</Link></Empty></div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="no-print animate-rise text-center">
        <CheckCircle2 className="mx-auto size-16 text-success" />
        <h1 className="mt-3 text-6xl">{b.status === "Confirmed" ? "Booking Confirmed!" : "Booking Cancelled"}</h1>
        <p className="mt-2 text-muted-foreground">{b.seats.length} ticket{b.seats.length > 1 && "s"} · {inr(b.total)}</p>
        {b.status === "Confirmed" && (
          <p className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 py-2 text-sm text-success">
            <BellRing className="size-4" /> Your booking confirmation notification has been sent.
          </p>
        )}
      </div>
      <div className="mt-8 animate-rise"><Ticket booking={b} /></div>
      <div className="no-print mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="hero" onClick={() => downloadTicket(b)}><Download /> Download Ticket</Button>
        <Button variant="glass" onClick={() => window.print()}><Printer /> Print Ticket</Button>
        <Button asChild variant="ghost"><Link to="/">Back to Home</Link></Button>
      </div>
      <p className="no-print mt-6 text-center text-xs text-muted-foreground">Notification simulated for demo — in production, Amazon SNS sends this by SMS/email.</p>
    </div>
  );
}
