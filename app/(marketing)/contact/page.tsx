import { ContactForm } from "@/components/contact-form"
import { Mail, MapPin, Phone, Clock, ArrowUpRight, MessageSquare, Zap, Users } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us - TechForUGH",
  description: "Get in touch with our team for inquiries about courses, corporate training, or consulting.",
}

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@techforugh.com",
    href: "mailto:hello@techforugh.com",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+233 (0) 20 123 4567",
    href: "tel:+233201234567",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Accra, Ghana",
    href: null,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon - Fri: 9 AM - 6 PM",
    href: null,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
]

const QUICK_LINKS = [
  { label: "Explore Courses", href: "/courses", icon: Zap },
  { label: "View Solutions", href: "/solutions", icon: ArrowUpRight },
  { label: "About Us", href: "/about", icon: Users },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero — compact, matches other pages */}
      <section className="relative border-b overflow-hidden">
        <div className="pointer-events-none absolute -right-16 top-0 h-32 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="mx-auto flex max-w-7xl items-end gap-8 px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div className="flex-1 space-y-3">
            <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Contact
            </p>
            <h1 className="animate-fade-in-up animation-delay-100 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Let's Start a Conversation
            </h1>
            <p className="animate-fade-in-up animation-delay-200 max-w-xl text-sm text-muted-foreground sm:text-base">
              Whether you need training for your team, a custom tech solution, or just want to say hi — we're here.
            </p>
            <div className="h-0.5 w-16 rounded-full bg-primary/40 animate-line-grow animation-delay-400" />
          </div>
          <div className="hidden sm:block">
            <MessageSquare className="size-16 text-muted-foreground/5 lg:size-24 animate-count-pop animation-delay-300" />
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="flex-1 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Contact cards row — horizontal on desktop */}
          <div className="mb-12 grid gap-3 grid-cols-2 lg:grid-cols-4">
            {CONTACT_DETAILS.map((item, i) => (
              <div
                key={item.label}
                className={`group relative rounded-xl border bg-card p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up animation-delay-${(i + 1) * 100}`}
              >
                <div className={`mb-3 flex size-10 items-center justify-center rounded-lg ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className="size-5" />
                </div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-0.5 block text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Two-column: Form + Side panel */}
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Form — takes 3 cols */}
            <div className="lg:col-span-3 animate-fade-in-up animation-delay-300">
              <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Send us a message</h2>
                    <p className="text-xs text-muted-foreground">
                      We'll get back to you within 24 hours
                    </p>
                  </div>
                </div>
                <ContactForm />
              </div>
            </div>

            {/* Side panel — takes 2 cols */}
            <div className="space-y-6 lg:col-span-2 animate-fade-in-up animation-delay-500">
              {/* Map / Location card */}
              <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="relative aspect-4/3 bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127066.68000227874!2d-0.26199444!3d5.6037168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2s!4v1700000000000"
                    className="absolute inset-0 h-full w-full border-0 grayscale opacity-80 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
                    loading="lazy"
                    allowFullScreen
                    title="TechForUGH Location — Accra, Ghana"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    <p className="text-sm font-semibold">Accra, Ghana</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Serving clients and students across West Africa and beyond
                  </p>
                </div>
              </div>

              {/* Quick links */}
              <div className="rounded-2xl border bg-card p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Quick Links
                </p>
                <div className="space-y-2">
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group/link flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <span className="flex items-center gap-2.5">
                        <link.icon className="size-4 text-muted-foreground transition-colors group-hover/link:text-primary" />
                        {link.label}
                      </span>
                      <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-all group-hover/link:text-primary group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Response promise */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fast Response</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Our team typically responds within a few hours during business days. For urgent matters, give us a call.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
