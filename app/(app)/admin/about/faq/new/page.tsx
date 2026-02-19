import { FaqForm } from "@/components/admin/faq-form"

export default function NewFaqPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add FAQ Item</h1>
      <FaqForm mode="create" />
    </div>
  )
}
