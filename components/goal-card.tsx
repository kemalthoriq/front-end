"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { deleteGoal, updateGoal, type Goal as GoalType } from "@/lib/user-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
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
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface GoalCardProps {
  goal: GoalType
  onGoalUpdated: () => void // Callback to refresh goals list
}

export function GoalCard({ goal, onGoalUpdated }: GoalCardProps) {
  const progress = (goal.currentGram / goal.targetGram) * 100
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPendingEdit, setIsPendingEdit] = useState(false)
  const [editGoalData, setEditGoalData] = useState<GoalType>(goal)

  const handlePayInstallment = () => {
    toast({
      title: "Bayar Cicilan",
      description: `Membayar cicilan untuk goal "${goal.name}". (Simulasi)`,
    })
    // In a real app, trigger a Server Action to process payment and update goal
    // For now, just simulate success and refresh
    setTimeout(() => {
      toast({ title: "Cicilan Berhasil", description: `Cicilan untuk goal "${goal.name}" berhasil dibayar.` })
      onGoalUpdated() // Refresh parent component
    }, 1000)
  }

  const handleEditGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPendingEdit(true)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    formData.append("id", editGoalData.id)
    formData.append("contributionMethod", editGoalData.contributionMethod)
    formData.append("reminderEnabled", String(editGoalData.reminderEnabled))

    const result = await updateGoal(formData)
    setIsPendingEdit(false)
    if (result.success) {
      toast({ title: "Goal Diperbarui", description: result.message })
      setIsEditModalOpen(false)
      onGoalUpdated() // Refresh parent component
    } else {
      toast({ title: "Gagal Memperbarui Goal", description: result.message, variant: "destructive" })
    }
  }

  const handleStopGoal = async () => {
    if (confirm(`Apakah Anda yakin ingin menghentikan goal "${goal.name}"?`)) {
      const result = await deleteGoal(goal.id)
      if (result.success) {
        toast({
          title: "Goal Dihentikan",
          description: result.message,
        })
        onGoalUpdated() // Refresh parent component
      } else {
        toast({ title: "Gagal", description: result.message, variant: "destructive" })
      }
    }
  }

  // Calculate next installment date (simple simulation)
  const lastInstallmentDate =
    goal.installments.length > 0
      ? new Date(goal.installments[goal.installments.length - 1].date)
      : new Date(goal.targetDate) // Fallback to target date if no installments
  lastInstallmentDate.setMonth(lastInstallmentDate.getMonth() + 1)
  const nextInstallmentDate = lastInstallmentDate.toLocaleDateString("id-ID")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.name}</CardTitle>
        <CardDescription>Target: {goal.targetGram} gram emas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{goal.currentGram.toFixed(2)} gram</span>
            <span>{goal.targetGram} gram</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">Pencapaian: {progress.toFixed(1)}%</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Target Tanggal:</span> {new Date(goal.targetDate).toLocaleDateString("id-ID")}
          </div>
          <div>
            <span className="font-medium">Kontribusi Bulanan:</span> {goal.monthlyContribution} gram
          </div>
          <div>
            <span className="font-medium">Metode:</span>{" "}
            {goal.contributionMethod === "otomatis" ? "Otomatis" : "Manual"}
          </div>
          <div>
            <span className="font-medium">Pengingat:</span> {goal.reminderEnabled ? "Aktif" : "Nonaktif"}
          </div>
          <div>
            <span className="font-medium">Cicilan Selanjutnya:</span> {nextInstallmentDate}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePayInstallment} className="flex-1">
            Bayar Cicilan Berikutnya
          </Button>
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleStopGoal}>
            Hentikan
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h3 className="text-md font-semibold mb-2">Histori Cicilan</h3>
          {goal.installments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada cicilan.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goal.installments.map((installment, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(installment.date).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell>{installment.amount} gram</TableCell>
                      <TableCell>
                        <Badge variant={installment.status === "Paid" ? "default" : "secondary"}>
                          {installment.status === "Paid" ? "Lunas" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardFooter>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal Emas</DialogTitle>
            <DialogDescription>Perbarui detail goal Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditGoal} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama Goal</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={editGoalData.name}
                onChange={(e) => setEditGoalData({ ...editGoalData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-targetGram">Target Emas (gram)</Label>
              <Input
                id="edit-targetGram"
                name="targetGram"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={editGoalData.targetGram}
                onChange={(e) => setEditGoalData({ ...editGoalData, targetGram: Number.parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-targetDate">Target Tanggal</Label>
              <Input
                id="edit-targetDate"
                name="targetDate"
                type="date"
                defaultValue={editGoalData.targetDate}
                onChange={(e) => setEditGoalData({ ...editGoalData, targetDate: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-monthlyContribution">Kontribusi Bulanan (gram)</Label>
              <Input
                id="edit-monthlyContribution"
                name="monthlyContribution"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={editGoalData.monthlyContribution}
                onChange={(e) =>
                  setEditGoalData({ ...editGoalData, monthlyContribution: Number.parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contributionMethod">Metode Cicilan</Label>
              <Select
                value={editGoalData.contributionMethod}
                onValueChange={(value: "otomatis" | "manual") =>
                  setEditGoalData({ ...editGoalData, contributionMethod: value })
                }
              >
                <SelectTrigger id="edit-contributionMethod">
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
                id="edit-reminderEnabled"
                checked={editGoalData.reminderEnabled}
                onCheckedChange={(checked) => setEditGoalData({ ...editGoalData, reminderEnabled: !!checked })}
              />
              <Label htmlFor="edit-reminderEnabled">Aktifkan Pengingat Cicilan</Label>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPendingEdit}>
                {isPendingEdit ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
