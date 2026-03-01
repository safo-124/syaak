"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { sendEmail, sendBulkEmail } from "@/lib/email"
import { createNewsletterTemplate, createWelcomeTemplate, createPlainTextFromHtml } from "@/lib/email-templates"

// Subscribe action (for public form)
const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: z.string().optional(),
})

export async function subscribeAction(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    source: formData.get("source") || "website",
  }

  const result = subscribeSchema.safeParse(rawData)
  
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    // Check if already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: result.data.email },
    })

    if (existing) {
      if (!existing.isActive) {
        // Reactivate
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            isActive: true,
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        })
        return { success: true, message: "Welcome back! You've been resubscribed." }
      }
      return { success: true, message: "You're already subscribed!" }
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: result.data.email,
        source: result.data.source,
      },
    })

    // Send welcome email (non-blocking)
    const welcomeHtml = createWelcomeTemplate({
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/unsubscribe?email=${encodeURIComponent(result.data.email)}`,
    })
    
    sendEmail({
      to: result.data.email,
      subject: "Welcome to TechForUGH Newsletter! 🎉",
      html: welcomeHtml,
      text: createPlainTextFromHtml(welcomeHtml),
    }).catch(console.error) // Don't block on welcome email

    revalidatePath("/admin/newsletter")
    return { success: true, message: "Thanks for subscribing!" }
  } catch (error) {
    console.error("Subscribe error:", error)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

// Admin: Create newsletter
const newsletterSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  content: z.string().min(10, "Content is required"),
  previewText: z.string().optional(),
})

export async function createNewsletter(formData: FormData) {
  const rawData = {
    subject: formData.get("subject"),
    content: formData.get("content"),
    previewText: formData.get("previewText"),
  }

  const validatedData = newsletterSchema.parse(rawData)

  await prisma.newsletter.create({
    data: {
      subject: validatedData.subject,
      content: validatedData.content,
      previewText: validatedData.previewText || null,
    },
  })

  revalidatePath("/admin/newsletter")
  redirect("/admin/newsletter")
}

export async function updateNewsletter(id: string, formData: FormData) {
  const rawData = {
    subject: formData.get("subject"),
    content: formData.get("content"),
    previewText: formData.get("previewText"),
  }

  const validatedData = newsletterSchema.parse(rawData)

  await prisma.newsletter.update({
    where: { id },
    data: {
      subject: validatedData.subject,
      content: validatedData.content,
      previewText: validatedData.previewText || null,
    },
  })

  revalidatePath("/admin/newsletter")
  revalidatePath(`/admin/newsletter/${id}`)
  redirect("/admin/newsletter")
}

export async function deleteNewsletter(id: string) {
  await prisma.newsletter.delete({
    where: { id },
  })

  revalidatePath("/admin/newsletter")
  redirect("/admin/newsletter")
}

// Send newsletter using Nodemailer
export async function sendNewsletter(id: string) {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
  })

  if (!newsletter) {
    return { success: false, error: "Newsletter not found" }
  }

  if (newsletter.status === "SENT") {
    return { success: false, error: "Newsletter already sent" }
  }

  // Get active subscribers
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
  })

  if (subscribers.length === 0) {
    return { success: false, error: "No active subscribers" }
  }

  try {
    // Update status to sending
    await prisma.newsletter.update({
      where: { id },
      data: { status: "SENDING" },
    })

    // Prepare email content
    const emailAddresses = subscribers.map((s) => s.email)
    const html = createNewsletterTemplate({
      previewText: newsletter.previewText || undefined,
      content: newsletter.content,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/unsubscribe`,
    })
    const text = createPlainTextFromHtml(html)

    // Send emails using Nodemailer
    const results = await sendBulkEmail(
      emailAddresses,
      newsletter.subject,
      html,
      text
    )

    // Mark as sent
    await prisma.newsletter.update({
      where: { id },
      data: {
        status: results.failed === subscribers.length ? "FAILED" : "SENT",
        sentAt: new Date(),
        sentCount: results.success,
      },
    })

    revalidatePath("/admin/newsletter")
    revalidatePath(`/admin/newsletter/${id}`)

    if (results.failed > 0) {
      return { 
        success: true, 
        message: `Newsletter sent to ${results.success} subscribers. ${results.failed} failed.` 
      }
    }

    return { 
      success: true, 
      message: `Newsletter sent to ${results.success} subscribers!` 
    }
  } catch (error) {
    console.error("Send newsletter error:", error)
    
    await prisma.newsletter.update({
      where: { id },
      data: { status: "FAILED" },
    })

    return { success: false, error: "Failed to send newsletter" }
  }
}

// Admin: Delete subscriber
export async function deleteSubscriber(id: string) {
  await prisma.newsletterSubscriber.delete({
    where: { id },
  })

  revalidatePath("/admin/newsletter")
  revalidatePath("/admin/newsletter/subscribers")
}

// Admin: Toggle subscriber status
export async function toggleSubscriberStatus(id: string) {
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { id },
  })

  if (!subscriber) return

  await prisma.newsletterSubscriber.update({
    where: { id },
    data: {
      isActive: !subscriber.isActive,
      unsubscribedAt: subscriber.isActive ? new Date() : null,
    },
  })

  revalidatePath("/admin/newsletter")
  revalidatePath("/admin/newsletter/subscribers")
}
