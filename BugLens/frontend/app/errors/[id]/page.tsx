import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockBugs } from "@/lib/mock-data"
import { ArrowLeft, Calendar, Code, FileCode, Lightbulb, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ErrorDetailPage({ params }: PageProps) {
  const { id } = await params
  const bug = mockBugs.find((b) => b.bug_id === id)

  if (!bug) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <main className="container max-w-screen-xl py-6">
        <div className="mb-6">
          <Link href="/errors">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Errors
            </Button>
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="capitalize">
              {bug.type}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">{bug.error.message}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(bug.time).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <span>•</span>
            <span>{bug.bug_id}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Error Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Error Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Error Code</p>
                    <p className="font-mono text-sm font-semibold">{bug.error.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Line Number</p>
                    <p className="font-mono text-sm font-semibold">{bug.error.line}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Module</p>
                    <p className="font-mono text-sm font-semibold">{bug.module}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Function</p>
                    <p className="font-mono text-sm font-semibold">{bug.function}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Snippet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Code Snippet
                </CardTitle>
                <CardDescription>
                  Line {bug.error.line} in {bug.module}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto rounded-lg bg-muted/30 p-4">
                  <pre className="font-mono text-sm">
                    <code className="text-foreground">{bug.code_snippet}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold text-sm">Root Cause</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{bug.analyse.cause}</p>
                </div>
                <div className="rounded-lg border border-chart-3/30 bg-chart-3/5 p-4">
                  <h4 className="mb-2 font-semibold text-sm flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    Recommended Fix
                  </h4>
                  <p className="text-sm leading-relaxed">{bug.analyse.fix}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occurrences</p>
                  <p className="text-2xl font-bold">{mockBugs.filter((b) => b.error.code === bug.error.code).length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">First Seen</p>
                  <p className="text-sm font-semibold">
                    {new Date(bug.time).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-sm font-semibold capitalize">{bug.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Affected Module</p>
                  <p className="text-sm font-semibold font-mono">{bug.module}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Function</p>
                  <p className="text-sm font-semibold font-mono">{bug.function}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
