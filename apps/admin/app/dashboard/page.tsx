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
  TrendingUpIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
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
      where: { current_volume: { lte: 200 } }, // Volume <= 200ml is considered low
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
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Overview
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Real-time status monitoring for your Ramu IoT Jamu system.
        </p>
      </div>

      {/* Metrics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group overflow-hidden relative border-border/50 bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Machines</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
              <CpuIcon className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">
              {onlineMachines} <span className="text-sm font-normal text-muted-foreground">/ {totalMachines} Online</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              IoT dispensers registered.
            </p>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden relative border-border/50 bg-card hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2Icon className="size-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">
              {completedOrders} <span className="text-sm font-normal text-muted-foreground">/ {totalOrders} Done</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Transactions processed successfully.
            </p>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden relative border-border/50 bg-card hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full group-hover:scale-110 transition-transform duration-300">
              <TrendingUpIcon className="size-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Accumulated completed sales.
            </p>
          </CardContent>
        </Card>

        <Card className={`group overflow-hidden relative hover:shadow-xl transition-all duration-300 ${lowStocks.length > 0 ? "border-amber-500/50 bg-amber-500/5 hover:shadow-amber-500/10 hover:-translate-y-1" : "border-border/50 bg-card hover:shadow-primary/5 hover:-translate-y-1"}`}>
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${lowStocks.length > 0 ? "from-amber-500/10" : "from-primary/10"} via-transparent to-transparent`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refill Alerts</CardTitle>
            <div className={`p-2 rounded-full group-hover:scale-110 transition-transform duration-300 ${lowStocks.length > 0 ? "bg-amber-500/10" : "bg-primary/10"}`}>
              <AlertTriangleIcon className={`size-4 ${lowStocks.length > 0 ? "text-amber-500 animate-pulse" : "text-primary"}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">
              {lowStocks.length} <span className="text-sm font-normal text-muted-foreground">Low Tanks</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
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
              <div className="flex flex-col gap-2">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-muted/50 hover:border-border transition-colors">
                    <div className="grid gap-1.5">
                      <p className="text-sm font-semibold leading-none text-foreground">
                        {order.menu?.name || (order.is_custom_ai ? "Custom AI Recipe" : "Ramu Jamu")}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        <span className="text-foreground/80">{order.user?.name || "Guest"}</span> • {new Date(order.createdAt).toLocaleTimeString("id-ID")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <p className="text-sm font-bold tracking-tight">
                        Rp {Number(order.total_price).toLocaleString("id-ID")}
                      </p>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "Completed" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                        order.status === "Failed" ? "bg-destructive/15 text-destructive" :
                        "bg-amber-500/15 text-amber-600 dark:text-amber-400"
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
              <div className="flex flex-col gap-3">
                {lowStocks.map((stock) => {
                  const percent = Math.round((stock.current_volume / stock.max_capacity) * 100)
                  return (
                    <div key={stock.id} className="grid gap-2 p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-foreground">{stock.ingredient.name} <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground ml-2">({stock.machine.location_name || "No Location"})</span></span>
                        <span className="text-amber-500 font-bold">{stock.current_volume} ml <span className="text-muted-foreground font-normal text-xs">/ {stock.max_capacity} ml</span></span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all duration-500 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                        <span>Tank #{stock.tankNumber}</span>
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
