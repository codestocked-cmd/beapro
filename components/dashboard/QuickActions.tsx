'use client'

import { useRouter } from 'next/navigation'
import { Target, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="primary"
        onClick={() => router.push('/scout')}
        className="flex-1 sm:flex-none"
      >
        <Target className="w-4 h-4" />
        Scout an Opponent
      </Button>
      <Button
        variant="secondary"
        onClick={() => router.push('/training')}
        className="flex-1 sm:flex-none"
      >
        <Upload className="w-4 h-4" />
        Upload Training Video
      </Button>
    </div>
  )
}
