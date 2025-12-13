import { Suspense } from "react"
import ErrorsList from "@/components/errors-list"
import { getErrors } from "@/lib/mock-api"

export default async function ErrorsPage() {
  const errors = await getErrors()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorsList errors={errors} />
    </Suspense>
  )
}
