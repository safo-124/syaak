import { NextRequest, NextResponse } from "next/server"
import { sendEmail, verifyEmailConnection } from "@/lib/email"
import { createNewsletterTemplate, createPlainTextFromHtml } from "@/lib/email-templates"

// POST /api/email/send - Send a single email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, content, previewText } = body

    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, content" },
        { status: 400 }
      )
    }

    const html = createNewsletterTemplate({
      content,
      previewText,
    })
    const text = createPlainTextFromHtml(html)

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      })
    }

    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    )
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}

// GET /api/email/send - Verify SMTP connection
export async function GET() {
  try {
    const isConnected = await verifyEmailConnection()
    
    return NextResponse.json({
      connected: isConnected,
      configured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { connected: false, error: "Failed to verify connection" },
      { status: 500 }
    )
  }
}
