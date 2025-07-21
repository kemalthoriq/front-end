"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useEffect, useState } from "react"
import { getUserTransactions, type Transaction } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface TransactionHistoryTableProps {
  limit?: number // Optional limit for dashboard view
}

export function TransactionHistoryTable({ limit }: TransactionHistoryTableProps) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>("Semua")
  const [filterDate, setFilterDate] = useState<string>("")

  const fetchTransactions = async () => {
    if (user) {
      setIsLoading(true)
      const fetchedTransactions = await getUserTransactions()
      let filtered = fetchedTransactions

      if (filterType !== "Semua") {
        filtered = filtered.filter((t) => t.type === filterType)
      }
      if (filterDate) {
        filtered = filtered.filter((t) => t.date === filterDate)
      }

      setTransactions(limit ? filtered.slice(0, limit) : filtered)
      setIsLoading(false)
    } else {
      setTransactions([])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user, limit, filterType, filterDate])

  const handleDownloadInvoice = (transactionId: string) => {
    toast({
      title: "Unduh Invoice",
      description: `Invoice untuk transaksi ${transactionId} sedang disiapkan. (Simulasi)`,
    })
    // In a real app, trigger an API call to generate and download the invoice
  }

  const transactionTypes = ["Semua", "Pembelian", "Penjualan", "Tarik Dana", "Tarik Emas Fisik", "Cicilan"]

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
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>Lihat semua aktivitas pembelian, penjualan, dan penarikan Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Silakan login untuk melihat riwayat transaksi.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
        <CardDescription>Lihat semua aktivitas pembelian, penjualan, dan penarikan Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        {!limit && ( // Only show filters on the full transactions page
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter Tipe" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full sm:w-[180px]"
            />
            <Button
              variant="outline"
              onClick={() => {
                setFilterType("Semua")
                setFilterDate("")
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">Belum ada transaksi.</div>
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
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      {transaction.type.includes("Emas") || transaction.type === "Cicilan"
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
                    <TableCell className="text-right">
                      {transaction.status === "Selesai" && (
                        <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(transaction.id)}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Unduh Invoice</span>
                        </Button>
                      )}
                    </TableCell>
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
