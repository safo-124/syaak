import { PrismaClient } from "../app/generated/prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const accelerateUrl = process.env.DATABASE_URL
if (!accelerateUrl) {
  throw new Error("DATABASE_URL is not set. Please configure it in your environment.")
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    accelerateUrl, // now a plain string, not string | undefined
  }).$extends(withAccelerate())

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma