import AddMemberDialog from "@/components/add-member-dialog"
import MemberTable from "@/components/member-table"
// import AddMemberDialog from "@/components/add-member-dialog"

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Fitness Freak Gym Management
        </h1>

        <AddMemberDialog />
      </div>

      <MemberTable />

    </main>
  )
}