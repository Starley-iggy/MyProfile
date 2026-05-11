"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

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

const PROFILE = {
  name: "Starley Igbinomwhaia-Briggs",
  tagline: "Software Engineering Student • Creatieve Denker • Oog voor Detail • Sociaal en Communicatief • Probleemoplosser",
  email: "starleybriggs4@gmail.com",
  location: "Leeuwarden, Nederland",
  githubUsername: "Starley-iggy",
  githubUrl: "https://github.com/Starley-iggy",
  linkedinUrl: "https://www.linkedin.com/in/starley-igbinomwhaia-briggs-a851432aa/",
  nieuwsArtikelUrl:
    "https://www.actiefonline.nl/nieuws/algemeen/67989/stap-in-het-leven-van-bonifatius",
};

const roles = [
  "Software Engineering Student",
  "Creatieve Denker",
  "Oog voor Detail",
  "Sociaal en Communicatief",
  "Probleemoplossend",
];

const CERTIFICATES = [
  {
    title: "Coding Foundations",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-HGXQVGBL",
  },
  {
    title: "Tech for Everyone",
    issuer: "Sololearn",
    year: "2025",
    credentialUrl: "https://www.sololearn.com/certificates/CC-0Q77WDTM",
  },
  {
    title: "Java Certificates",
    issuer: "Sololearn",
    year: "2025",
    links: [
      {
        label: "Java Introduction",
        credentialUrl: "https://www.sololearn.com/certificates/CC-L3UZOQWB",
      },
      {
        label: "Java Intermediate",
        credentialUrl: "https://www.sololearn.com/certificates/CC-I5G0AMCP",
      },
    ],
  },
  {
    title: "SQL Certificates",
    issuer: "Sololearn",
    year: "2025",
    links: [
      {
        label: "SQL Introduction",
        credentialUrl: "https://www.sololearn.com/certificates/CC-YCCQ1VXI",
      },
      {
        label: "SQL Intermediate",
        credentialUrl: "https://www.sololearn.com/certificates/CC-5KIHKP7Y",
      },
    ],
  },
  {
    title: "AI Certificates",
    issuer: "Sololearn",
    year: "2025",
    links: [
      {
        label: "Write with AI",
        credentialUrl: "https://www.sololearn.com/certificates/CC-1OLZEK7W",
      },
      {
        label: "Social Media Marketing with AI",
        credentialUrl: "https://www.sololearn.com/certificates/CC-AMSOTNOP",
      },
      {
        label: "Generative AI in Practice",
        credentialUrl: "https://www.sololearn.com/certificates/CC-LLTJQJAE",
      },
    ],
  },
  {
    title: "Data Science Certificates",
    issuer: "Sololearn",
    year: "2025-2026",
    links: [
      {
        label: "Data Analysis with AI",
        credentialUrl: "https://www.sololearn.com/certificates/CC-OPIQ73VY",
      },
      {
        label: "Machine Learning for Beginners",
        credentialUrl: "https://www.sololearn.com/certificates/CC-HNLBQJA2",
      },
      {
        label: "Visualize your Data",
        credentialUrl: "https://www.sololearn.com/certificates/CC-ZG4DVYGE",
      },
    ],
  },
  {
    title: "Web Development",
    issuer: "Sololearn",
    year: "2026",
    credentialUrl: "https://www.sololearn.com/certificates/CC-PTLTEH2T",
  },
  {
    title: "Python Developer",
    issuer: "Sololearn",
    year: "2026",
    credentialUrl: "https://www.sololearn.com/certificates/CC-4ANM8Y6X",
  },
  {
    title: "C++ Certificate",
    issuer: "Sololearn",
    year: "2026",
    links: [
      {
        label: "C++ Introduction",
        credentialUrl: "https://www.sololearn.com/certificates/CC-CJJOKOV8",
      },
      {
        label: "C++ Intermediate",
        credentialUrl: "https://www.sololearn.com/certificates/CC-D1CIYBLS",
      },
    ],
  },
  {
  title: "System Integration Specialist Certificate",
  issuer: "Frank!academy",
  year: "2026",
  credentialUrl: "https://wearefrank.nl/frank-academy",
  image: "/Frank-Certs.png",
  },
] as const;


function useTypingEffect(words: string[]) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (letterIndex === currentWord.length + 1) {
      const pause = setTimeout(() => {
        setLetterIndex(0);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 1200);

      return () => clearTimeout(pause);
    }

    const timer = setTimeout(() => {
      setText(currentWord.substring(0, letterIndex));
      setLetterIndex((prev) => prev + 1);
    }, 75);

    return () => clearTimeout(timer);
  }, [letterIndex, wordIndex, words]);

  return text;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "short",
  });
}

