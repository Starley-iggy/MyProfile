"use client";
/**
 * app/page.tsx  (Next.js App Router)
 *
 * Waarom "use client"?
 * - Framer Motion (animaties) werkt in de browser
 * - We halen GitHub repos op via fetch() in de browser (client-side)
 *
 * Let op:
 * - Client-side GitHub fetch kan soms rate limits geven als je vaak refresh.
 * - Voor “super pro” kan dit later server-side met revalidate (maar voor nu: makkelijk & werkt direct).
 */

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/**
 * Shadcn/ui components:
 * - Deze zijn gewoon React components die in jouw projectfolder worden gezet.
 * - Daarom moeten ze ook echt bestaan in /components/ui/...
 */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * TypeScript type voor de GitHub repo response.
 * We nemen alleen de velden die we nodig hebben (subset).
 */
type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  homepage: string | null;
  fork?: boolean;
};

/**
 * PROFIEL INFO
 * - Alles wat persoonlijk is zet je hier zodat je het op 1 plek kunt aanpassen.
 * - Vervang LinkedIn URL met jouw echte profiel link.
 */
const PROFILE = {
  name: "Starley Igbinomwhaia Briggs",
  tagline: "Student Software Engineering • Probleemoplossend • Creatief",
  email: "starleybriggs4@gmail.com",
  location: "Leeuwarden, Nederland",

  // GitHub
  githubUsername: "Starley-iggy",
  githubUrl: "https://github.com/Starley-iggy",

  // LinkedIn (vervang dit!)
  linkedinUrl: "https://www.linkedin.com/in/starley-igbinomwhaia-briggs-a851432aa/",
};

/**
 * CERTIFICATEN
 * LinkedIn heeft niet makkelijk een publieke API om “automatisch” je certificaten te pullen.
 * Professionele oplossing: je beheert een lijst met jouw certificaten + credential URLs.
 *
 * Tip:
 * - Als je een “Credential URL” hebt in LinkedIn, plak die bij credentialUrl.
 * - Anders kun je linken naar je LinkedIn profiel of de certificaten-sectie.
 */
const CERTIFICATES = [
  {
    title: "Coding foundations",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-HGXQVGBL",
  },
  {
    title: "Tech for everyone",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-0Q77WDTM",
  },
  {
    title: "Introduction to Java",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-L3UZOQWB",
  },
  {
    title: "Write with AI",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-1OLZEK7W",
  },
  {
    title: "Introduction to SQL",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-YCCQ1VXI",
  },
  {
    title: "SQL Intermediate",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-5KIHKP7Y",
  },
  {
    title: "Data Analysis with AI",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-OPIQ73VY",
  },
  {
    title: "Java Intermediate",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-I5G0AMCP",
  },
  {
    title: "Social Media Marketing with AI",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-AMSOTNOP",
  },
] as const;

/**
 * Date formatting helper:
 * - Voor "Updated: dec 2025" vibe
 */
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("nl-NL", { year: "numeric", month: "short" });
}

