"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  avatar?: string
  content: string
  rating: number
}

// Static testimonials - in a real app, these would come from a database
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Kwame Mensah",
    role: "Data Analyst",
    company: "MTN Ghana",
    content: "This course transformed my career! The hands-on projects and expert instruction helped me land my dream job. The curriculum is well-structured and the instructors are incredibly supportive.",
    rating: 5,
  },
  {
    id: "2",
    name: "Abena Osei",
    role: "Business Intelligence Lead",
    company: "Ecobank",
    content: "I've taken many online courses, but TechForUGH stands out. The practical approach to learning and real-world case studies made all the difference. Highly recommended!",
    rating: 5,
  },
  {
    id: "3",
    name: "Kofi Asante",
    role: "Junior Developer",
    company: "Hubtel",
    content: "As a complete beginner, I was worried about keeping up. But the step-by-step approach and supportive community made learning enjoyable. I now feel confident in my skills.",
    rating: 4,
  },
  {
    id: "4",
    name: "Ama Darko",
    role: "Project Manager",
    company: "Vodafone Ghana",
    content: "The course content is up-to-date and relevant to the Ghanaian job market. I particularly appreciated the career guidance and networking opportunities.",
    rating: 5,
  },
]

interface CourseTestimonialsProps {
  courseTitle?: string
}

export function CourseTestimonials({ courseTitle }: CourseTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }
  
  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">What Our Students Say</h2>
          <p className="text-muted-foreground mt-1">
            Real feedback from learners who transformed their careers
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <Card className="glass border-white/10 overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Quote Section */}
              <div className="flex-1 space-y-6">
                <Quote className="h-10 w-10 text-primary/40" />
                <blockquote className="text-lg md:text-xl leading-relaxed text-foreground/90">
                  "{current.content}"
                </blockquote>
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < current.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Author Section */}
              <div className="md:w-64 flex flex-col items-center md:items-end text-center md:text-right space-y-4 md:border-l md:border-white/10 md:pl-8">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={current.avatar} alt={current.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {current.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{current.name}</p>
                  <p className="text-sm text-muted-foreground">{current.role}</p>
                  {current.company && (
                    <p className="text-sm text-primary">{current.company}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Navigation */}
        <div className="flex sm:hidden items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {testimonials.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="hidden sm:flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex
                  ? "w-6 bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