export default function Page() {
  const typedText = useTypingEffect(roles);

  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificateImage, setSelectedCertificateImage] = useState<{
  src: string;
  title: string;
} | null>(null);

  const skills = useMemo(
    () => [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Python",
      "Java",
      "PHP",
      "MySQL",
      "HTML",
      "CSS",
      "C#",
      "C++",
      "Vercel",
      "Git/GitHub",
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function loadRepos() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://api.github.com/users/${PROFILE.githubUsername}/repos?per_page=100&sort=updated`,
          {
            headers: {
              Accept: "application/vnd.github+json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`GitHub API error (${res.status})`);
        }

        const data: Repo[] = await res.json();

        if (cancelled) return;

        const filtered = data
          .filter((repo) => !repo.fork)
          .sort(
            (a, b) =>
              b.stargazers_count - a.stargazers_count ||
              +new Date(b.updated_at) - +new Date(a.updated_at)
          )
          .slice(0, 6);

        setRepos(filtered);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    loadRepos();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#0b1020] via-[#070A12] to-[#05060B] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 space-y-20">
        <section className="flex min-h-[70vh] flex-col items-center justify-between gap-12 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl space-y-6"
          >
            <Badge className="bg-white/10 text-zinc-200 hover:bg-white/20">
              Portfolio
            </Badge>

            <p className="text-zinc-400">Hallo, Ik ben</p>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {PROFILE.name}
              </span>
            </h1>

            <p className="h-7 text-lg text-zinc-300 md:text-xl">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>

            <p className="max-w-xl text-zinc-400">
              Hallo! Ik ben een Software Engineering student uit Leeuwarden met
                  een passie voor technologie en innovatie. Ik hou ervan om te
                  leren, te experimenteren en uitdagende projecten tot leven te
                  brengen.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-indigo-500 hover:bg-indigo-400"
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Projects
              </Button>

              <Button
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Contact
              </Button>

              <Button
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                asChild
              >
                <a href="/cv.pdf" download>
                  Download CV
                </a>
              </Button>

              <Button
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                asChild
              >
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </Button>

              <Button
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                asChild
              >
                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </Button>
              <Button
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  asChild
                >
                  <a
                    href={PROFILE.nieuwsArtikelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nieuwsartikel
                  </a>
                </Button>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative w-[260px] h-[260px] md:w-[340px] md:h-[340px]"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 blur-[120px] rounded-full"></div>

            {/* Image */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-xl transition-transform duration-500 hover:scale-105">
              <Image
                src="/profile.jpg"
                alt="Profile picture"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </section>

        <section id="about">
          <Card className="rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur">
            <CardContent className="space-y-5 p-6">
              <div>
                <h2 className="text-2xl font-semibold text-center">Over mij</h2>
                <p className="mt-3 max-w-5xl text-zinc-400 text-center">
                  Ik ben iemand die energie haalt uit zowel beweging als verdieping.
                  </p>

                  <p className="mt-3 max-w-5xl text-zinc-400 text-center">
                   Jarenlang stond ik op het voetbalveld, waar ik leerde wat discipline en teamwork echt betekenen. 
                  De afgelopen jaren heb ik die drive meegenomen naar basketbal, een sport die mijn snelheid en spelinzicht blijft uitdagen.
                  </p>

                   <p className="mt-3 max-w-5xl text-zinc-400 text-center">
                   Naast sport duik ik graag in filosofie, om mijn blik te verbreden en scherp te blijven denken.
                    Tegelijk ben ik mezelf creatief aan het ontwikkelen door piano te leren spelen een proces dat geduld, focus en expressie samenbrengt. 
                    </p>

                    <p className="mt-5 max-w-5xl text-zinc-400 text-center">  
                    
                  Die combinatie van fysiek, mentaal en creatief groeien typeert wie ik ben.

                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-white/10 text-zinc-200 hover:bg-white/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="projects">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-semibold">Projecten</h2>
              <p className="mt-2 text-zinc-400">
                Automatisch geladen vanaf GitHub ({PROFILE.githubUsername}).
              </p>
            </div>

            <Button
              variant="outline"
              className="w-fit border-white/20 bg-white/5 text-white hover:bg-white/10"
              asChild
            >
              <a
                href={`${PROFILE.githubUrl}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Alle repos
              </a>
            </Button>
          </div>

          {loading ? (
            <Card className="rounded-2xl border-white/10 bg-white/5 text-white">
              <CardContent className="p-6 text-zinc-400">
                Projecten laden...
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="rounded-2xl border-white/10 bg-white/5 text-white">
              <CardContent className="space-y-4 p-6">
                <p className="text-zinc-400">
                  Kon GitHub projecten niet laden: {error}
                </p>

                <Button asChild>
                  <a
                    href={PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open GitHub profiel
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {repos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <Card className="h-full rounded-2xl border-white/10 bg-white/5 text-white transition hover:-translate-y-1 hover:bg-white/[0.07]">
                    <CardContent className="flex h-full flex-col justify-between space-y-4 p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-xl font-semibold">
                            {repo.name}
                          </h3>

                          {repo.language && (
                            <Badge className="bg-indigo-500/20 text-indigo-200">
                              {repo.language}
                            </Badge>
                          )}
                        </div>

                        <p className="min-h-[48px] text-zinc-400">
                          {repo.description ?? "Geen beschrijving toegevoegd."}
                        </p>

                        <div className="text-sm text-zinc-500">
                          ⭐ {repo.stargazers_count} • 🍴 {repo.forks_count} •
                          Updated {formatDate(repo.updated_at)}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Separator className="bg-white/10" />

                        <div className="flex flex-wrap gap-3 ">
                          <Button size="sm" 
                          variant="outline"
                              className="border-white/20 text-white bg-indigo-500 hover:bg-indigo-400 hover:bg-white/10" 
                          asChild>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              GitHub
                            </a>
                          </Button>

                          {repo.homepage && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                              asChild
                            >
                              <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Live
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section id="certificates">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Certificaten</h2>
            <p className="mt-2 text-zinc-400">
              Een overzicht van behaalde certificaten en leertrajecten.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CERTIFICATES.map((certificate, index) => (
              <motion.div
                key={certificate.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <Card className="h-full rounded-2xl border-white/10 bg-white/5 text-white">
                  <CardContent className="space-y-4 p-6">
                    {"image" in certificate && certificate.image && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCertificateImage({
                            src: certificate.image,
                            title: certificate.title,
                          })
                        }
                        className="group relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5"
                      >
                        <Image
                          src={certificate.image}
                          alt={certificate.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                          <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-black">
                            View certificate
                          </span>
                        </div>
                      </button>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {certificate.title}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {certificate.issuer} • {certificate.year}
                      </p>
                    </div>

                    {"credentialUrl" in certificate ? (
                      <Button size="sm" asChild>
                        <a
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="rounded-full bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-medium text-white">
                            Bekijk credential
                          </span>
                        </a>
                      </Button>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {certificate.links.map((link) => (
                          <Button
                            key={link.label}
                            size="sm"
                            variant="outline"
                            className="border-white/20 bg-white/10 text-white hover:bg-white/10"
                            asChild
                          >
                            <a
                              href={link.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.label}
                            </a>
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact">
          <Card className="rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur">
            <CardContent className="space-y-4 p-6">
              <div>
                <h2 className="text-2xl font-semibold">Contact</h2>
                <p className="mt-2 text-zinc-400">
                  Neem gerust contact met mij op voor stage, samenwerking of
                  vragen over mijn projecten.
                </p>
              </div>

              <div className="space-y-2 text-zinc-300">
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="text-cyan-300 hover:underline"
                  >
                    {PROFILE.email}
                  </a>
                </p>

                <p>Locatie: {PROFILE.location}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-indigo-500 hover:bg-indigo-400" asChild>
                  <a href={`mailto:${PROFILE.email}`}>Send Email</a>
                </Button>

                <Button
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  asChild
                >
                  <a
                    href={PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  asChild
                >
                  <a
                    href={PROFILE.nieuwsArtikelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nieuwsartikel
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {selectedCertificateImage && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    onClick={() => setSelectedCertificateImage(null)}
  >
    <div
      className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f19] p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">
          {selectedCertificateImage.title}
        </h3>

        <button
          type="button"
          onClick={() => setSelectedCertificateImage(null)}
          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
        >
          Close
        </button>
      </div>

      <div className="relative h-[70vh] w-full overflow-hidden rounded-xl bg-white/5">
        <Image
          src={selectedCertificateImage.src}
          alt={selectedCertificateImage.title}
          fill
          className="object-contain"
        />
      </div>
    </div>
  </div>
)}

        <footer className="pb-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} {PROFILE.name} • Built with Next.js
        </footer>
      </div>
    </main>
  );
}