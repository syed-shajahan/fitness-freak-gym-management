"use client"

import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useMembers } from "@/app/context/member-context"
import { gymPlans } from "@/lib/plans"
import MemberForm from "./member-form"

export default function MemberTable() {
  const { members, deleteMember } = useMembers()

  const [open, setOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)

  const getPlanLabel = (planValue: string) => {
    return gymPlans.find((p) => p.value === planValue)?.label
  }

  const handleEdit = (member: any) => {
    setEditingMember(member)
    setOpen(true)
  }

  const handleAdd = () => {
    setEditingMember(null)
    setOpen(true)
  }

  return (
    <>
      

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
                <Button
                  variant="outline"
                  onClick={() => handleEdit(member)}
                >
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

      {/* ShadCN Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Member" : "Add Member"}
            </DialogTitle>
          </DialogHeader>

          <MemberForm
            member={editingMember}
            onSuccess={() => setOpen(false)}
          />

        </DialogContent>
      </Dialog>
    </>
  )
}