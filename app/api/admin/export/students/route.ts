import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Build CSV
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Active",
      "Created At",
      "Enrolled Courses",
      "Total Enrollments",
    ]

    const rows = students.map((student) => [
      student.id,
      student.name,
      student.email,
      student.phone || "",
      student.isActive ? "Active" : "Inactive",
      student.createdAt.toISOString(),
      student.enrollments.map((e) => e.course.title).join("; "),
      student.enrollments.length.toString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape commas and quotes
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
        "Content-Disposition": `attachment; filename=students-${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export students" },
      { status: 500 }
    )
  }
}
