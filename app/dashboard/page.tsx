import { Suspense } from "react"
import DashboardOverview from "@/components/dashboard-overview"
import { getSummary, getErrors, getModuleRisk } from "@/lib/mock-api"

export default async function DashboardPage() {
  const [summary, errors, moduleRisk] = await Promise.all([getSummary(), getErrors(), getModuleRisk()])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardOverview summary={summary} errors={errors} moduleRisk={moduleRisk} />
    </Suspense>
  )
}
