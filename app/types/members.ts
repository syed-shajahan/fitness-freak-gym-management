export interface Member {
  id: string
  name: string
  phone: string
  plan: string
  startDate: string
  endDate: string
}

export interface MemberFormData {
  name: string
  phone: string
  plan: string
  startDate: string
  endDate: string
}

export interface ApiError {
  error: string
  details?: string[]
}

export interface GymPlan {
  label: string
  value: string
  duration: number
  price: number
}