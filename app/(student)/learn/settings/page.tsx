import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { StudentSettingsForm } from "@/components/student/settings-form"

export default async function StudentSettingsPage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_session")?.value

  if (!studentId) {
    redirect("/learn/login")
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      createdAt: true,
    },
  })

  if (!student) {
    redirect("/learn/login")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Form */}
      <StudentSettingsForm student={student} />
    </div>
  )
}
