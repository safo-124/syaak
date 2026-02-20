import Link from "next/link"
import Image from "next/image"
import { getPublicInstructors, ensureInstructorSlug } from "@/lib/instructors"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, GraduationCap, Linkedin, Twitter, Github } from "lucide-react"

export const metadata = {
  title: "Our Instructors | Tech4GH",
  description: "Meet the expert instructors teaching on Tech4GH.",
}

export default async function InstructorsPage() {
  const instructors = await getPublicInstructors()

  // Ensure all instructors have slugs
  await Promise.all(instructors.map(i => ensureInstructorSlug(i.id)))

  // Reload with slugs
  const instructorsWithSlugs = await getPublicInstructors()

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-4 py-1">
            <GraduationCap className="mr-2 size-4" />
            Our Instructors
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            Learn from Industry Experts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our instructors bring real-world experience from top companies across Africa and beyond.
          </p>
        </div>

        {/* Grid */}
        {instructorsWithSlugs.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <GraduationCap className="mx-auto mb-4 size-12 opacity-30" />
            <p>No instructors available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instructorsWithSlugs.map((instructor) => {
              const publishedCourses = instructor.courses.filter(ic => ic.course.isPublished)
              const totalStudents = publishedCourses.reduce(
                (sum, ic) => sum + ic.course._count.enrollments,
                0
              )
              const profileUrl = instructor.slug
                ? `/instructors/${instructor.slug}`
                : `/instructors/${instructor.id}`

              return (
                <Card key={instructor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    {/* Avatar */}
                    <div className="flex items-start gap-4">
                      {instructor.avatar ? (
                        <Image
                          src={instructor.avatar}
                          alt={instructor.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover size-16 shrink-0"
                        />
                      ) : (
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
                          {instructor.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2 className="font-bold text-lg leading-tight">{instructor.name}</h2>
                        {instructor.title && (
                          <p className="text-sm text-muted-foreground">{instructor.title}</p>
                        )}
                        {instructor.isVerified && (
                          <Badge variant="secondary" className="text-xs mt-1">Verified</Badge>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {instructor.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{instructor.bio}</p>
                    )}

                    {/* Expertise */}
                    {instructor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {instructor.expertise.slice(0, 4).map((e) => (
                          <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                        ))}
                        {instructor.expertise.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{instructor.expertise.length - 4}</Badge>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3.5" />
                        {publishedCourses.length} course{publishedCourses.length !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        {totalStudents} students
                      </span>
                    </div>

                    {/* Social */}
                    <div className="flex items-center gap-2">
                      {(instructor as { linkedinUrl?: string | null }).linkedinUrl && (
                        <a href={(instructor as { linkedinUrl?: string | null }).linkedinUrl!} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                          <Linkedin className="size-4" />
                        </a>
                      )}
                      {(instructor as { twitterUrl?: string | null }).twitterUrl && (
                        <a href={(instructor as { twitterUrl?: string | null }).twitterUrl!} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                          <Twitter className="size-4" />
                        </a>
                      )}
                      {(instructor as { githubUrl?: string | null }).githubUrl && (
                        <a href={(instructor as { githubUrl?: string | null }).githubUrl!} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                          <Github className="size-4" />
                        </a>
                      )}
                      <div className="ml-auto">
                        <Button asChild variant="outline" size="sm">
                          <Link href={profileUrl}>View Profile</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
