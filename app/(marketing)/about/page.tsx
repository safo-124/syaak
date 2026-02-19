import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, Linkedin, Twitter, Github } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { getAboutPage, getTeamMembers, getFaqItems } from "@/lib/about"

export const metadata: Metadata = {
  title: "About Us - Tech4GH",
  description: "Learn about our mission to democratize data science education in Ghana and Africa.",
}

// â”€â”€ Defaults (used when DB has no record yet) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DEFAULT_HERO = {
  heroTagline: "Technology Training & Solutions",
  heroTitle: "Empowering Ghana's Digital Future",
  heroSubtitle:
    "We are bridging the gap between education and industry by providing practical, job-ready data skills to students and professionals.",
}
const DEFAULT_MISSION = {
  missionTitle: "Our Mission",
  missionBody:
    "At Tech4GH, we believe that data literacy is the new literacy. Our mission is to democratize access to high-quality data science and analytics training across Ghana and Africa.\n\nWe focus on the tools that matter most in the workplaceâ€”Python, R, Excel, and Power BIâ€”ensuring our graduates are ready to make an immediate impact in their organizations.",
}
const DEFAULT_VISION = {
  visionTitle: "Our Vision",
  visionBody:
    "To become Africa's premier hub for technology education and digital solutions, where talent is nurtured, companies are transformed, and communities thrive through the power of data.",
}
const DEFAULT_STORY = {
  storyTitle: "Why Tech4GH?",
  storyBody:
    "The demand for data skills is exploding, but traditional education often lags behind. We saw a need for a training provider that understands the local context while delivering global-standard education.",
}
const DEFAULT_STATS = [
  { label: "Students Trained", value: "500+" },
  { label: "Companies Served", value: "50+" },
  { label: "Solutions Delivered", value: "100+" },
  { label: "Years Experience", value: "5+" },
]
const DEFAULT_FAQS = [
  { id: "f1", question: "Do I need prior programming experience?", answer: "Not at all! Our beginner courses are designed for complete beginners with no coding experience." },
  { id: "f2", question: "How long do the courses take?", answer: "Course durations vary from 1 week to 6 weeks for online courses. Bootcamps run 1â€“2 intensive days." },
  { id: "f3", question: "Do you offer certificates?", answer: "Yes! You receive a digital certificate upon successful completion, shareable on LinkedIn." },
  { id: "f4", question: "Are courses online or in-person?", answer: "Both! Online courses let you learn at your own pace; in-person bootcamps are held in Accra." },
  { id: "f5", question: "Do you offer corporate training?", answer: "Absolutely! We customize training for organizations of all sizes, on-site or virtually." },
]

type StatItem = { label: string; value: string }
type ValueItem = { title: string; description: string; icon?: string }

export default async function AboutPage() {
  const [aboutPage, teamMembers, faqItems] = await Promise.all([
    getAboutPage(),
    getTeamMembers(),
    getFaqItems(),
  ])

  const hero = {
    heroTagline: aboutPage?.heroTagline || DEFAULT_HERO.heroTagline,
    heroTitle: aboutPage?.heroTitle || DEFAULT_HERO.heroTitle,
    heroSubtitle: aboutPage?.heroSubtitle || DEFAULT_HERO.heroSubtitle,
    heroImageUrl: aboutPage?.heroImageUrl || null,
  }
  const mission = {
    title: aboutPage?.missionTitle || DEFAULT_MISSION.missionTitle,
    body: aboutPage?.missionBody || DEFAULT_MISSION.missionBody,
  }
  const vision = {
    title: aboutPage?.visionTitle || DEFAULT_VISION.visionTitle,
    body: aboutPage?.visionBody || DEFAULT_VISION.visionBody,
  }
  const story = {
    title: aboutPage?.storyTitle || DEFAULT_STORY.storyTitle,
    body: aboutPage?.storyBody || DEFAULT_STORY.storyBody,
  }
  const stats = ((aboutPage?.stats as StatItem[]) || []).length > 0
    ? (aboutPage!.stats as StatItem[])
    : DEFAULT_STATS
  const values = ((aboutPage?.values as ValueItem[]) || []).length > 0
    ? (aboutPage!.values as ValueItem[])
    : []
  const faqs = faqItems.length > 0 ? faqItems : DEFAULT_FAQS
  const gallery = (aboutPage?.galleryImages || []) as string[]

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,var(--primary)/0.1,transparent_60%)]" />
        <div className="mx-auto max-w-3xl space-y-6">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            {hero.heroTagline}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {hero.heroTitle.includes("Digital Future") ? (
              <>
                Empowering Ghana&apos;s{" "}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Digital Future</span>
              </>
            ) : hero.heroTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {hero.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full border-y bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{mission.title}</h2>
            {mission.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-lg text-muted-foreground leading-relaxed">{para}</p>
            ))}
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{vision.title}</h2>
            {vision.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-lg text-muted-foreground leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      {values.length > 0 && (
        <section className="w-full bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">Our Core Values</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((val, i) => (
                <Card key={i} className="glass border-none">
                  <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                    {val.icon && <span className="text-4xl">{val.icon}</span>}
                    <h3 className="font-semibold">{val.title}</h3>
                    <p className="text-sm text-muted-foreground">{val.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Story */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">{story.title}</h2>
          {story.body.split("\n\n").map((para, i) => (
            <p key={i} className="text-lg text-muted-foreground leading-relaxed">{para}</p>
          ))}
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="w-full bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Members */}
      {teamMembers.length > 0 && (
        <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-4">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
                Our Team
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">Meet the Team</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.id} className="glass border-none overflow-hidden group">
                  <CardContent className="p-6 text-center space-y-4">
                    <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20 transition-transform group-hover:scale-105">
                      <AvatarImage src={member.imageUrl || ""} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-primary">{member.role}</p>
                    </div>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    )}
                    {(member.linkedinUrl || member.twitterUrl || member.githubUrl) && (
                      <div className="flex justify-center gap-3">
                        {member.linkedinUrl && (
                          <Link href={member.linkedinUrl} target="_blank" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                            <Linkedin className="h-5 w-5" />
                          </Link>
                        )}
                        {member.twitterUrl && (
                          <Link href={member.twitterUrl} target="_blank" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                            <Twitter className="h-5 w-5" />
                          </Link>
                        )}
                        {member.githubUrl && (
                          <Link href={member.githubUrl} target="_blank" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                            <Github className="h-5 w-5" />
                          </Link>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HelpCircle className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Got questions? We&apos;ve got answers.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.id || i} value={`item-${i}`} className="glass rounded-xl border-none px-6">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}
