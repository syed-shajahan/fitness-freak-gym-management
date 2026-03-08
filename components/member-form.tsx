"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMembers } from "@/app/context/member-context"
import { gymPlans } from "@/lib/plans"

export default function MemberForm() {
  const { addMember } = useMembers()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    plan: "",
    startDate: "",
    endDate: "",
  })

  const calculateEndDate = (plan: string, startDate: string) => {
    const selectedPlan = gymPlans.find((p) => p.value === plan)

    if (!selectedPlan || !startDate) return ""

    const start = new Date(startDate)
    start.setMonth(start.getMonth() + selectedPlan.duration)

    return start.toISOString().split("T")[0]
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    let updatedForm = {
      ...form,
      [name]: value,
    }

    if (name === "plan" || name === "startDate") {
      updatedForm.endDate = calculateEndDate(
        name === "plan" ? value : form.plan,
        name === "startDate" ? value : form.startDate
      )
    }

    setForm(updatedForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    addMember({
      id: Date.now().toString(),
      ...form,
    })

    setForm({
      name: "",
      phone: "",
      plan: "",
      startDate: "",
      endDate: "",
    })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Add Member</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            name="name"
            placeholder="Member Name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="">Select Plan</option>

            {gymPlans.map((plan) => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
              </option>
            ))}
          </select>

          <Input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />

          <Input
            type="date"
            name="endDate"
            value={form.endDate}
            readOnly
          />

          <Button type="submit">
            Add Member
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}