"use client"

import { createContext, useContext, useState } from "react"

type Member = {
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
}

const MemberContext = createContext<MemberContextType | null>(null)

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([])

  const addMember = (member: Member) => {
    setMembers((prev) => [...prev, member])
  }

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <MemberContext.Provider value={{ members, addMember, deleteMember }}>
      {children}
    </MemberContext.Provider>
  )
}

export function useMembers() {
  const context = useContext(MemberContext)

  if (!context) {
    throw new Error("useMembers must be used inside MemberProvider")
  }

  return context
}