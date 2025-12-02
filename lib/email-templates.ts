interface NewsletterEmailProps {
  previewText?: string
  content: string
  unsubscribeUrl?: string
}

export function createNewsletterTemplate({
  previewText,
  content,
  unsubscribeUrl,
}: NewsletterEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <title>Tech4GH Newsletter</title>
  ${previewText ? `<span style="display: none; max-height: 0; overflow: hidden;">${previewText}</span>` : ""}
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Tech4GH
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Your Gateway to Tech Education
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="color: #374151; font-size: 16px; line-height: 1.7;">
                ${content}
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
                You're receiving this email because you subscribed to Tech4GH newsletter.
              </p>
              ${
                unsubscribeUrl
                  ? `<a href="${unsubscribeUrl}" style="color: #6b7280; font-size: 13px; text-decoration: underline;">Unsubscribe from this list</a>`
                  : ""
              }
              <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Tech4GH. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

interface WelcomeEmailProps {
  subscriberName?: string
  unsubscribeUrl?: string
}

export function createWelcomeTemplate({
  subscriberName,
  unsubscribeUrl,
}: WelcomeEmailProps): string {
  const greeting = subscriberName ? `Hi ${subscriberName}!` : "Hello!"
  
  return createNewsletterTemplate({
    previewText: "Welcome to Tech4GH! Thank you for subscribing to our newsletter.",
    content: `
      <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 22px; font-weight: 600;">
        ${greeting}
      </h2>
      <p style="margin: 0 0 16px 0;">
        Thank you for subscribing to the <strong>Tech4GH Newsletter</strong>! We're thrilled to have you join our community of learners and tech enthusiasts.
      </p>
      <p style="margin: 0 0 16px 0;">
        Here's what you can expect from us:
      </p>
      <ul style="margin: 0 0 16px 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">📚 Latest course updates and new learning paths</li>
        <li style="margin-bottom: 8px;">💡 Tech tips and industry insights</li>
        <li style="margin-bottom: 8px;">🎉 Exclusive offers and early access to new content</li>
        <li style="margin-bottom: 8px;">🌟 Success stories from our community</li>
      </ul>
      <p style="margin: 0 0 24px 0;">
        We'll send you updates that matter, without cluttering your inbox. Quality over quantity is our promise.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="border-radius: 8px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);">
            <a href="https://tech4gh.com" style="display: inline-block; padding: 14px 28px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none;">
              Explore Our Courses →
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 24px 0 0 0;">
        Best regards,<br>
        <strong>The Tech4GH Team</strong>
      </p>
    `,
    unsubscribeUrl,
  })
}

export function createPlainTextFromHtml(html: string): string {
  // Simple HTML to plain text conversion
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim()
}
