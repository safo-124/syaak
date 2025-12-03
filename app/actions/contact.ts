"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createContactSubmission, updateContactStatus, deleteContactSubmission } from "@/lib/contact"
import { sendEmail } from "@/lib/email"

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactAction(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  }

  const result = contactSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    await createContactSubmission(result.data)

    // Send notification email to admin (non-blocking)
    sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER || "",
      subject: `New Contact Form Submission: ${result.data.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${result.data.name}</p>
            <p><strong>Email:</strong> ${result.data.email}</p>
            ${result.data.phone ? `<p><strong>Phone:</strong> ${result.data.phone}</p>` : ""}
            <p><strong>Subject:</strong> ${result.data.subject}</p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${result.data.message}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Reply directly to this email to respond to ${result.data.name}.
          </p>
        </div>
      `,
      text: `New Contact Form Submission\n\nName: ${result.data.name}\nEmail: ${result.data.email}\n${result.data.phone ? `Phone: ${result.data.phone}\n` : ""}Subject: ${result.data.subject}\n\nMessage:\n${result.data.message}`,
    }).catch(console.error)

    // Send confirmation email to user (non-blocking)
    sendEmail({
      to: result.data.email,
      subject: "We received your message - Tech4GH",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Thank you for contacting us!</h2>
          <p>Hi ${result.data.name},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${result.data.subject}</p>
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap;">${result.data.message}</p>
          </div>
          <p>Best regards,<br><strong>The Tech4GH Team</strong></p>
        </div>
      `,
      text: `Thank you for contacting us!\n\nHi ${result.data.name},\n\nWe've received your message and will get back to you within 24 hours.\n\nSubject: ${result.data.subject}\nYour message:\n${result.data.message}\n\nBest regards,\nThe Tech4GH Team`,
    }).catch(console.error)

    revalidatePath("/admin/contacts")
    return { 
      success: true, 
      message: "Thank you! We'll get back to you within 24 hours." 
    }
  } catch (error) {
    console.error("Contact submission error:", error)
    return { success: false, error: "Failed to submit. Please try again." }
  }
}

export async function updateContactStatusAction(
  id: string,
  status: "NEW" | "READ" | "RESPONDED" | "ARCHIVED",
  notes?: string
) {
  try {
    await updateContactStatus(id, status, notes)
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("Update contact status error:", error)
    return { success: false, error: "Failed to update status" }
  }
}

export async function deleteContactAction(id: string) {
  try {
    await deleteContactSubmission(id)
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("Delete contact error:", error)
    return { success: false, error: "Failed to delete" }
  }
}
