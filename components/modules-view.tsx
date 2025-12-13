"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Clock, Target } from "lucide-react"
import { cn } from "@/lib/utils"

type ModulesViewProps = {
  moduleRisk: any[]
  errors: any[]
}

export default function ModulesView({ moduleRisk, errors }: ModulesViewProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-warning text-black"
      case "low":
        return "bg-success text-black"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getModuleErrors = (moduleName: string) => {
    return errors.filter((e) => e.module === moduleName)
  }

  const getRiskIntensity = (score: number) => {
    // Convert 0-1 score to 0-100 for opacity
    return Math.max(20, Math.min(100, score * 100))
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Module Risk Analysis</h1>
          <p className="text-muted-foreground">Analyze error patterns and risk levels across different modules</p>
        </div>

        {/* Risk Heatmap */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Risk Heatmap</CardTitle>
            <CardDescription>Visual representation of module risk scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {moduleRisk.map((module) => {
                const intensity = getRiskIntensity(module.risk_score)
                return (
                  <div
                    key={module.module}
                    className="relative aspect-square rounded-lg border border-border overflow-hidden group"
                    style={{
                      backgroundColor: `hsl(var(--destructive) / ${intensity}%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <p className="font-semibold text-white mb-2">{module.module}</p>
                      <p className="text-2xl font-bold text-white">{(module.risk_score * 100).toFixed(0)}</p>
                      <p className="text-xs text-white/80">risk score</p>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-sm space-y-1">
                        <p>{module.total_errors} errors</p>
                        <p>{module.repeated_errors} repeated</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Module Details */}
        <div className="grid gap-4 md:grid-cols-2">
          {moduleRisk.map((module) => {
            const moduleErrors = getModuleErrors(module.module)
            const avgFixTime = Math.round(module.avg_fix_time_seconds / 60)

            return (
              <Card key={module.module} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{module.module}</CardTitle>
                      <CardDescription>Module risk analysis and metrics</CardDescription>
                    </div>
                    <Badge className={getRiskColor(module.risk_level)}>{module.risk_level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="size-4" />
                        Total Errors
                      </div>
                      <p className="text-2xl font-bold">{module.total_errors}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="size-4" />
                        Repeated
                      </div>
                      <p className="text-2xl font-bold">{module.repeated_errors}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-4" />
                        Avg Fix Time
                      </div>
                      <p className="text-2xl font-bold">{avgFixTime} min</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="size-4" />
                        Avg Score
                      </div>
                      <p className="text-2xl font-bold">{(module.avg_weighted_score * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Risk Score Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className="font-semibold">{(module.risk_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          module.risk_level === "high" && "bg-destructive",
                          module.risk_level === "medium" && "bg-warning",
                          module.risk_level === "low" && "bg-success",
                        )}
                        style={{ width: `${module.risk_score * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Recent Errors */}
                  {moduleErrors.length > 0 && (
                    <div className="space-y-2 border-t border-border pt-4">
                      <h4 className="text-sm font-semibold">Recent Errors</h4>
                      <div className="space-y-2">
                        {moduleErrors.slice(0, 3).map((error) => (
                          <div
                            key={error.bug_id}
                            className="flex items-center justify-between rounded-md bg-accent/50 p-2 text-xs"
                          >
                            <span className="font-mono">{error.bug_id}</span>
                            <Badge
                              variant="outline"
                              className={
                                error.status === "resolved"
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20"
                              }
                            >
                              {error.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
