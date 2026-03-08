"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type Member = {
  id: string
  name: string
  phone: string
  plan: string
  startDate: string
  endDate: string
}

type MemberContextType = {
  members: Member[]
  addMember: (member: Member) => void
  deleteMember: (id: string) => void
  updateMember: (member: Member) => void
}

const MemberContext = createContext<MemberContextType | null>(null)

export function MemberProvider({ children }: { children: React.ReactNode }) {

  // ✅ Load from localStorage initially
  const [members, setMembers] = useState<Member[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gym-members")
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  // ✅ Save to localStorage whenever members change
  useEffect(() => {
    localStorage.setItem("gym-members", JSON.stringify(members))
  }, [members])

  const addMember = (member: Member) => {
    setMembers((prev) => [...prev, member])
  }

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const updateMember = (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === updatedMember.id ? updatedMember : m
      )
    )
  }

  return (
    <MemberContext.Provider
      value={{ members, addMember, deleteMember, updateMember }}
    >
      {children}
    </MemberContext.Provider>
  )
}

export const useMembers = () => {
  const context = useContext(MemberContext)

  if (!context) {
    throw new Error("useMembers must be used within MemberProvider")
  }

  return context
}