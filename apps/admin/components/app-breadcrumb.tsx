"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ramu/ui/components/breadcrumb"
import React from "react"

const pathMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/machines": "IoT Machines",
  "/dashboard/menu": "Jamu Catalog",
  "/dashboard/ingredients": "Raw Ingredients",
  "/dashboard/symptoms": "Symptom Options",
  "/dashboard/orders": "Order History",
  "/dashboard/sessions": "User Sessions",
  "/dashboard/admins": "Admins Management",
  "/dashboard/profile": "Profile Settings",
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {paths.length > 1 && (
          <React.Fragment>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{pathMap[pathname] || "Page"}</BreadcrumbPage>
            </BreadcrumbItem>
          </React.Fragment>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
