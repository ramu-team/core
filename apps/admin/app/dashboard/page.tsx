import { prisma } from "@ramu/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ramu/ui/components/card"
import {
  CpuIcon,
  ActivityIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  RefreshCwIcon,
} from "lucide-react"

// Force Next.js to dynamically fetch data on each request
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  // Fetch real-time data from Neon PostgreSQL via Prisma
  const [
    totalMachines,
    onlineMachines,
    totalOrders,
    completedOrders,
    totalRevenueResult,
    lowStocks,
    recentOrders,
  ] = await Promise.all([
    prisma.machine.count(),
    prisma.machine.count({ where: { status: "Online" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "Completed" } }),
    prisma.order.aggregate({
      where: { status: "Completed" },
      _sum: { total_price: true },
    }),
    prisma.machineStock.findMany({
      where: { current_volume: { lte: 200 } }, // Volume <= 200ml dianggap tipis
      include: {
        machine: true,
        ingredient: true,
      },
      take: 5,
    }),
    prisma.order.findMany({
      include: {
        user: true,
        menu: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const totalRevenue = totalRevenueResult._sum.total_price ? Number(totalRevenueResult._sum.total_price) : 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Real-time status monitoring for your Ramu IoT Jamu system.
        </p>
      </div>

      {/* Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Machines</CardTitle>
            <CpuIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {onlineMachines} <span className="text-sm font-normal text-muted-foreground">/ {totalMachines} Online</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              IoT dispensers registered in the system.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <CheckCircle2Icon className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedOrders} <span className="text-sm font-normal text-muted-foreground">/ {totalOrders} Done</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Transactions processed successfully.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUpIcon className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Accumulated completed sales.
            </p>
          </CardContent>
        </Card>

        <Card className={lowStocks.length > 0 ? "border-amber-500/50 bg-amber-500/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refill Alerts</CardTitle>
            <AlertTriangleIcon className={`size-4 ${lowStocks.length > 0 ? "text-amber-500 animate-pulse" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lowStocks.length} <span className="text-sm font-normal text-muted-foreground">Low Tanks</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Liquid stocks below 200 ml threshold.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              The latest Jamu sales transactions across all IoT machines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <p>No transactions found.</p>
                <p className="text-xs">Once a machine sells a cup, it will show up here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {order.menu?.nama_jamu || (order.is_custom_ai ? "Custom AI Recipe" : "Ramu Jamu")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        User: {order.user?.name || "Guest"} • {new Date(order.createdAt).toLocaleTimeString("id-ID")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-sm font-semibold">
                        Rp {Number(order.total_price).toLocaleString("id-ID")}
                      </p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        order.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" :
                        order.status === "Failed" ? "bg-destructive/10 text-destructive" :
                        "bg-amber-500/10 text-amber-500"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Refills</CardTitle>
            <CardDescription>
              Tanks that require urgent replenishment to keep machines running.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStocks.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <p className="text-emerald-500 font-medium">All ingredient volumes are optimal!</p>
                <p className="text-xs mt-1">No pending alerts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStocks.map((stock) => {
                  const percent = Math.round((stock.current_volume / stock.max_capacity) * 100)
                  return (
                    <div key={stock.id} className="grid gap-2 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span>{stock.ingredient.nama_bahan} <span className="text-xs text-muted-foreground">({stock.machine.location_name || "Tanpa Lokasi"})</span></span>
                        <span className="text-amber-500 font-semibold">{stock.current_volume} ml / {stock.max_capacity} ml</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Tank #{stock.nomor_tangki}</span>
                        <span>{percent}% Remaining</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
