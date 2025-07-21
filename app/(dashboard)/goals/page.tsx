"use client"

import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GoalCard } from "@/components/goal-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateGoalDialog } from "@/components/create-goal-dialog"
import { useEffect, useState } from "react"
import { getGoals, type Goal as GoalType } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function GoalsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false)
  const [goals, setGoals] = useState<GoalType[]>([])
  const [isLoadingGoals, setIsLoadingGoals] = useState(true)

  const fetchGoals = async () => {
    if (user) {
      setIsLoadingGoals(true)
      const fetchedGoals = await getGoals()
      setGoals(fetchedGoals)
      setIsLoadingGoals(false)
    } else {
      setGoals([])
      setIsLoadingGoals(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [user])

  if (isAuthLoading || isLoadingGoals) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto py-8 grid gap-8">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-12 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-[300px]" />
              <Skeleton className="h-[300px]" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Silakan login untuk melihat goals Anda.</p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8 grid gap-8">
          <h1 className="text-3xl font-bold">Goals Emas Saya</h1>
          <Button onClick={() => setIsCreateGoalModalOpen(true)} className="w-fit">
            <Plus className="mr-2 h-4 w-4" /> Buat Goal Baru
          </Button>

          {goals.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Anda belum memiliki goal emas. Buat satu untuk memulai!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onGoalUpdated={fetchGoals} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CreateGoalDialog
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onGoalCreated={fetchGoals}
      />
    </div>
  )
}
