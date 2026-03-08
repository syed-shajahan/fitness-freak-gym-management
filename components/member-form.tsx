"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMembers } from "@/app/context/member-context"
import { gymPlans } from "@/lib/plans"

export default function MemberForm({
  member,
  onSuccess,
}: {
  member?: any
  onSuccess?: () => void
}) {
  const { addMember, updateMember } = useMembers()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    plan: "",
    startDate: "",
    endDate: "",
  })

  const [error, setError] = useState("")

  useEffect(() => {
    if (member) {
      setForm(member)
    }
  }, [member])

  const calculateEndDate = (plan: string, startDate: string) => {
    const selectedPlan = gymPlans.find((p) => p.value === plan)

    if (!selectedPlan || !startDate) return ""

    const start = new Date(startDate)
    start.setMonth(start.getMonth() + selectedPlan.duration)

    const year = start.getFullYear()
    const month = String(start.getMonth() + 1).padStart(2, "0")
    const day = String(start.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
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

    if (!form.name || !form.phone || !form.plan || !form.startDate) {
      setError("Please fill all fields")
      return
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be 10 digits")
      return
    }

    setError("")

    if (member) {
      updateMember({
        id: member.id,
        ...form,
      })
    } else {
      addMember({
        id: Date.now().toString(),
        ...form,
      })
    }

    setForm({
      name: "",
      phone: "",
      plan: "",
      startDate: "",
      endDate: "",
    })

    onSuccess?.()
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6 space-y-4">

        <h2 className="text-xl font-bold">
          {member ? "Edit Member" : "Add Member"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Input
            name="name"
            placeholder="Member Name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            name="phone"
            placeholder="Phone (10 digits)"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
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
            {member ? "Update Member" : "Add Member"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}