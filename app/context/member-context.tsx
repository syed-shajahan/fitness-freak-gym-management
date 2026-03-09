"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Member, MemberFormData, ApiError } from "@/app/types/members"

type MemberContextType = {
  members: Member[]
  loading: boolean
  error: string | null
  addMember: (member: Member) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  updateMember: (member: Member) => Promise<void>
  clearError: () => void
}

const MemberContext = createContext<MemberContextType | null>(null)

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const clearError = () => setError(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    if (!apiUrl) {
      setError("API URL not configured")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${apiUrl}/members`)
      if (!res.ok) {
        throw new Error(`Failed to fetch members: ${res.status} ${res.statusText}`)
      }
      const data: Member[] = await res.json()
      setMembers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch members"
      setError(errorMessage)
      console.error("fetchMembers error:", err)
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (member: Member) => {
    if (!apiUrl) {
      setError("API URL not configured")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${apiUrl}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      })

      if (!res.ok) {
        const errorData: ApiError = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to add member: ${res.status}`)
      }

      const created = await res.json()
      setMembers((prev) => [...prev, created])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add member"
      setError(errorMessage)
      console.error("addMember error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMember = async (id: string) => {
    if (!apiUrl) {
      setError("API URL not configured")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${apiUrl}/members/${id}`, {
        method: "DELETE",
      })

      if (res.status !== 204) {
        const errorData: ApiError = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to delete member: ${res.status}`)
      }

      setMembers((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete member"
      setError(errorMessage)
      console.error("deleteMember error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMember = async (updatedMember: Member) => {
    if (!apiUrl) {
      setError("API URL not configured")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { id, ...body } = updatedMember
      const res = await fetch(`${apiUrl}/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorData: ApiError = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update member: ${res.status}`)
      }

      const updated = await res.json()
      setMembers((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update member"
      setError(errorMessage)
      console.error("updateMember error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <MemberContext.Provider
      value={{
        members,
        loading,
        error,
        addMember,
        deleteMember,
        updateMember,
        clearError
      }}
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