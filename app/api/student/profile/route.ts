import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const studentId = cookieStore.get("student_session")?.value

    if (!studentId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone } = body

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
      },
    })

    return NextResponse.json({ success: true, student: updated })
  } catch (error) {
    console.error("Update student profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const studentId = cookieStore.get("student_session")?.value

    if (!studentId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
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
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Get student profile error:", error)
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    )
  }
}
