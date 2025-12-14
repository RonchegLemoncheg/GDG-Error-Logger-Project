"use client"

import { useState } from "react"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { mockBugs } from "@/lib/mock-data"
import { Search, Filter, Code } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ErrorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const types = ["runtime", "syntax", "logic", "performance", "security"]

  const filteredBugs = mockBugs.filter((bug) => {
    const matchesSearch =
      searchQuery === "" ||
      bug.error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.bug_id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(bug.type)

    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <main className="container max-w-screen-2xl py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Error Logs</h1>
          <p className="text-muted-foreground">Browse and filter all reported bugs</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by message, module, or bug ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Type {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Bug Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {types.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      setSelectedTypes(checked ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type))
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedTypes.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedTypes([])}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredBugs.length} of {mockBugs.length} bugs
        </div>

        {/* Bug List */}
        <div className="space-y-3">
          {filteredBugs.map((bug) => (
            <Link key={bug.bug_id} href={`/errors/${bug.bug_id}`}>
              <Card className="transition-colors hover:bg-accent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {bug.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{bug.bug_id}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{bug.error.message}</h3>
                        <p className="text-sm text-muted-foreground">
                          {bug.error.code} at {bug.module}.{bug.function} (Line {bug.error.line})
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {new Date(bug.time).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredBugs.length === 0 && (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">No bugs found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
