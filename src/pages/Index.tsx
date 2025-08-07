import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = heroRef.current;
    if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty("--pointer-x", `${e.clientX - rect.left}px`);
    r.style.setProperty("--pointer-y", `${e.clientY - rect.top}px`);
  };

  const copy = async (text: string, label = "Copied") => {
    await navigator.clipboard.writeText(text);
    toast(label);
  };

  const runCmd = `cd backend\nnpm ci\ncp .env.example .env\n# leave MONGO_URI=memory for demo\nnpm run dev`;
  const curlSignup = `curl -s -X POST http://localhost:3000/api/auth/signup -H 'Content-Type: application/json' -d '{"email":"a@b.com","password":"password"}'`;
  const curlLogin = `curl -s -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"a@b.com","password":"password"}'`;
  const curlCreate = `TOKEN=__PASTE_TOKEN__\ncurl -s -X POST http://localhost:3000/api/notes -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"title":"First","content":"Hello"}'`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        ref={heroRef}
        onMouseMove={onMove}
        className="hero-surface px-6 py-20 md:py-28"
        aria-label="Notes API overview"
      >
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <Badge>Backend Showcase</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Notes API – Express + MongoDB</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            JWT auth, user‑scoped CRUD with pagination, Swagger docs, Docker & CI. 90%+ Jest coverage.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <a href="#quickstart">Quick start</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="#endpoints">API examples</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">Swagger /api-docs</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-24 space-y-12">
        <section id="quickstart" className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4 overflow-auto">
                <pre className="text-sm leading-relaxed">{runCmd}</pre>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => copy(runCmd, "Commands copied")}>Copy</Button>
                <Button variant="secondary" asChild>
                  <a href="/README.md" download>
                    Download README
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stack</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {[
                "Express",
                "MongoDB/Mongoose",
                "JWT",
                "Jest/Supertest",
                "Swagger",
                "Rate limit",
                "Docker",
                "GitHub Actions",
                "Redis (optional)",
              ].map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="endpoints" className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md bg-muted p-3 overflow-auto">
                <pre className="text-xs">{curlSignup}</pre>
              </div>
              <Button size="sm" onClick={() => copy(curlSignup)}>Copy curl</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md bg-muted p-3 overflow-auto">
                <pre className="text-xs">{curlLogin}</pre>
              </div>
              <Button size="sm" onClick={() => copy(curlLogin)}>Copy curl</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md bg-muted p-3 overflow-auto">
                <pre className="text-xs">{curlCreate}</pre>
              </div>
              <Button size="sm" onClick={() => copy(curlCreate)}>Copy curl</Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
