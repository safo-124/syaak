import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getInstructorById } from "@/lib/instructors"
import { InstructorSidebar } from "@/components/instructor/sidebar"
import { InstructorHeader } from "@/components/instructor/header"

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const instructorId = cookieStore.get("instructor_session")?.value

  if (!instructorId) {
    redirect("/instructor/login")
  }

  const instructor = await getInstructorById(instructorId)
  
  if (!instructor) {
    redirect("/instructor/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <InstructorSidebar instructor={instructor} />
      <div className="lg:pl-64">
        <InstructorHeader instructor={instructor} />
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
