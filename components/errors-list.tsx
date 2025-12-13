"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock, Code } from "lucide-react"

type ErrorsListProps = {
  errors: any[]
}

export default function ErrorsList({ errors }: ErrorsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getStatusColor = (status: string) => {
    return status === "resolved"
      ? "bg-success/10 text-success border-success/20"
      : "bg-destructive/10 text-destructive border-destructive/20"
  }

  const getTypeColor = (type: string) => {
    return type === "compile"
      ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
      : "bg-chart-2/10 text-chart-2 border-chart-2/20"
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Error Details</h1>
          <p className="text-muted-foreground">
            Click on any error to view detailed information, causes, and code fixes
          </p>
        </div>

        {/* Errors List */}
        <div className="space-y-4">
          {errors.map((error) => {
            const isExpanded = expandedId === error.bug_id
            const duration = Math.round(error.time.duration_seconds / 60)

            return (
              <Card key={error.bug_id} className="bg-card border-border overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => toggleExpand(error.bug_id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-mono">{error.bug_id}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(error.status)}>
                          {error.status === "resolved" ? (
                            <CheckCircle2 className="mr-1 size-3" />
                          ) : (
                            <AlertCircle className="mr-1 size-3" />
                          )}
                          {error.status}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(error.type)}>
                          {error.type}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Code className="size-3" />
                          {error.module} • {error.function}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {duration} min
                        </span>
                        <span className="text-destructive font-medium">
                          {error.error.code}: {error.error.message}
                        </span>
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-6 border-t border-border pt-6">
                    {/* Error Details */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Error Location</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Module:</span>{" "}
                            <span className="font-mono">{error.module}</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Function:</span>{" "}
                            <span className="font-mono">{error.function}</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Line:</span>{" "}
                            <span className="font-mono">{error.error.line}</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Error Code:</span>{" "}
                            <span className="font-mono text-destructive">{error.error.code}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Analysis</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Weighted Score:</span>{" "}
                            <Badge variant="outline" className="ml-1">
                              {(error.analysis.weighted_score * 100).toFixed(0)}%
                            </Badge>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Duration:</span> {duration} minutes
                          </p>
                          <div>
                            <span className="text-muted-foreground">Dependencies:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {error.analysis.dependency.map((dep: string) => (
                                <Badge key={dep} variant="secondary" className="text-xs">
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cause */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground">Root Cause</h4>
                      <div className="rounded-lg bg-accent/50 p-4 text-sm">
                        <p>{error.analysis.cause}</p>
                      </div>
                    </div>

                    {/* Fix Description */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground">Fix Applied</h4>
                      <div className="rounded-lg bg-success/10 border border-success/20 p-4 text-sm">
                        <p>{error.analysis.fix}</p>
                      </div>
                    </div>

                    {/* Code Snippets */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Before */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-destructive">Before (Buggy Code)</h4>
                        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                          <pre className="text-xs font-mono overflow-x-auto">
                            <code>
                              {error.code_snippet.before.map((line: string, i: number) => (
                                <div key={i} className="text-destructive">
                                  {line}
                                </div>
                              ))}
                            </code>
                          </pre>
                        </div>
                      </div>

                      {/* After */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-success">After (Fixed Code)</h4>
                        <div className="rounded-lg bg-success/5 border border-success/20 p-4">
                          <pre className="text-xs font-mono overflow-x-auto">
                            <code>
                              {error.code_snippet.after.map((line: string, i: number) => (
                                <div key={i} className="text-success">
                                  {line}
                                </div>
                              ))}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center gap-6 text-xs text-muted-foreground border-t border-border pt-4">
                      <span>First seen: {new Date(error.time.first_seen).toLocaleString()}</span>
                      <span>Last seen: {new Date(error.time.last_seen).toLocaleString()}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
