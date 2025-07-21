"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createGoal } from "@/lib/user-data"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateGoalDialogProps {
  isOpen: boolean
  onClose: () => void
  onGoalCreated: () => void
}

export function CreateGoalDialog({ isOpen, onClose, onGoalCreated }: CreateGoalDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const [contributionMethod, setContributionMethod] = useState<"otomatis" | "manual">("manual")
  const [reminderEnabled, setReminderEnabled] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    formData.append("contributionMethod", contributionMethod)
    formData.append("reminderEnabled", String(reminderEnabled))

    const result = await createGoal(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Goal Dibuat", description: result.message })
      onGoalCreated()
      onClose()
    } else {
      toast({ title: "Gagal Membuat Goal", description: result.message, variant: "destructive" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Goal Emas Baru</DialogTitle>
          <DialogDescription>Tetapkan target emas Anda dan rencanakan pencapaiannya.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Goal</Label>
            <Input id="name" name="name" placeholder="Emas untuk pernikahan" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="targetGram">Target Emas (gram)</Label>
            <Input id="targetGram" name="targetGram" type="number" step="0.01" min="0.01" placeholder="10" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="targetDate">Target Tanggal</Label>
            <Input id="targetDate" name="targetDate" type="date" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monthlyContribution">Kontribusi Bulanan (gram)</Label>
            <Input
              id="monthlyContribution"
              name="monthlyContribution"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.5"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contributionMethod">Metode Cicilan</Label>
            <Select
              value={contributionMethod}
              onValueChange={(value: "otomatis" | "manual") => setContributionMethod(value)}
            >
              <SelectTrigger id="contributionMethod">
                <SelectValue placeholder="Pilih metode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="otomatis">Otomatis (Auto-debit)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reminderEnabled"
              checked={reminderEnabled}
              onCheckedChange={(checked) => setReminderEnabled(!!checked)}
            />
            <Label htmlFor="reminderEnabled">Aktifkan Pengingat Cicilan</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Membuat..." : "Buat Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
