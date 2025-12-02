import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckCircle2, Users, Lightbulb, Rocket, HelpCircle, Linkedin, Twitter } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us - Tech4GH",
  description: "Learn about our mission to democratize data science education in Ghana and Africa.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,var(--primary)/0.1,transparent_60%)]" />
        
        <div className="mx-auto max-w-3xl space-y-6">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            About Tech4GH
          </Badge>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Empowering Ghana's <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Digital Future</span>
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

      {/* Team / Instructors Section */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Meet the Instructors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn from industry experts with years of experience in data science, analytics, and software development.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Instructor 1 */}
            <Card className="glass border-none overflow-hidden group">
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20 transition-transform group-hover:scale-105">
                  <AvatarImage src="/images/team/instructor-1.jpg" alt="Dr. Emmanuel Asante" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    EA
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Dr. Emmanuel Asante</h3>
                  <p className="text-sm text-primary">Head of Data Science</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  PhD in Computer Science. 10+ years experience in machine learning and AI. 
                  Former Data Scientist at Google.
                </p>
                <div className="flex justify-center gap-3">
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Instructor 2 */}
            <Card className="glass border-none overflow-hidden group">
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20 transition-transform group-hover:scale-105">
                  <AvatarImage src="/images/team/instructor-2.jpg" alt="Abigail Mensah" />
                  <AvatarFallback className="bg-accent/10 text-accent text-2xl font-bold">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Abigail Mensah</h3>
                  <p className="text-sm text-primary">Lead Excel & BI Instructor</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Microsoft Certified Trainer. 8+ years in business analytics. 
                  Specialist in Excel, Power BI, and data visualization.
                </p>
                <div className="flex justify-center gap-3">
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Instructor 3 */}
            <Card className="glass border-none overflow-hidden group">
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20 transition-transform group-hover:scale-105">
                  <AvatarImage src="/images/team/instructor-3.jpg" alt="Kofi Boateng" />
                  <AvatarFallback className="bg-blue-500/10 text-blue-500 text-2xl font-bold">
                    KB
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Kofi Boateng</h3>
                  <p className="text-sm text-primary">Python & R Instructor</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  MSc Statistics. Former Senior Analyst at MTN. 
                  Expert in Python, R, and statistical modeling.
                </p>
                <div className="flex justify-center gap-3">
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Instructor 4 */}
            <Card className="glass border-none overflow-hidden group">
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20 transition-transform group-hover:scale-105">
                  <AvatarImage src="/images/team/instructor-4.jpg" alt="Akua Owusu" />
                  <AvatarFallback className="bg-green-500/10 text-green-500 text-2xl font-bold">
                    AO
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Akua Owusu</h3>
                  <p className="text-sm text-primary">SQL & Database Instructor</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Database Administrator with 7+ years experience. 
                  AWS and Azure certified. Expert in SQL and data engineering.
                </p>
                <div className="flex justify-center gap-3">
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Instructor 5 */}
            <Card className="glass border-none overflow-hidden group">
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20 transition-transform group-hover:scale-105">
                  <AvatarImage src="/images/team/instructor-5.jpg" alt="Yaw Mensah" />
                  <AvatarFallback className="bg-purple-500/10 text-purple-500 text-2xl font-bold">
                    YM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Yaw Mensah</h3>
                  <p className="text-sm text-primary">Machine Learning Instructor</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI researcher and practitioner. Published in top ML conferences. 
                  Specializes in deep learning and NLP.
                </p>
                <div className="flex justify-center gap-3">
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Instructor 6 */}
            <Card className="glass border-none overflow-hidden group">
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20 transition-transform group-hover:scale-105">
                  <AvatarImage src="/images/team/instructor-6.jpg" alt="Efua Agyemang" />
                  <AvatarFallback className="bg-orange-500/10 text-orange-500 text-2xl font-bold">
                    EA
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Efua Agyemang</h3>
                  <p className="text-sm text-primary">Career Coach & Mentor</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  HR professional turned career coach. Helps students land their dream data jobs. 
                  Resume and interview expert.
                </p>
                <div className="flex justify-center gap-3">
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HelpCircle className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Got questions? We've got answers. Here are some of the most common things people ask us.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="glass rounded-xl border-none px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Do I need prior programming experience?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Not at all! Our beginner courses are designed for complete beginners with no coding experience. 
                We start from the basics and gradually build up your skills. For intermediate and advanced courses, 
                we recommend having some foundational knowledge, which you can gain from our beginner programs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="glass rounded-xl border-none px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                How long do the courses take to complete?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Course durations vary based on the topic and depth. Our online courses typically range from 
                1 week to 6 weeks. In-person bootcamps are intensive and run for 1-2 days. Each course page 
                shows the expected duration, and you can learn at your own pace with our online offerings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="glass rounded-xl border-none px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Do you offer certificates?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Upon successful completion of any course, you'll receive a digital certificate of completion 
                that you can share on LinkedIn or include in your resume. Our certificates are recognized by 
                many employers in Ghana and across Africa.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="glass rounded-xl border-none px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Are the courses online or in-person?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer both! Our online courses give you flexibility to learn from anywhere, anytime. 
                Our in-person bootcamps in Accra provide intensive, hands-on training with direct access 
                to instructors. Check each course page for available formats.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="glass rounded-xl border-none px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We accept Mobile Money (MTN, Vodafone, AirtelTigo), bank transfers, and major credit/debit cards. 
                For corporate training, we also accept purchase orders and can invoice your organization directly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="glass rounded-xl border-none px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Do you offer corporate training?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! We work with organizations of all sizes to upskill their teams. Corporate training 
                can be customized to your specific needs and delivered on-site or virtually. Contact us to 
                discuss your organization's requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="glass rounded-xl border-none px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Can I get a refund if I'm not satisfied?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, we offer a 7-day money-back guarantee for our online courses. If you're not satisfied 
                within the first week, simply contact us for a full refund. For in-person bootcamps, 
                cancellations made at least 48 hours before the event are eligible for a full refund.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  )
}
