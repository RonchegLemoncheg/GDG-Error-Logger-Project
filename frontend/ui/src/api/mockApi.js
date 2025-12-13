// mockApi.js

// Basic error
const basicErrors = [
  {
    bug_id: "BM-2025-00042",
    type: "compile",
    status: "resolved",
    module: "UserService",
    function: "CreateUser",
    error: {
      code: "CS8602",
      message: "Dereference of a possibly null reference",
      line: 42
    },
    code_snippet: {
      before: [
        "var name = user.Name;",
        "Console.WriteLine(name.Length);"
      ],
      after: [
        "if (user?.Name == null) return;",
        "Console.WriteLine(user.Name.Length);"
      ]
    },
    time: {
      first_seen: "2025-12-13T10:20:00Z",
      last_seen: "2025-12-13T10:28:30Z",
      duration_seconds: 510
    },
    analysis: {
      cause: "Missing null-check before accessing object property",
      fix: "Added guard clause to validate null reference",
      weighted_score: 0.82,
      dependency: [
        "UserRepository.GetById",
        "UserValidator.Validate"
      ]
    }
  },
  {
    bug_id: "BM-2025-00043",
    type: "runtime",
    status: "open",
    module: "OrderService",
    function: "ProcessOrder",
    error: {
      code: "RS5001",
      message: "Null reference exception",
      line: 87
    },
    code_snippet: {
      before: [
        "var total = order.Items.Sum(i => i.Price);",
        "Console.WriteLine(total);"
      ],
      after: [
        "if(order.Items == null) return;",
        "var total = order.Items.Sum(i => i.Price);"
      ]
    },
    time: {
      first_seen: "2025-12-12T09:15:00Z",
      last_seen: "2025-12-12T09:20:00Z",
      duration_seconds: 300
    },
    analysis: {
      cause: "Order items can be null",
      fix: "Added null-check for order items",
      weighted_score: 0.67,
      dependency: ["InventoryService.GetItems"]
    }
  },
  {
    bug_id: "BM-2025-00044",
    type: "compile",
    status: "resolved",
    module: "TaskController",
    function: "Result",
    error: {
      code: "CS1061",
      message: "'Task' does not contain a definition for 'Complete'",
      line: 55
    },
    code_snippet: {
      before: [
        "task.Complete();",
        "Console.WriteLine(task.Status);"
      ],
      after: [
        "// Corrected call to CompleteTask method",
        "task.CompleteTask();",
        "Console.WriteLine(task.Status);"
      ]
    },
    time: {
      first_seen: "2025-12-11T14:00:00Z",
      last_seen: "2025-12-11T14:10:00Z",
      duration_seconds: 600
    },
    analysis: {
      cause: "Incorrect method name",
      fix: "Renamed method call to match Task class",
      weighted_score: 0.88,
      dependency: ["TaskService.GetTask"]
    }
  },
  {
    bug_id: "BM-2025-00045",
    type: "runtime",
    status: "open",
    module: "PaymentService",
    function: "ChargeCard",
    error: {
      code: "RS3002",
      message: "Index out of range exception",
      line: 102
    },
    code_snippet: {
      before: [
        "var lastPayment = payments[payments.Count - 1];",
        "ProcessPayment(lastPayment);"
      ],
      after: [
        "if(payments.Count == 0) return;",
        "var lastPayment = payments[payments.Count - 1];",
        "ProcessPayment(lastPayment);"
      ]
    },
    time: {
      first_seen: "2025-12-10T08:30:00Z",
      last_seen: "2025-12-10T08:35:00Z",
      duration_seconds: 300
    },
    analysis: {
      cause: "Payments array could be empty",
      fix: "Added check for empty payments array",
      weighted_score: 0.73,
      dependency: ["BankGateway.Charge", "PaymentValidator.Validate"]
    }
  }
];


// Summary
const summary = {
  total_errors: 2,
  resolved: 1,
  open: 1,
  repeated_errors: 0,
  avg_fix_time_seconds: 347.5
};

// Repeated errors
const repeated = {
  groups: [
    {
      fingerprint: "CS1061|TaskController|Result",
      module: "TaskController",
      function: "Result",
      error_code: "CS1061",
      type: "compile",
      occurrences: 3,
      firstSeenUtc: "2025-01-10T12:31:10Z",
      lastSeenUtc: "2025-01-10T12:40:00Z",
      fix_time_seconds: 530,
      avg_weighted_score: 0.88,
      status: "resolved"
    }
  ]
};

// Module risk
const moduleRisk = {
  modules: [
    {
      module: "UserService",
      total_errors: 12,
      repeated_errors: 4,
      avg_weighted_score: 0.75,
      avg_fix_time_seconds: 600,
      risk_score: 0.57,
      risk_level: "medium"
    },
    {
      module: "TaskController",
      total_errors: 6,
      repeated_errors: 1,
      avg_weighted_score: 0.40,
      avg_fix_time_seconds: 120,
      risk_score: 0.22,
      risk_level: "low"
    }
  ]
};

// Mock API functions
export const getSummary = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(summary), 300); // simulate network delay
  });
};

export const getErrors = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(basicErrors), 300);
  });
};

export const getErrorById = (id) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(basicErrors.find(error => error.bug_id === id), 300));
  });
};

export const getRepeatedErrors = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(repeated), 300);
  });
};

export const getModuleRisk = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(moduleRisk.modules), 300);
  });
};
