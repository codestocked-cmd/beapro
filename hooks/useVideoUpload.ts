'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MAX_VIDEO_SIZE_MB, ALLOWED_VIDEO_TYPES } from '@/lib/constants'

type UploadStatus = 'idle' | 'validating' | 'uploading' | 'complete' | 'error'

interface UploadOptions {
  bucket: string
  maxSizeMB?: number
  allowedTypes?: string[]
}

export function useVideoUpload() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File, options: UploadOptions): Promise<string> => {
    const maxMB = options.maxSizeMB ?? MAX_VIDEO_SIZE_MB
    const types = options.allowedTypes ?? ALLOWED_VIDEO_TYPES

    setStatus('validating')
    setError(null)
    setProgress(0)

    if (!types.includes(file.type)) {
      const msg = `Invalid file type. Allowed: ${types.join(', ')}`
      setError(msg)
      setStatus('error')
      throw new Error(msg)
    }

    if (file.size > maxMB * 1024 * 1024) {
      const msg = `File too large. Max size: ${maxMB}MB`
      setError(msg)
      setStatus('error')
      throw new Error(msg)
    }

    setStatus('uploading')
    const supabase = createClient()
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

    const { data, error: uploadError } = await supabase.storage
      .from(options.bucket)
      .upload(path, file)

    if (uploadError || !data) {
      const msg = uploadError?.message ?? 'Upload failed'
      setError(msg)
      setStatus('error')
      throw new Error(msg)
    }

    setProgress(100)
    const { data: { publicUrl } } = supabase.storage.from(options.bucket).getPublicUrl(data.path)

    setStatus('complete')
    return publicUrl
  }, [])

  function reset() {
    setStatus('idle')
    setProgress(0)
    setError(null)
  }

  return { upload, progress, status, error, reset }
}
