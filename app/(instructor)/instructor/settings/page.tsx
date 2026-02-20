import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { InstructorSettingsForm } from "@/components/instructor/settings-form"

export default async function InstructorSettingsPage() {
  const cookieStore = await cookies()
  const instructorId = cookieStore.get("instructor_session")?.value

  if (!instructorId) {
    redirect("/instructor/login")
  }

  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      title: true,
      expertise: true,
      isVerified: true,
      linkedinUrl: true,
      twitterUrl: true,
      githubUrl: true,
      slug: true,
    },
  })

  if (!instructor) {
    redirect("/instructor/login")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings
        </p>
      </div>

      {/* Settings Form */}
      <InstructorSettingsForm instructor={instructor} />
    </div>
  )
}
