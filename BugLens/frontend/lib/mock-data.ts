import data from "./logs.json"
export interface Bug {
  bug_id: string
  type: "runtime" | "syntax" | "logic" | "performance" | "security"
  module: string
  function: string
  error: {
    code: string
    message: string
    line: number
  }
  code_snippet: string
  time: string
  analyse: {
    cause: string
    fix: string
  }
}

export const mockBugs: Bug[] = data as Bug[];
// Analytics utilities
export function getBugsByType(bugs: Bug[]) {
  const types: Record<string, number> = {}
  bugs.forEach((bug) => {
    types[bug.type] = (types[bug.type] || 0) + 1
  })
  return types
}

export function getBugsOverTime(bugs: Bug[]) {
  const timeline: Record<string, number> = {}
  bugs.forEach((bug) => {
    const date = new Date(bug.time).toISOString().split("T")[0]
    timeline[date] = (timeline[date] || 0) + 1
  })
  return Object.entries(timeline)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getBugsByModule(bugs: Bug[]) {
  const modules: Record<string, number> = {}
  bugs.forEach((bug) => {
    const moduleName = bug.module.split(".")[0]
    modules[moduleName] = (modules[moduleName] || 0) + 1
  })
  return Object.entries(modules)
    .map(([module, count]) => ({ module, count }))
    .sort((a, b) => b.count - a.count)
}
