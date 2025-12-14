"use client"

import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockBugs, getBugsByType, getBugsOverTime, getBugsByModule } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Activity, Target, Zap } from "lucide-react"

export default function AnalyticsPage() {
  const bugsByType = Object.entries(getBugsByType(mockBugs)).map(([name, value]) => ({
    name,
    value,
  }))

  const bugsOverTime = getBugsOverTime(mockBugs)

  const bugsByModule = getBugsByModule(mockBugs)

  // Heatmap data - bugs by hour of day and day of week
  const heatmapData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const data: { day: string; hour: number; value: number }[] = []

    days.forEach((day, dayIndex) => {
      hours.forEach((hour) => {
        const value = mockBugs.filter((bug) => {
          const date = new Date(bug.time)
          return date.getDay() === dayIndex && date.getHours() === hour
        }).length
        data.push({ day, hour, value })
      })
    })

    return data
  })()

  const COLORS = {
    chart1: "oklch(0.65 0.22 262)",
    chart2: "oklch(0.6 0.18 200)",
    chart3: "oklch(0.7 0.16 160)",
    chart4: "oklch(0.6 0.22 25)",
    chart5: "oklch(0.75 0.16 85)",
  }

  const PIE_COLORS = [COLORS.chart1, COLORS.chart2, COLORS.chart3, COLORS.chart4, COLORS.chart5]

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <main className="container max-w-screen-2xl py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your bug patterns and trends</p>
        </div>

        {/* Key Metrics */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Most Active Module</p>
                  <p className="text-2xl font-bold">{bugsByModule[0]?.module}</p>
                </div>
                <div className="rounded-lg bg-chart-2/10 p-3">
                  <Activity className="h-5 w-5 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Runtime Errors</p>
                  <p className="text-2xl font-bold">{mockBugs.filter((b) => b.type === "runtime").length}</p>
                </div>
                <div className="rounded-lg bg-chart-1/10 p-3">
                  <TrendingUp className="h-5 w-5 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Issues</p>
                  <p className="text-2xl font-bold">{mockBugs.filter((b) => b.type === "security").length}</p>
                </div>
                <div className="rounded-lg bg-chart-4/10 p-3">
                  <Target className="h-5 w-5 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bugs This Week</p>
                  <p className="text-2xl font-bold">
                    {bugsOverTime.slice(-7).reduce((sum, item) => sum + item.count, 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-chart-5/10 p-3">
                  <Zap className="h-5 w-5 text-chart-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bug Trend Over Time */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Bug Trend Over Time</CardTitle>
              <CardDescription>Daily bug reports over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={bugsOverTime}>
                  <defs>
                    <linearGradient id="colorBugs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.chart1} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.chart1} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
                  <XAxis
                    dataKey="date"
                    stroke="oklch(0.6 0 0)"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis stroke="oklch(0.6 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0 0)",
                      border: "1px solid oklch(0.2 0 0)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke={COLORS.chart1} fill="url(#colorBugs)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bug Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Bug Type Distribution</CardTitle>
              <CardDescription>Breakdown by error category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bugsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bugsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0 0)",
                      border: "1px solid oklch(0.2 0 0)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bugs by Module */}
          <Card>
            <CardHeader>
              <CardTitle>Bugs by Module</CardTitle>
              <CardDescription>Top modules with most bugs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bugsByModule.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
                  <XAxis type="number" stroke="oklch(0.6 0 0)" />
                  <YAxis dataKey="module" type="category" stroke="oklch(0.6 0 0)" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0 0)",
                      border: "1px solid oklch(0.2 0 0)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill={COLORS.chart2} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Bug Activity Heatmap</CardTitle>
            <CardDescription>Bugs by day of week and hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="inline-grid grid-cols-25 gap-1 min-w-[800px]">
                <div className="col-span-1"></div>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="text-center text-xs text-muted-foreground">
                    {i}
                  </div>
                ))}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, dayIndex) => (
                  <>
                    <div
                      key={`label-${day}`}
                      className="text-right pr-2 text-xs font-medium text-muted-foreground py-1"
                    >
                      {day}
                    </div>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const value = heatmapData.find((d) => d.day === day && d.hour === hour)?.value || 0
                      const opacity = value === 0 ? 0.1 : Math.min(value / 2, 1)
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className="aspect-square rounded transition-all hover:ring-2 hover:ring-primary"
                          style={{
                            backgroundColor: `oklch(0.65 0.22 262 / ${opacity})`,
                          }}
                          title={`${day} ${hour}:00 - ${value} bugs`}
                        />
                      )
                    })}
                  </>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0.1, 0.3, 0.5, 0.7, 1].map((opacity) => (
                  <div
                    key={opacity}
                    className="h-3 w-3 rounded"
                    style={{ backgroundColor: `oklch(0.65 0.22 262 / ${opacity})` }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
