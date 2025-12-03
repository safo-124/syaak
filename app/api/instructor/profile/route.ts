import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const instructorId = cookieStore.get("instructor_session")?.value

    if (!instructorId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, title, bio, expertise } = body

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const updated = await prisma.instructor.update({
      where: { id: instructorId },
      data: {
        name: name.trim(),
        title: title?.trim() || null,
        bio: bio?.trim() || null,
        expertise: expertise || [],
      },
    })

    return NextResponse.json({ success: true, instructor: updated })
  } catch (error) {
    console.error("Update instructor profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const instructorId = cookieStore.get("instructor_session")?.value

    if (!instructorId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
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
        createdAt: true,
      },
    })

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(instructor)
  } catch (error) {
    console.error("Get instructor profile error:", error)
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    )
  }
}
