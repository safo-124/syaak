import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Users, Lightbulb, Rocket } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Tech4GH",
  description: "Learn about our mission to democratize data science education in Ghana and Africa.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_var(--primary)/0.1,_transparent_60%)]" />
        
        <div className="mx-auto max-w-3xl space-y-6">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            About Tech4GH
          </Badge>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Empowering Ghana's <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Digital Future</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            We are bridging the gap between education and industry by providing practical, 
            job-ready data skills to students and professionals.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Tech4GH, we believe that data literacy is the new literacy. Our mission is to democratize access to high-quality data science and analytics training across Ghana and Africa.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We focus on the tools that matter most in the workplace—Python, R, Excel, and Power BI—ensuring our graduates are ready to make an immediate impact in their organizations.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="glass border-none">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Lightbulb className="size-6" />
                </div>
                <h3 className="font-semibold">Practical Skills</h3>
                <p className="text-sm text-muted-foreground">
                  Focus on real-world projects, not just theory.
                </p>
              </CardContent>
            </Card>
            <Card className="glass border-none">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Rocket className="size-6" />
                </div>
                <h3 className="font-semibold">Career Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Skills that lead to better jobs and promotions.
                </p>
              </CardContent>
            </Card>
            <Card className="glass border-none">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Users className="size-6" />
                </div>
                <h3 className="font-semibold">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Join a network of like-minded data professionals.
                </p>
              </CardContent>
            </Card>
            <Card className="glass border-none">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="font-semibold">Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Curriculum designed by industry experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story / Context */}
      <section className="w-full bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Why Tech4GH?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The demand for data skills is exploding, but traditional education often lags behind. 
            We saw a need for a training provider that understands the local context while delivering 
            global-standard education. Whether you are a university student looking to stand out 
            or a professional wanting to pivot into data science, Tech4GH is your partner in growth.
          </p>
        </div>
      </section>
    </div>
  )
}
