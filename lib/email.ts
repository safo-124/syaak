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
const DEFAULT_FROM = process.env.SMTP_FROM || "TechForUGH <hello@techforugh.com>"

// Email templates
export const emailTemplates = {
  studentApproved: (studentName: string, loginUrl: string) => ({
    subject: "Welcome to TechForUGH! Your Account is Approved 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">TechForUGH Learning</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #333333; margin-top: 0;">Welcome, ${studentName}! 🎉</h2>
                <p style="color: #666666;">
                  Great news! Your TechForUGH account has been approved. You now have full access to our learning platform.
                </p>
                <ul style="color: #666666; padding-left: 20px;">
                  <li>Browse and enroll in courses</li>
                  <li>Track your learning progress</li>
                  <li>Earn certificates upon completion</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${loginUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Start Learning Now
                  </a>
                </div>
                <p style="color: #666666;">Happy learning!<br>The TechForUGH Team</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
                <p style="color: #999999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} TechForUGH</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Welcome, ${studentName}! Your TechForUGH account has been approved. Login at: ${loginUrl}`,
  }),

  courseEnrollment: (studentName: string, courseName: string, courseUrl: string) => ({
    subject: `You're enrolled in ${courseName}! 📚`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">TechForUGH Learning</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #333333; margin-top: 0;">You're In! 🎓</h2>
                <p style="color: #666666;">Hi ${studentName},</p>
                <p style="color: #666666;">You've successfully enrolled in <strong>${courseName}</strong>. Your learning journey starts now!</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${courseUrl}" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Go to Course
                  </a>
                </div>
                <p style="color: #666666;">The TechForUGH Team</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
                <p style="color: #999999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} TechForUGH</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Hi ${studentName}, you've enrolled in ${courseName}. Start at: ${courseUrl}`,
  }),

  courseCompleted: (studentName: string, courseName: string, certificateUrl: string) => ({
    subject: `Congratulations! You've completed ${courseName}! 🏆`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Congratulations! 🎉</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #333333; margin-top: 0;">You Did It, ${studentName}! 🏆</h2>
                <p style="color: #666666;">You've completed <strong>${courseName}</strong>. Your certificate is ready!</p>
                <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center;">
                  <p style="font-size: 48px; margin: 0;">🎓</p>
                  <h3 style="color: #333333; margin: 10px 0 5px;">Certificate of Completion</h3>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${certificateUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Download Certificate
                  </a>
                </div>
                <p style="color: #666666;">The TechForUGH Team</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
                <p style="color: #999999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} TechForUGH</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Congratulations ${studentName}! You've completed ${courseName}. Download certificate: ${certificateUrl}`,
  }),
}

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

// Convenience functions for common emails
export async function sendApprovalEmail(
  email: string,
  studentName: string,
  loginUrl: string
): Promise<EmailResult> {
  const template = emailTemplates.studentApproved(studentName, loginUrl)
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

export async function sendEnrollmentEmail(
  email: string,
  studentName: string,
  courseName: string,
  courseUrl: string
): Promise<EmailResult> {
  const template = emailTemplates.courseEnrollment(studentName, courseName, courseUrl)
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

export async function sendCompletionEmail(
  email: string,
  studentName: string,
  courseName: string,
  certificateUrl: string
): Promise<EmailResult> {
  const template = emailTemplates.courseCompleted(studentName, courseName, certificateUrl)
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
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
