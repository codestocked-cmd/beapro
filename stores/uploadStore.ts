import { create } from 'zustand'

export interface UploadJob {
  id: string
  jobId: string
  type: 'scout' | 'training'
  fileName: string
  status: 'uploading' | 'processing' | 'complete' | 'failed'
  progress: number
  createdAt: string
}

interface UploadStore {
  jobs: UploadJob[]
  addJob: (job: UploadJob) => void
  updateJob: (id: string, updates: Partial<UploadJob>) => void
  removeJob: (id: string) => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  jobs: [],
  addJob: (job) => set((s) => ({ jobs: [...s.jobs, job] })),
  updateJob: (id, updates) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  removeJob: (id) => set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) })),
}))
