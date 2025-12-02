import { NextResponse } from "next/server"
import { createLead } from "@/lib/courses"
import { z } from "zod"

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string(),
  courseId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    const lead = await createLead(validatedData)

    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, issues: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating lead:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
