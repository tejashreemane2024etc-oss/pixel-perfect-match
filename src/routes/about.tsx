import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, BellRing, Database, Monitor, Server, User } from "lucide-react";
import { PageHero } from "@/components/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Cloud Architecture – Movie Magic" },
      { name: "description", content: "How Movie Magic is designed to run on AWS EC2, DynamoDB and SNS." },
      { property: "og:title", content: "Cloud Architecture – Movie Magic" },
      { property: "og:description", content: "AWS EC2 + DynamoDB + SNS booking architecture." },
    ],
  }),
  component: About,
});

const FLOW = [
  { icon: User, title: "User", desc: "Browses movies and books seats from any device." },
  { icon: Monitor, title: "Movie Magic Web App", desc: "React + TypeScript frontend with responsive UI." },
  { icon: Server, title: "AWS EC2", desc: "Application server hosting the web app and booking APIs." },
  { icon: Database, title: "Amazon DynamoDB", desc: "NoSQL tables for Movies, Theatres, Shows, Bookings, Users." },
  { icon: BellRing, title: "Amazon SNS", desc: "Publishes a message when a booking is confirmed." },
  { icon: BellRing, title: "Booking Notification", desc: "User receives SMS / email confirmation." },
];

function About() {
  return (
    <div>
      <PageHero title="Cloud Architecture" subtitle="Movie Magic is a cloud practitioner project. This demo runs fully in the browser; the design below is the planned AWS deployment." />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-10 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          {FLOW.map((s, i) => (
            <div key={s.title} className="animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-glow"><s.icon className="size-6" /></span>
                <div className="min-w-0"><p className="font-display text-2xl leading-none">{s.title}</p><p className="text-sm text-muted-foreground">{s.desc}</p></div>
              </div>
              {i < FLOW.length - 1 && <ArrowDown className="mx-auto my-2 size-5 text-primary" />}
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <Block title="Frontend">Movie Magic web application — React, TypeScript and Tailwind CSS with reusable components.</Block>
          <Block title="Application server · AWS EC2">Hosts the app and exposes booking APIs (list movies, get seat map, create booking). Auto Scaling can be added for peak release days.</Block>
          <Block title="Database · Amazon DynamoDB">Tables: <code>Movies</code> (PK movieId), <code>Theatres</code> (PK theatreId), <code>Bookings</code> (PK bookingId, GSI userEmail), <code>Users</code> (PK email). Conditional writes prevent double-booking a seat.</Block>
          <Block title="Notifications · Amazon SNS">After a successful booking write, the server publishes to an SNS topic which delivers SMS/email confirmation.</Block>
          <Block title="This demo">All data lives in a local demo data layer (browser storage), so the project works without AWS credentials or paid APIs.</Block>
        </div>
      </div>
    </div>
  );
}

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div><h2 className="text-3xl text-primary">{title}</h2><p className="mt-1 text-muted-foreground">{children}</p></div>
);
