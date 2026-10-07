import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Clapperboard, Menu, Search, MapPin, X, LogOut } from "lucide-react";
import { CITIES } from "@/lib/data";
import { logout, setCity, useStore } from "@/lib/store";
import { Button } from "./ui/button";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/theatres", label: "Theatres" },
  { to: "/offers", label: "Offers" },
  { to: "/bookings", label: "My Bookings" },
  { to: "/about", label: "Cloud Architecture" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const city = useStore((s) => s.city);
  const session = useStore((s) => s.session);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q } });
    setOpen(false);
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
            <Clapperboard className="size-5" />
          </span>
          <span className="font-display text-2xl tracking-wider">Movie<span className="text-primary">Magic</span></span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submit} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, theatres…"
              className="h-9 w-48 rounded-full border border-input bg-secondary pl-9 pr-3 text-sm outline-none focus:border-primary xl:w-60"
            />
          </form>
          <label className="hidden items-center gap-1 rounded-full border border-input px-2 sm:flex">
            <MapPin className="size-4 text-primary" />
            <select
              aria-label="Location"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-9 bg-transparent text-sm outline-none [&>option]:bg-card"
            >
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          {session ? (
            <div className="hidden items-center gap-2 sm:flex">
              {session.isAdmin && (
                <Button asChild size="sm" variant="secondary" className="rounded-full"><Link to="/admin">Admin</Link></Button>
              )}
              <span className="max-w-24 truncate text-sm">Hi, {session.name.split(" ")[0]}</span>
              <Button size="icon" variant="ghost" aria-label="Log out" onClick={() => { logout(); toast("Logged out"); }}>
                <LogOut />
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" variant="hero" className="hidden sm:inline-flex">
              <Link to="/login">Login / Sign Up</Link>
            </Button>
          )}
          <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border px-4 pb-4 lg:hidden">
          <form onSubmit={submit} className="relative mt-3">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-10 w-full rounded-full border border-input bg-secondary pl-9 pr-3 text-sm outline-none" />
          </form>
          <nav className="mt-3 grid gap-1">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-accent">{n.label}</Link>
            ))}
            {session?.isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-accent">Admin Dashboard</Link>}
          </nav>
          <div className="mt-3 flex items-center gap-2">
            <select aria-label="Location" value={city} onChange={(e) => setCity(e.target.value)} className="h-10 flex-1 rounded-full border border-input bg-secondary px-3 text-sm [&>option]:bg-card">
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {session ? (
              <Button variant="outline" className="rounded-full" onClick={() => { logout(); setOpen(false); }}>Log out</Button>
            ) : (
              <Button asChild variant="hero"><Link to="/login" onClick={() => setOpen(false)}>Login</Link></Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-muted-foreground md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-foreground">Movie<span className="text-primary">Magic</span></p>
          <p className="mt-2">Smart movie ticket booking — a cloud practitioner demo project.</p>
        </div>
        <div className="flex flex-col gap-1">
          <Link to="/movies" className="hover:text-foreground">Movies</Link>
          <Link to="/theatres" className="hover:text-foreground">Theatres</Link>
          <Link to="/offers" className="hover:text-foreground">Offers</Link>
          <Link to="/about" className="hover:text-foreground">Cloud Architecture</Link>
        </div>
        <p>Planned on AWS EC2 · Amazon DynamoDB · Amazon SNS. Demo data stored in your browser.</p>
      </div>
    </footer>
  );
}
