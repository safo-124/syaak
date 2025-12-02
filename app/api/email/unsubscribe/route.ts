import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/email/unsubscribe - Handle unsubscribe
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get("email")
  const token = searchParams.get("token")

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    )
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      )
    }

    if (!subscriber.isActive) {
      return NextResponse.json({
        success: true,
        message: "You are already unsubscribed",
      })
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "You have been unsubscribed successfully",
    })
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    )
  }
}

// POST /api/email/unsubscribe - Handle unsubscribe via form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: "Email not found in our mailing list" },
        { status: 404 }
      )
    }

    if (!subscriber.isActive) {
      return NextResponse.json({
        success: true,
        message: "You are already unsubscribed",
      })
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "You have been unsubscribed successfully",
    })
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    )
  }
}
