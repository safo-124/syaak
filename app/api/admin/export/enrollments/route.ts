import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    })

    // Build CSV
    const headers = [
      "Enrollment ID",
      "Student Name",
      "Student Email",
      "Course Title",
      "Status",
      "Progress",
      "Enrolled At",
      "Completed At",
    ]

    const rows = enrollments.map((enrollment) => [
      enrollment.id,
      enrollment.student.name,
      enrollment.student.email,
      enrollment.course.title,
      enrollment.status,
      `${enrollment.progress}%`,
      enrollment.enrolledAt.toISOString(),
      enrollment.completedAt?.toISOString() || "",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const escaped = cell.replace(/"/g, '""')
            return cell.includes(",") || cell.includes('"')
              ? `"${escaped}"`
              : escaped
          })
          .join(",")
      ),
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=enrollments-${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export enrollments" },
      { status: 500 }
    )
  }
}
