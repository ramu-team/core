"use client"

import { XIcon } from "lucide-react"
import { Button } from "@ramu/ui/components/button"
import { Input } from "@ramu/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@ramu/ui/components/select"
import { useDataTableFilters } from "@/hooks/use-data-table-filters"
import { useState, useEffect } from "react"

export interface FilterOption {
  value: string
  label: string
}

export interface DataTableFilterField {
  id: string
  label: string
  options: FilterOption[]
}

interface DataTableToolbarProps {
  searchKey?: string
  searchPlaceholder?: string
  filters?: DataTableFilterField[]
  children?: React.ReactNode
}

export function DataTableToolbar({
  searchKey = "search",
  searchPlaceholder = "Search...",
  filters = [],
  children,
}: DataTableToolbarProps) {
  const { searchParams, setFilter, clearFilters } = useDataTableFilters()
  
  // Local state for debouncing the search input
  const [searchValue, setSearchValue] = useState(searchParams[searchKey] || "")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(searchParams[searchKey] || "")
  }, [searchParams, searchKey])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== (searchParams[searchKey] || "")) {
        setFilter(searchKey, searchValue || null)
      }
    }, 300)
    
    return () => clearTimeout(handler)
  }, [searchValue, searchKey, setFilter, searchParams])

  const isFiltered = Object.keys(searchParams).length > 0

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-10 w-full md:w-[400px]"
        />
        
        {filters.length > 0 && (
          <div className="w-full md:w-auto flex gap-2 items-center">
            {filters.map((filter) => (
              <Select
                key={filter.id}
                value={searchParams[filter.id] || "all"}
                onValueChange={(value) => setFilter(filter.id, value === "all" ? null : value)}
              >
                <SelectTrigger className="h-10 w-full md:w-[150px]">
                  <span className="line-clamp-1 text-left">
                    {(() => {
                      const val = searchParams[filter.id]
                      if (!val || val === "all") return `All ${filter.label}`
                      return filter.options.find(o => o.value === val)?.label || val
                    })()}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchValue("");
              clearFilters();
            }}
            className="h-10 px-2 lg:px-3 text-muted-foreground"
          >
            Reset
            <XIcon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      
      {children && (
        <div className="flex items-center shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}
