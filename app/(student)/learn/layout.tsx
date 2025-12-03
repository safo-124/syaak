import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getStudentById } from "@/lib/students"
import { StudentSidebar } from "@/components/student/sidebar"
import { StudentHeader } from "@/components/student/header"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_session")?.value

  if (!studentId) {
    redirect("/learn/login")
  }

  const student = await getStudentById(studentId)
  
  if (!student) {
    redirect("/learn/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <StudentSidebar student={student} />
      <div className="lg:pl-64">
        <StudentHeader student={student} />
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
