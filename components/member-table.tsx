"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { useMembers } from "@/app/context/member-context"
import { gymPlans } from "@/lib/plans"

export default function MemberTable() {
  const { members, deleteMember } = useMembers()
  const getPlanLabel = (planValue: string) => {
    return gymPlans.find((p) => p.value === planValue)?.label
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.phone}</TableCell>
            <TableCell>{getPlanLabel(member.plan)}</TableCell>
            <TableCell>{member.startDate}</TableCell>
            <TableCell>{member.endDate}</TableCell>

            <TableCell className="flex gap-2">
              <Button variant="outline">
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={() => deleteMember(member.id)}
              >
                Delete
              </Button>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}