import { NavHeader } from "@/components/nav-header";
import { StatCard } from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockBugs, getBugsByType, getBugsOverTime } from "@/lib/mock-data";
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const totalBugs = mockBugs.length;
  const recentBugs = mockBugs.slice(0, 5);
  const bugsByType = getBugsByType(mockBugs);
  const timeline = getBugsOverTime(mockBugs);

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <main className="container max-w-screen-2xl py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and analyze your application bugs
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bugs"
            value={totalBugs}
            icon={Bug}
            change="+3 from last week"
            trend="up"
          />
          <StatCard
            title="Runtime Errors"
            value={mockBugs.filter((b) => b.type === "runtime").length}
            icon={AlertTriangle}
            change="Most common type"
            trend="neutral"
          />
          <StatCard
            title="Security Issues"
            value={mockBugs.filter((b) => b.type === "security").length}
            icon={AlertTriangle}
            change="Needs attention"
            trend="down"
          />
          <StatCard
            title="This Week"
            value={timeline
              .slice(-7)
              .reduce((sum, item) => sum + item.count, 0)}
            icon={CheckCircle2}
            change="Last 7 days"
            trend="up"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bug Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Bug Type Distribution</CardTitle>
              <CardDescription>Breakdown of bugs by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(bugsByType).map(([type, count]) => {
                  const percentage = ((count / totalBugs) * 100).toFixed(1);
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{type}</span>
                        <span className="text-muted-foreground">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Bug Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Bug Trend</CardTitle>
              <CardDescription>Bugs reported over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timeline.slice(-7).map((item, index) => {
                  const isIncreasing =
                    index > 0 && item.count > timeline[index - 1].count;
                  return (
                    <div
                      key={item.date}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {isIncreasing ? (
                          <TrendingUp className="h-4 w-4 text-chart-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-chart-3" />
                        )}
                        <span className="text-sm font-medium">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                (item.count /
                                  Math.max(...timeline.map((t) => t.count))) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-semibold">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bugs */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bugs</CardTitle>
                <CardDescription>
                  Latest bugs reported in your application
                </CardDescription>
              </div>
              <Link
                href="/errors"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBugs.map((bug) => (
                <Link
                  key={bug.bug_id}
                  href={`/errors/${bug.bug_id}`}
                  className="group block rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {bug.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {bug.bug_id}
                        </span>
                      </div>
                      <p className="font-medium group-hover:text-primary">
                        {bug.error.message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bug.module} · {bug.function}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {new Date(bug.time).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
