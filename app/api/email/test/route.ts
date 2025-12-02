import { NextRequest, NextResponse } from "next/server"
import { sendEmail, verifyEmailConnection } from "@/lib/email"

// POST /api/email/test - Send a test email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to } = body

    if (!to) {
      return NextResponse.json(
        { error: "Missing recipient email address" },
        { status: 400 }
      )
    }

    // Verify connection first
    const isConnected = await verifyEmailConnection()
    if (!isConnected) {
      return NextResponse.json(
        { 
          error: "SMTP connection failed. Please check your email configuration.",
          configured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
        },
        { status: 500 }
      )
    }

    // Send test email
    const result = await sendEmail({
      to,
      subject: "Tech4GH - Test Email ✓",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #3b82f6; margin-bottom: 20px;">🎉 Email Configuration Successful!</h1>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            This is a test email from <strong>Tech4GH</strong>. If you're seeing this, your email configuration is working correctly!
          </p>
          <div style="margin-top: 30px; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              <strong>Sent at:</strong> ${new Date().toISOString()}<br>
              <strong>From:</strong> ${process.env.SMTP_FROM || "Tech4GH"}<br>
              <strong>SMTP Host:</strong> ${process.env.SMTP_HOST || "Not set"}
            </p>
          </div>
        </div>
      `,
      text: `Email Configuration Successful!\n\nThis is a test email from Tech4GH. If you're seeing this, your email configuration is working correctly!\n\nSent at: ${new Date().toISOString()}`,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        messageId: result.messageId,
      })
    }

    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    )
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    )
  }
}
