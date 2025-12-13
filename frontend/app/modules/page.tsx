import { Suspense } from "react"
import ModulesView from "@/components/modules-view"
import { getModuleRisk, getErrors } from "@/lib/mock-api"

export default async function ModulesPage() {
  const [moduleRisk, errors] = await Promise.all([getModuleRisk(), getErrors()])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModulesView moduleRisk={moduleRisk} errors={errors} />
    </Suspense>
  )
}
