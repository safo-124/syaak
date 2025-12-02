import nodemailer from "nodemailer"

// Email configuration types
interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// Create transporter based on environment variables
function createTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  }

  return nodemailer.createTransport(config)
}

// Default sender
const DEFAULT_FROM = process.env.SMTP_FROM || "Tech4GH <hello@tech4gh.com>"

/**
 * Send a single email
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: options.from || DEFAULT_FROM,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }

    const info = await transporter.sendMail(mailOptions)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error("Email send error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

/**
 * Send emails to multiple recipients (batch)
 */
export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string,
  text?: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  }

  // Send in batches to avoid rate limiting
  const BATCH_SIZE = 10
  const DELAY_BETWEEN_BATCHES = 1000 // 1 second

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE)
    
    const promises = batch.map(async (email) => {
      const result = await sendEmail({
        to: email,
        subject,
        html,
        text,
      })

      if (result.success) {
        results.success++
      } else {
        results.failed++
        results.errors.push(`${email}: ${result.error}`)
      }
    })

    await Promise.all(promises)

    // Delay between batches
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
    }
  }

  return results
}

/**
 * Verify SMTP connection
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return true
  } catch (error) {
    console.error("SMTP verification failed:", error)
    return false
  }
}
