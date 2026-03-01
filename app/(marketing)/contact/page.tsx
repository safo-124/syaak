import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - TechForUGH",
  description: "Get in touch with our team for inquiries about courses, corporate training, or consulting.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--primary)/0.1,transparent_60%)]" />
        
        <div className="mx-auto max-w-3xl space-y-6">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            Contact Us
          </Badge>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            We'd love to <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">hear from you</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Have questions about our courses, corporate training, or consulting services? 
            Reach out to our team today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          
          {/* Contact Info Column */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Get in touch</h2>
              <p className="text-muted-foreground">
                Whether you're a student looking to upskill or a company seeking data training for your team, we're here to help.
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="glass border-none">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <a href="mailto:hello@techforugh.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      hello@techforugh.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-none">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <a href="tel:+233201234567" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      +233 (0) 20 123 4567
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-none">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">Accra, Ghana</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-none">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Column */}
          <div className="glass rounded-2xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Send us a message</h2>
              <p className="text-sm text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}
