import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { login, signUp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up – Movie Magic" },
      { name: "description", content: "Sign in to Movie Magic to manage your movie bookings." },
      { property: "og:title", content: "Login or Sign Up – Movie Magic" },
      { property: "og:description", content: "Access your Movie Magic account." },
    ],
  }),
  component: AuthPage,
});

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const inputCls = "h-11 w-full rounded-xl border border-input bg-secondary px-4 text-sm outline-none focus:border-primary aria-[invalid=true]:border-destructive";

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (mode === "signup" && f.name.trim().length < 2) err.name = "Please enter your full name.";
    if (!emailOk(f.email)) err.email = "Enter a valid email address.";
    if (f.password.length < 6) err.password = "Password must be at least 6 characters.";
    if (mode === "signup" && f.password !== f.confirm) err.confirm = "Passwords do not match.";
    setErrors(err);
    if (Object.keys(err).length) return;
    try {
      if (mode === "login") login(f.email.trim(), f.password);
      else signUp(f.name.trim(), f.email.trim(), f.password);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      navigate({ to: "/" });
    } catch (ex) {
      toast.error((ex as Error).message);
    }
  };

  const field = (k: keyof typeof f, label: string, type = "text") => (
    <label className="block">
      <span className="mb-1 block text-sm">{label}</span>
      <input type={type} value={f[k]} onChange={upd(k)} aria-invalid={!!errors[k]} className={inputCls} />
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="mx-auto grid max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-glow">
        <div className="mb-6 grid grid-cols-2 rounded-full bg-secondary p-1">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setErrors({}); }} className={`rounded-full py-2 text-sm ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>
        <h1 className="text-5xl">{mode === "login" ? "Welcome back" : "Join Movie Magic"}</h1>
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          {mode === "signup" && field("name", "Full Name")}
          {field("email", "Email", "email")}
          {field("password", "Password", "password")}
          {mode === "signup" && field("confirm", "Confirm Password", "password")}
          <Button type="submit" variant="hero" size="lg" className="w-full">{mode === "login" ? "Login" : "Create account"}</Button>
        </form>
        <p className="mt-5 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
          Demo admin: <span className="font-mono text-foreground">admin@moviemagic.in</span> / <span className="font-mono text-foreground">admin123</span>. Accounts are stored in this browser for the demo.
        </p>
      </div>
    </div>
  );
}
