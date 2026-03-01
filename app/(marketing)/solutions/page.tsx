import { getPublishedSolutions } from "@/lib/solutions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Hammer, ExternalLink, Layers, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Work — Tech4GH",
  description: "From web platforms to data dashboards — see the technology solutions Tech4GH builds for clients across Ghana and beyond.",
}

export default async function SolutionsPage() {
  const solutions = await getPublishedSolutions()

  const completed = solutions.filter((s) => !s.isOngoing)
  const ongoing = solutions.filter((s) => s.isOngoing)

  const categories = [...new Set(solutions.map((s) => s.category))].sort()

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-background via-primary/3 to-background py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 size-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 size-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Layers className="size-4 text-primary" />
            Our Work
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Technology Solutions
            <br />
            <span className="text-primary">We Deliver</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            From web platforms to data dashboards and mobile apps — see what we build for our clients across Ghana and beyond.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="px-3 py-1 text-sm font-medium">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">

        {/* ── ONGOING PROJECTS ── */}
        {ongoing.length > 0 && (
          <section>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 dark:border-orange-800 dark:bg-orange-950/20">
                <Hammer className="size-4 text-orange-500 animate-bounce" />
                <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                  Work in Progress
                </span>
              </div>
              <div className="h-px flex-1 bg-orange-100 dark:bg-orange-900/30" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ongoing.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} ongoing />
              ))}
            </div>
          </section>
        )}

        {/* ── COMPLETED WORK ── */}
        {completed.length > 0 && (
          <section>
            <div className="mb-8 flex items-center gap-3">
              <h2 className="text-xl font-bold">Completed Projects</h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} />
              ))}
            </div>
          </section>
        )}

        {solutions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Layers className="mb-4 size-16 text-muted-foreground/30" />
            <h2 className="text-xl font-semibold">No projects yet</h2>
            <p className="mt-2 text-muted-foreground">Check back soon — we&apos;re always building something new.</p>
          </div>
        )}

        {/* ── CTA ── */}
        <section className="rounded-2xl border bg-primary/5 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Have a project in mind?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We build tailored tech solutions for businesses and organisations. Let&apos;s talk about what we can build together.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/contact">
                Start a Project
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/courses">Explore Training</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

function SolutionCard({
  solution,
  ongoing = false,
}: {
  solution: {
    id: string
    title: string
    slug: string
    shortSummary: string | null
    category: string
    imageUrl: string | null
    techStack: string[]
    clientName: string | null
    liveUrl: string | null
    isFeatured: boolean
    isOngoing: boolean
  }
  ongoing?: boolean
}) {
  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${ongoing ? "border-orange-200 dark:border-orange-800/50" : ""}`}>
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {solution.imageUrl ? (
          <img
            src={solution.imageUrl}
            alt={solution.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Layers className="size-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {ongoing && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
              <Hammer className="size-3" />
              Ongoing
            </span>
          )}
          {solution.isFeatured && (
            <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
              ★ Featured
            </span>
          )}
        </div>

        {/* Live link icon */}
        {solution.liveUrl && (
          <a
            href={solution.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
            aria-label="View live site"
          >
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <span className="text-xs font-medium text-primary">{solution.category}</span>
          {solution.clientName && (
            <span className="ml-2 text-xs text-muted-foreground">· {solution.clientName}</span>
          )}
        </div>

        <h3 className="font-bold leading-snug text-foreground">{solution.title}</h3>

        {solution.shortSummary && (
          <p className="text-sm text-muted-foreground line-clamp-2">{solution.shortSummary}</p>
        )}

        {solution.techStack.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {solution.techStack.slice(0, 4).map((t) => (
              <Badge key={t} variant="secondary" className="px-2 py-0 text-[11px]">
                {t}
              </Badge>
            ))}
            {solution.techStack.length > 4 && (
              <Badge variant="secondary" className="px-2 py-0 text-[11px]">
                +{solution.techStack.length - 4}
              </Badge>
            )}
          </div>
        )}

        {solution.liveUrl && (
          <a
            href={solution.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View Live
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}
