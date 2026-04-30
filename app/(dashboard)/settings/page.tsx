'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, CreditCard, Lock, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { pageVariants } from '@/lib/utils/animations'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [deleteModal, setDeleteModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  async function handleChangePassword() {
    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    setChangingPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setChangingPassword(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated')
      setNewPassword('')
    }
  }

  async function handleDeleteAccount() {
    setDeleteModal(false)
    toast.error('Account deletion requires backend support. Please contact support.')
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--color-brand)]" />Profile
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Email</p>
            <p className="text-sm text-[var(--color-text-primary)]">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Account ID</p>
            <p className="text-xs font-mono-data text-[var(--color-text-muted)]">{user?.id}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[var(--color-brand)]" />Subscription
        </h2>
        <div className="flex items-center justify-between p-4 bg-[var(--color-bg-elevated)] rounded-[var(--radius-md)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-[var(--color-text-primary)]">Starter Plan</p>
              <Badge variant="default">Free</Badge>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">3 game plans/month · 5 training uploads</p>
          </div>
          <Button variant="primary" size="sm">Upgrade to Pro</Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[var(--color-brand)]" />Change Password
        </h2>
        <div className="space-y-3">
          <Input label="New password" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Button onClick={handleChangePassword} loading={changingPassword} variant="secondary" size="sm">
            Update password
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[var(--color-danger)]" />Danger Zone
        </h2>
        <div className="flex items-center justify-between p-4 bg-[rgba(255,77,77,0.05)] border border-[rgba(255,77,77,0.15)] rounded-[var(--radius-md)]">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Delete account</p>
            <p className="text-xs text-[var(--color-text-muted)]">This action is irreversible</p>
          </div>
          <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>Delete account</Button>
        </div>
      </Card>

      <Button variant="ghost" onClick={signOut} className="text-[var(--color-danger)]">
        Sign out
      </Button>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Are you sure you want to delete your account? All your data, game plans, and training history will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">Delete permanently</Button>
        </div>
      </Modal>
    </motion.div>
  )
}
