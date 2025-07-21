"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { getGoldPriceHistory, type GoldPriceData } from "@/lib/data"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function GoldPriceChart() {
  const [period, setPeriod] = useState<"7d" | "30d" | "6m" | "1y">("7d")
  const [chartData, setChartData] = useState<GoldPriceData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await getGoldPriceHistory(period)
      setChartData(data)
      setIsLoading(false)
    }
    fetchData()
  }, [period])

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Grafik Harga Emas</CardTitle>
          <CardDescription>Harga beli dan jual per gram (IDR)</CardDescription>
        </div>
        <Select value={period} onValueChange={(value: "7d" | "30d" | "6m" | "1y") => setPeriod(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Hari</SelectItem>
            <SelectItem value="30d">30 Hari</SelectItem>
            <SelectItem value="6m">6 Bulan</SelectItem> {/* New */}
            <SelectItem value="1y">1 Tahun</SelectItem> {/* New */}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ChartContainer
            config={{
              buy: {
                label: "Harga Beli",
                color: "hsl(var(--chart-1))",
              },
              sell: {
                label: "Harga Jual",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  minTickGap={20}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis tickFormatter={formatCurrency} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <ChartTooltip content={<ChartTooltipContent formatter={formatCurrency} />} />
                <Legend />
                <Line type="monotone" dataKey="buy" stroke="var(--color-buy)" name="Harga Beli" dot={false} />
                <Line type="monotone" dataKey="sell" stroke="var(--color-sell)" name="Harga Jual" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Sumber data harga: Data simulasi. Harga aktual dapat bervariasi.
        </p>

        {/* Historical Price Table */}
        <h3 className="text-lg font-semibold mt-8 mb-4">
          Tabel Historis Harga (
          {period === "7d" ? "1 Minggu" : period === "30d" ? "1 Bulan" : period === "6m" ? "6 Bulan" : "1 Tahun"})
        </h3>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Harga Beli (Rp)</TableHead>
                  <TableHead className="text-right">Harga Jual (Rp)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((dataPoint) => (
                  <TableRow key={dataPoint.date}>
                    <TableCell>{new Date(dataPoint.date).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">{dataPoint.buy.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right">{dataPoint.sell.toLocaleString("id-ID")}</TableCell>
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
