"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getUserTransactions, type Transaction } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export function MutasiTable() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        setIsLoading(true)
        const fetchedTransactions = await getUserTransactions()
        setTransactions(fetchedTransactions.filter((t) => t.type !== "Cicilan")) // Mutasi excludes goals
        setIsLoading(false)
      } else {
        setTransactions([])
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [user])

  if (isAuthLoading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mutasi Wallet</CardTitle>
          <CardDescription>Lihat semua pergerakan dana dan emas di wallet Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Silakan login untuk melihat mutasi wallet.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mutasi Wallet</CardTitle>
        <CardDescription>Lihat semua pergerakan dana dan emas di wallet Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">Belum ada mutasi.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deskripsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      {transaction.type.includes("Emas")
                        ? `${transaction.amount} gram`
                        : `Rp ${transaction.amount.toLocaleString("id-ID")}`}
                    </TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "Selesai"
                            ? "default"
                            : transaction.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
