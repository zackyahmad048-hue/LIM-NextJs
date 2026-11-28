'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { reviewPermohonanAction } from '@/modules/wajib-khidmah/presentation/actions/review-permohonan.action'

interface Props {
  permohonanId: string
  namaLembaga: string
}

export function ReviewPermohonanDialog({ permohonanId, namaLembaga }: Props) {
  const [open, setOpen] = useState(false)
  const [catatan, setCatatan] = useState('')
  const [pending, startTransition] = useTransition()

  function submit(action: 'approve' | 'reject') {
    const formData = new FormData()
    formData.set('permohonanId', permohonanId)
    formData.set('action', action)
    if (catatan) formData.set('catatan', catatan)

    startTransition(async () => {
      const result = await reviewPermohonanAction(formData)
      if (result.success) {
        toast.success(action === 'approve' ? 'Permohonan disetujui' : 'Permohonan ditolak')
        setOpen(false)
        setCatatan('')
        return
      }
      toast.error(result.error ?? 'Gagal memproses permohonan')
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Review</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review permohonan</DialogTitle>
          <DialogDescription>{namaLembaga}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="catatan-review" className="text-sm font-medium">
            Catatan (opsional)
          </label>
          <Textarea
            id="catatan-review"
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Alasan atau catatan review"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Batal
          </Button>
          <Button variant="destructive" onClick={() => submit('reject')} disabled={pending}>
            Tolak
          </Button>
          <Button onClick={() => submit('approve')} disabled={pending}>
            Setujui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
