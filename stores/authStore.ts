import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/user'

interface AuthStore {
  user: User | null
  profile: UserProfile | null
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}))
