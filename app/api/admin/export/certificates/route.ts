import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        enrollment: {
          include: {
            student: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
    })

    // Build CSV
    const headers = [
      "Certificate Number",
      "Student Name",
      "Student Email",
      "Course Name",
      "Instructor Name",
      "Issued At",
    ]

    const rows = certificates.map((cert) => [
      cert.certificateNumber,
      cert.studentName,
      cert.enrollment.student.email,
      cert.courseName,
      cert.instructorName || "",
      cert.issuedAt.toISOString(),
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
        "Content-Disposition": `attachment; filename=certificates-${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export certificates" },
      { status: 500 }
    )
  }
}
