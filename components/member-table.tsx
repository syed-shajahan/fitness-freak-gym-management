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
import { Member } from "@/app/types/members"

export default function MemberTable() {
  const { members, deleteMember, loading, error, clearError } = useMembers()

  const [open, setOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getPlanLabel = (planValue: string) => {
    return gymPlans.find((p) => p.value === planValue)?.label || planValue
  }

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setOpen(true)
    clearError()
  }

  const handleAdd = () => {
    setEditingMember(null)
    setOpen(true)
    clearError()
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setDeletingId(id)
      try {
        await deleteMember(id)
      } catch (err) {
        // Error is handled by context
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (loading && members.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading members...</div>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    onClick={clearError}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  size="sm"
                  onClick={() => handleEdit(member)}
                  disabled={loading}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(member.id)}
                  disabled={loading || deletingId === member.id}
                >
                  {deletingId === member.id ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {members.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No members found. Add your first member to get started.
        </div>
      )}

      {/* ShadCN Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">

          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Member" : "Add Member"}
            </DialogTitle>
          </DialogHeader>

          <MemberForm
            // MemberForm expects `member` to be undefined when creating a new
            // entry, so convert null to undefined here to satisfy the type.
            member={editingMember ?? undefined}
            onSuccess={() => setOpen(false)}
          />

        </DialogContent>
      </Dialog>
    </>
  )
}