import prisma from "./prisma"

export async function getNewsletterStats() {
  const [totalSubscribers, activeSubscribers, newsletters, recentNewsletters] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.newsletter.count(),
    prisma.newsletter.findMany({
      where: { status: "SENT" },
      orderBy: { sentAt: "desc" },
      take: 5,
    }),
  ])

  return {
    totalSubscribers,
    activeSubscribers,
    totalNewsletters: newsletters,
    recentNewsletters,
  }
}

export async function getAllSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getActiveSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getSubscriberById(id: string) {
  return prisma.newsletterSubscriber.findUnique({
    where: { id },
  })
}

export async function getAllNewsletters() {
  return prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getNewsletterById(id: string) {
  return prisma.newsletter.findUnique({
    where: { id },
  })
}

export async function subscribeToNewsletter(email: string, source?: string, name?: string) {
  // Check if already exists
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  })

  if (existing) {
    // Reactivate if unsubscribed
    if (!existing.isActive) {
      return prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          unsubscribedAt: null,
          subscribedAt: new Date(),
        },
      })
    }
    return existing
  }

  return prisma.newsletterSubscriber.create({
    data: {
      email,
      name,
      source: source || "website",
    },
  })
}

export async function unsubscribeFromNewsletter(email: string) {
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  })

  if (!subscriber) return null

  return prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      isActive: false,
      unsubscribedAt: new Date(),
    },
  })
}
