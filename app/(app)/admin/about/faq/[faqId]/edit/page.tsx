import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { FaqForm } from "@/components/admin/faq-form"

export default async function EditFaqPage({ params }: { params: { faqId: string } }) {
  const faq = await prisma.faqItem.findUnique({ where: { id: params.faqId } })
  if (!faq) notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit FAQ Item</h1>
      <FaqForm initialData={faq} mode="edit" />
    </div>
  )
}
