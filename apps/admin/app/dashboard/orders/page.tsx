import { prisma } from "@ramu/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ramu/ui/components/card"
import { ShoppingCartIcon } from "lucide-react"
import { OrdersClient } from "./orders-client"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      menu: true,
      machine: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const serializedOrders = orders.map(order => ({
    ...order,
    total_price: Number(order.total_price)
  }))

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <ShoppingCartIcon className="size-8 text-primary" /> Order History
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          List of all transactions and orders from all IoT machines.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Showing {serializedOrders.length} latest transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersClient data={serializedOrders as unknown as Parameters<typeof OrdersClient>[0]["data"]} />
        </CardContent>
      </Card>
    </div>
  )
}
