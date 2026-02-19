import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { TeamMemberForm } from "@/components/admin/team-member-form"

export default async function EditTeamMemberPage({ params }: { params: { memberId: string } }) {
  const member = await prisma.teamMember.findUnique({ where: { id: params.memberId } })
  if (!member) notFound()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Team Member</h1>
      <TeamMemberForm initialData={member} mode="edit" />
    </div>
  )
}
