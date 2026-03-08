import MemberForm from "@/components/member-form"
import MemberTable from "@/components/member-table"

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        Fitness Freak Gym Management
      </h1>

      <MemberForm />

      <MemberTable />

    </main>
  )
}