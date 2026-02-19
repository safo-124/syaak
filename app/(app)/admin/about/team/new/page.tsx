import { TeamMemberForm } from "@/components/admin/team-member-form"

export default function NewTeamMemberPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Team Member</h1>
      <TeamMemberForm mode="create" />
    </div>
  )
}