export default function Page() {
  /**
   * GitHub repos state:
   * - repos: lijst met repos die we tonen
   * - loading: “laden…” state voor UX
   * - error: als fetch faalt, tonen we een nette fallback
   */
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Skills badges (over mij):
   * - useMemo is niet verplicht, maar netjes (stabiel array reference)
   */
  const skills = useMemo(
    () => ["React", "TypeScript", "Next.js", "Tailwind", "Git/GitHub" , "Python", "Java", "MySQL", "PHP" , "HTML", "CSS", "C#", "Vercel"],
    []
  );

  /**
   * GitHub repos ophalen bij het laden van de pagina.
   * We:
   * 1) Fetch alle repos (max 100)
   * 2) Filter forks eruit
   * 3) Sorteren op:
   *    - eerst stars (meest “impact”)
   *    - dan recent update (actief)
   * 4) Nemen top 6
   */
  useEffect(() => {
    let cancelled = false;

    async function loadRepos() {
      try {
        setLoading(true);
        setError(null);

        const url = `https://api.github.com/users/${PROFILE.githubUsername}/repos?per_page=100&sort=updated`;

        const res = await fetch(url, {
          headers: { Accept: "application/vnd.github+json" },
        });

        // Als res.ok false is: error status zoals 403 (rate limit) / 404 etc.
        if (!res.ok) throw new Error(`GitHub API error (${res.status})`);

        const data = (await res.json()) as Repo[];

        // Als component al ge-unmount is, niet meer state updaten
        if (cancelled) return;

        const filtered = data
          .filter((r) => !r.fork) // verwijder forks
          .sort(
            (a, b) =>
              (b.stargazers_count - a.stargazers_count) ||
              +new Date(b.updated_at) - +new Date(a.updated_at)
          )
          .slice(0, 6);

        setRepos(filtered);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    loadRepos();

    // Cleanup: voorkomt state updates na unmount
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * THEME / STYLE TOKENS (dark mode)
   * We gebruiken geen “pure black” (#000) omdat dat slecht leest.
   * In plaats daarvan: graphite + subtiele gradient + zachte glow.
   */
  const pageBg =
    "bg-gradient-to-b from-[#0b1020] via-[#070A12] to-[#05060B]";
  const textSub = "text-zinc-300";
  const textMuted = "text-zinc-400";

  // Card style: glassy, subtiel, betere contrast
  const cardBase =
    "bg-white/5 border border-white/10 rounded-2xl backdrop-blur";
  const cardHover =
    "hover:bg-white/7 hover:border-white/15 transition-colors";

  return (
    <main className={`min-h-screen ${pageBg} text-zinc-100`}>
      {/* ============================================================
          BACKGROUND GLOWS
          - Alleen decoratie (pointer-events-none)
          - Geeft contrast zodat tekst beter leesbaar is
         ============================================================ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute top-40 right-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* ============================================================
          CONTENT WRAPPER
          - relative zodat background glows “achter” blijven
         ============================================================ */}
      <div className="relative px-6 py-10 md:px-12 md:py-14">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* ============================================================
              HERO / HEADER
              - Motion header = subtiele fade/slide-in
             ============================================================ */}
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-center space-y-4"
          >
            <p className={`text-sm ${textMuted}`}>Portfolio</p>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {PROFILE.name}
            </h1>

            <p className={`text-lg ${textSub}`}>{PROFILE.tagline}</p>

            {/* Buttons / CTA's */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2">
              {/* Scroll naar contact */}
              <Button
                className="bg-indigo-500 text-white hover:bg-indigo-400"
                onClick={() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contact
              </Button>

              {/* CV download
                  - Zet je cv in /public/cv.pdf zodat deze link werkt
               */}
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
                asChild
              >
                <a href="/cv.pdf" download>
                  Download CV
                </a>
              </Button>

              {/* GitHub link */}
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
                asChild
              >
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub
                </a>
              </Button>

              {/* LinkedIn link */}
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
                asChild
              >
                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  LinkedIn
                </a>
              </Button>
            </div>
          </motion.header>

          {/* ============================================================
              OVER MIJ
             ============================================================ */}
          <Card className={`${cardBase} ${cardHover}`}>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-2xl font-semibold text-zinc-100">Over mij</h2>

              <p className={`${textSub} leading-relaxed`}>
                Ik ben een gemotiveerde student met een passie voor leren en groeien in mijn vakgebied.
                 Momenteel ben ik bezig met mijn Sololearning Software Developing op Firda.
                  Ben nu aan de slag met Python, Java, mysql en php om daar ook gevorderd in te worden.
              </p>

              {/* Skills badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="bg-white/8 text-zinc-200 border border-white/10"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ============================================================
              PROJECTEN (GITHUB)
             ============================================================ */}
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Projecten</h2>
                <p className={`text-sm ${textMuted}`}>
                  Automatisch geladen vanaf GitHub ({PROFILE.githubUsername})
                </p>
              </div>

              {/* Link naar alle repositories */}
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
                asChild
              >
                <a
                  href={`https://github.com/${PROFILE.githubUsername}?tab=repositories`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Alle repos
                </a>
              </Button>
            </div>

            {/* Loading state */}
            {loading && (
              <Card className={cardBase}>
                <CardContent className={`p-6 ${textMuted}`}>
                  Projecten laden…
                </CardContent>
              </Card>
            )}

            {/* Error state */}
            {!loading && error && (
              <Card className={cardBase}>
                <CardContent className="p-6 space-y-3">
                  <p className={textMuted}>
                    Kon GitHub projecten niet laden:{" "}
                    <span className="text-zinc-200">{error}</span>
                  </p>

                  <Button
                    className="bg-indigo-500 text-white hover:bg-indigo-400"
                    asChild
                  >
                    <a
                      href={PROFILE.githubUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Open GitHub profiel
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Success state: grid met repos */}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 gap-6">
                {repos.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06 + index * 0.04,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={{ y: -3 }}
                  >
                    <Card className={`${cardBase} ${cardHover}`}>
                      <CardContent className="p-6 space-y-3">
                        {/* Titel + language badge */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-xl font-semibold text-zinc-100">{repo.name}</h3>
                          {repo.language ? (
                            <Badge className="bg-white/8 text-zinc-200 border border-white/10">
                              {repo.language}
                            </Badge>
                          ) : null}
                        </div>

                        {/* Beschrijving */}
                        <p className={`${textSub} leading-relaxed min-h-[44px]`}>
                          {repo.description ?? "Geen beschrijving toegevoegd."}
                        </p>

                        {/* Stats + update */}
                        <div className={`flex items-center justify-between text-sm ${textMuted}`}>
                          <span>
                            ⭐ {repo.stargazers_count} • 🍴 {repo.forks_count}
                          </span>
                          <span>Updated: {formatDate(repo.updated_at)}</span>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Buttons */}
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            className="bg-indigo-500 text-white hover:bg-indigo-400"
                            asChild
                          >
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              GitHub
                            </a>
                          </Button>

                          {/* Live link als repo.homepage bestaat */}
                          {repo.homepage ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
                              asChild
                            >
                              <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                Live
                              </a>
                            </Button>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* ============================================================
              CERTIFICATEN
             ============================================================ */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">Certificaten</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {CERTIFICATES.map((c, index) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 + index * 0.04,
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -2 }}
                >
                  <Card className={`${cardBase} ${cardHover}`}>
                    <CardContent className="p-6 space-y-2">
                      <h3 className="font-semibold text-zinc-100">{c.title}</h3>
                      <p className={`${textMuted} text-sm`}>
                        {c.issuer} • {c.year}
                      </p>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10 mt-2"
                        asChild
                      >
                        <a
                          href={c.credentialUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Bekijk credential
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ============================================================
              CONTACT
             ============================================================ */}
          <section id="contact">
            <Card className={`${cardBase} ${cardHover}`}>
              <CardContent className="p-6 space-y-2">
                <h2 className="text-2xl font-semibold text-zinc-100">Contact</h2>

                <p className={textSub}>
                  📧{" "}
                  <a
                    className="underline underline-offset-4 hover:text-white"
                    href={`mailto:${PROFILE.email}`}
                  >
                    {PROFILE.email}
                  </a>
                </p>

                <p className={textSub}>📍 {PROFILE.location}</p>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-500 pt-2">
            © {new Date().getFullYear()} {PROFILE.name} • Built with Next.js
          </p>
        </div>
      </div>
    </main>
  );
}
