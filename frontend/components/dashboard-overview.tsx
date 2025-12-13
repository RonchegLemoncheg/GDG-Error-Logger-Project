"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type DashboardOverviewProps = {
  summary: any
  errors: any[]
  moduleRisk: any[]
}

export default function DashboardOverview({ summary, errors, moduleRisk }: DashboardOverviewProps) {
  // Prepare chart data
  const errorsByType = [
    { name: "Compile", value: errors.filter((e) => e.type === "compile").length, fill: "#8b5cf6" },
    { name: "Runtime", value: errors.filter((e) => e.type === "runtime").length, fill: "#ec4899" },
  ]

  const errorsByStatus = [
    { name: "Resolved", value: summary.resolved, fill: "#10b981" },
    { name: "Open", value: summary.open, fill: "#f97316" },
  ]

  const moduleData = moduleRisk.map((m) => ({
    name: m.module,
    errors: m.total_errors,
    risk: m.risk_score * 100,
  }))

  const errorTimeline = errors.slice(0, 5).map((e, i) => ({
    id: e.bug_id,
    duration: e.time.duration_seconds / 60,
    score: e.analysis.weighted_score * 100,
  }))

  const avgFixTime = Math.round(summary.avg_fix_time_seconds / 60)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Error Tracking Dashboard</h1>
          <p className="text-muted-foreground">Monitor and analyze errors across your codebase</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
              <AlertCircle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_errors}</div>
              <p className="text-xs text-muted-foreground">Tracked issues</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="size-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{summary.resolved}</div>
              <p className="text-xs text-muted-foreground">Successfully fixed</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <AlertTriangle className="size-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{summary.open}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Fix Time</CardTitle>
              <Clock className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgFixTime} min</div>
              <p className="text-xs text-muted-foreground">Resolution time</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Error Distribution by Type */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Error Distribution by Type</CardTitle>
              <CardDescription>Compile vs Runtime errors</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  compile: {
                    label: "Compile",
                    color: "#8b5cf6",
                  },
                  runtime: {
                    label: "Runtime",
                    color: "#ec4899",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={{ pointerEvents: "none" }}>
                    <Pie
                      data={errorsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {errorsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Error Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Error Status</CardTitle>
              <CardDescription>Resolved vs Open issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  resolved: {
                    label: "Resolved",
                    color: "#10b981",
                  },
                  open: {
                    label: "Open",
                    color: "#f97316",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={{ pointerEvents: "none" }}>
                    <Pie
                      data={errorsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {errorsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Module Risk & Error Timeline */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Module Risk Analysis */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Module Risk Analysis</CardTitle>
              <CardDescription>Errors and risk scores by module</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  errors: {
                    label: "Errors",
                    color: "hsl(var(--chart-2))",
                  },
                  risk: {
                    label: "Risk Score",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="errors" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="risk" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Errors Timeline */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Error Resolution Metrics</CardTitle>
              <CardDescription>Duration and severity scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  duration: {
                    label: "Duration (min)",
                    color: "hsl(var(--chart-4))",
                  },
                  score: {
                    label: "Score",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errorTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="id" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="duration"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
