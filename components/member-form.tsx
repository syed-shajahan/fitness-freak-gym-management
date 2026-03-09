"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMembers } from "@/app/context/member-context"
import { gymPlans } from "@/lib/plans"
import { Member, MemberFormData } from "@/app/types/members"

export default function MemberForm({
  member,
  onSuccess,
}: {
  member?: Member
  onSuccess?: () => void
}) {
  const { addMember, updateMember, loading } = useMembers()

  const [form, setForm] = useState<MemberFormData>({
    name: "",
    phone: "",
    plan: "",
    startDate: "",
    endDate: "",
  })

  const [errors, setErrors] = useState<Partial<MemberFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const validateForm = (): boolean => {
    const newErrors: Partial<MemberFormData> = {}

    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters"
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits"
    }

    if (!form.plan) {
      newErrors.plan = "Please select a plan"
    }

    if (!form.startDate) {
      newErrors.startDate = "Start date is required"
    } else {
      const startDate = new Date(form.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const memberData: Member = {
        id: member ? member.id : Date.now().toString(),
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
      }

      if (member) {
        await updateMember(memberData)
      } else {
        await addMember(memberData)
      }

      // Reset form
      setForm({
        name: "",
        phone: "",
        plan: "",
        startDate: "",
        endDate: "",
      })
      setErrors({})

      onSuccess?.()
    } catch (err) {
      // Error is handled by context
      console.error("Form submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold">
          {member ? "Edit Member" : "Add Member"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="name"
              placeholder="Member Name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              name="phone"
              placeholder="Phone (10 digits)"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <select
              name="plan"
              value={form.plan}
              onChange={handleChange}
              className={`border rounded-md p-2 w-full ${errors.plan ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Plan</option>
              {gymPlans.map((plan) => (
                <option key={plan.value} value={plan.value}>
                  {plan.label}
                </option>
              ))}
            </select>
            {errors.plan && (
              <p className="text-red-500 text-sm mt-1">{errors.plan}</p>
            )}
          </div>

          <div>
            <Input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <Input
              type="date"
              name="endDate"
              value={form.endDate}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-gray-500 text-sm mt-1">
              End date is calculated automatically based on the selected plan
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full"
          >
            {isSubmitting
              ? (member ? "Updating..." : "Adding...")
              : (member ? "Update Member" : "Add Member")
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}