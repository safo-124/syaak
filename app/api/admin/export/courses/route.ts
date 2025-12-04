import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const courses = await prisma.managedCourse.findMany({
      include: {
        instructors: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
              },
            },
          },
        },
        enrollments: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Build CSV
    const headers = [
      "Course ID",
      "Title",
      "Instructors",
      "Level",
      "Price",
      "Published",
      "Lessons Count",
      "Total Enrollments",
      "Completed Enrollments",
      "Tags",
      "Created At",
    ]

    const rows = courses.map((course) => {
      const completedEnrollments = course.enrollments.filter(
        (e) => e.status === "COMPLETED"
      ).length
      
      const lessonsCount = course.modules.reduce(
        (acc, mod) => acc + mod.lessons.length,
        0
      )
      
      const instructorNames = course.instructors
        .map((ic) => ic.instructor.name)
        .join(", ")

      return [
        course.id,
        course.title,
        instructorNames,
        course.level,
        course.price ? course.price.toString() : "Free",
        course.isPublished ? "Yes" : "No",
        lessonsCount.toString(),
        course.enrollments.length.toString(),
        completedEnrollments.toString(),
        course.tags.join("; "),
        course.createdAt.toISOString(),
      ]
    })

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
        "Content-Disposition": `attachment; filename=courses-${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export courses" },
      { status: 500 }
    )
  }
}
