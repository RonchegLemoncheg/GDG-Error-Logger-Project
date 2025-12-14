using System;
using System.Text.Json.Serialization;

namespace BugLensLogger;

// ----------------------------------------------------
// NEW CLASS: Analysis (The AI's Output)
// ----------------------------------------------------
/// <summary>
/// Represents the AI-generated analysis of the error.
/// </summary>
public class Analysis
{
    // These property names must match the instruction: analyse: { cause: , fix: }
    [JsonPropertyName("cause")]
    public string cause { get; set; }

    [JsonPropertyName("fix")]
    public string fix { get; set; }
}

// ----------------------------------------------------
// UPDATED CLASS: ErrorLogEntry
// ----------------------------------------------------
public class ErrorLogEntry
{
    // The unique ID for this specific bug instance
    [JsonPropertyName("bug_id")]
    public string BugId { get; set; } = $"BM-{DateTime.UtcNow:yyyy-MM-dd-HHmmss}";

    // Always "runtime"
    [JsonPropertyName("type")]
    public string Type { get; set; } = "runtime";

    // Application-specific module/service (e.g., "UserService")
    [JsonPropertyName("module")]
    public string Module { get; set; }

    // Function/Method name (e.g., "CreateUser")
    [JsonPropertyName("function")]
    public string Function { get; set; }

    // Details about the error itself
    [JsonPropertyName("error")]
    public ErrorDetails Error { get; set; }

    // This will now contain the full stack trace, which pinpoints the function and line.
    [JsonPropertyName("code_snippet")]
    public string CodeSnippet { get; set; }

    // Time of the error
    [JsonPropertyName("time")]
    public DateTime Time { get; set; } = DateTime.UtcNow;

    // NEW PROPERTY: AI Analysis
    [JsonPropertyName("analyse")]
    public Analysis analyse { get; set; }
}

// ----------------------------------------------------
// EXISTING CLASS: ErrorDetails (No change needed)
// ----------------------------------------------------
public class ErrorDetails
{
    // C# Error Code/Exception Type Name (e.g., "NullReferenceException")
    [JsonPropertyName("code")]
    public string Code { get; set; }

    // The Exception message
    [JsonPropertyName("message")]
    public string Message { get; set; }

    // Line number where the error was thrown (if PDB files are available)
    [JsonPropertyName("line")]
    public int Line { get; set; }
}