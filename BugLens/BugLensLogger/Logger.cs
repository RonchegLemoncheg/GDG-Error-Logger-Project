using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BugLensLogger;

public static class Logger
{
    // The relative path from the C# executable (e.g., bin/Debug/netX.Y/) 
    // to the desired log file location: ../../../../frontend/lib/
    private const string RelativeLogDirectory = "../../../../frontend/lib/";
    private const string LogFileName = "logs.json";

    public static void Init()
    {
        AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

        // Ensure the directory exists before attempting to write to the file
        string logDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, RelativeLogDirectory);
        try
        {
            if (!Directory.Exists(logDirectory))
            {
                Directory.CreateDirectory(logDirectory);
            }

            string logFilePath = Path.Combine(logDirectory, LogFileName);
            
            // Initialize log file with an empty array if needed
            if (!File.Exists(logFilePath))
            {
                File.WriteAllText(logFilePath, "[]");
            }
        }
        catch (Exception ex) 
        { 
            Console.WriteLine($"\n[Logger Error]: Failed to initialize log directory/file: {ex.Message}"); 
        }
    }

    private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
        if (e.ExceptionObject is Exception exception)
        {
            // 1. Launch the logging/analysis/launch task (runs in the background).
            Task loggingTask = Task.Run(() => HandleExceptionAsync(exception, e.IsTerminating));
        
            // 2. BLOCK the crashing thread briefly.
            // Wait for the background task to finish (I/O, analysis, launch).
            loggingTask.Wait(5000); 

            // 3. CRITICAL FINAL STEP: Block the main thread indefinitely.
            // This keeps the console window open until the developer presses ENTER.
            if (e.IsTerminating)
            {
                Console.WriteLine("\n-------------------------------------------");
                Console.WriteLine("Press ENTER to close this error terminal and terminate the C# app...");
                Console.ReadLine(); // <-- This line keeps the console alive!
            }
        }
    }
    
    // New async method to handle the logging logic
    private static async Task HandleExceptionAsync(Exception exception, bool isTerminating)
    {
        
        var stackTrace = new StackTrace(exception, true);
        var frame = stackTrace.GetFrame(0);

        var method = frame?.GetMethod();
        var lineNumber = frame?.GetFileLineNumber() ?? -1;
        var sourceFile = frame?.GetFileName();
        var methodName = method?.Name ?? "N/A";
        var moduleName = method?.DeclaringType?.FullName ?? "N/A";

        // --- 1. Attempt Code Extraction ---
        string rawCodeSnippet = null;
        string finalCodeSnippet;

        if (!string.IsNullOrEmpty(sourceFile) && lineNumber > 0)
        {
            rawCodeSnippet = GetFunctionCodeBlock(sourceFile, lineNumber, methodName);

            if (rawCodeSnippet.StartsWith("Source file not found") || rawCodeSnippet.StartsWith("Failed to locate"))
            {
                finalCodeSnippet = rawCodeSnippet;
            }
            else
            {
                finalCodeSnippet = CleanCodeSnippetForExport(rawCodeSnippet);
            }
        }
        else
        {
            finalCodeSnippet = $"ERROR: Failed to retrieve source file path or line number for function '{methodName}'.\n" +
                               "Action Required: Ensure the application's PDB files are deployed and match the assembly version.";
        }

        // --- 2. Build the Log Entry (Initial State) ---
        var logEntry = new ErrorLogEntry
        {
            Module = moduleName,
            Function = methodName,
            Error = new ErrorDetails
            {
                Code = exception.GetType().Name,
                Message = exception.Message,
                Line = lineNumber
            },
            CodeSnippet = finalCodeSnippet,
            analyse = new Analysis { cause = "Not yet analyzed.", fix = "Not yet analyzed." } // Placeholder
        };

        // --- 3. Perform AI Analysis ---
        try
        {
            var initialJson = JsonSerializer.Serialize(logEntry, new JsonSerializerOptions { WriteIndented = false });
            
            // NOTE: You must replace this with your actual AILogger call.
             var analyzedJsonString = await AILogger.AnalyzeJsonAsync(initialJson); 
            
            var analyzedLogEntry = JsonSerializer.Deserialize<ErrorLogEntry>(analyzedJsonString);
            
            if (analyzedLogEntry?.analyse?.cause != null)
            {
                logEntry.analyse = analyzedLogEntry.analyse;
            }
        }
        catch (Exception)
        {
            // Fail silently on AI error
        }

        // --- 4. Serialize and Export the array (Critical I/O) ---
        ExportErrorLog(logEntry);
        
        // --- 5. Launch Frontend (Linux Implementation) ---
        try
        {
            Console.WriteLine("\n=============================================");
            Console.WriteLine(">>> CRASH DETECTED: LAUNCHING BUG LENS FRONTEND");
            Console.WriteLine("=============================================");
            
            // The path to the 'frontend' root directory is needed for 'cd'
            var frontendPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "../../../../frontend"); 
            
            // Use 'npm run dev' to keep the local dev environment running
            var command = "npm run dev -- --port 3000";

            // Use single quotes for the path to handle spaces correctly
            string shellArguments = $"-c \"cd '{frontendPath}' && {command}\""; 

            Process.Start(new ProcessStartInfo
            {
                FileName = "/bin/sh",
                Arguments = shellArguments,
                WorkingDirectory = AppDomain.CurrentDomain.BaseDirectory,
                UseShellExecute = false,
                CreateNoWindow = true
            });
        
            Console.WriteLine($"\n✅ Bug Lens is running at: http://localhost:3000");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n[Logger Error]: Failed to launch frontend process: {ex.Message}");
        }
    }
    
    private static string GetFunctionCodeBlock(string filePath, int errorLine, string functionName)
    {
        if (!File.Exists(filePath))
        {
            return $"Source file not found at: {filePath}";
        }

        try
        {
            var lines = File.ReadAllLines(filePath);
            int errorLineIndex = errorLine - 1;

            if (errorLineIndex < 0 || errorLineIndex >= lines.Length)
            {
                return $"Error line number ({errorLine}) is outside file bounds.";
            }

            int startIndex = -1;
            int endIndex = -1;
            int bracketCount = 0;

            // 1. Scan UPWARD to find function signature
            for (int i = errorLineIndex; i >= 0; i--)
            {
                string line = lines[i].Trim();
                if (line.Contains(functionName + "(") && !line.StartsWith("//") && !line.StartsWith("/*"))
                {
                    startIndex = i;
                    bracketCount = line.Count(c => c == '{') - line.Count(c => c == '}');
                    break;
                }
            }

            if (startIndex == -1)
            {
                return $"Failed to locate function signature ('{functionName}') in source file.";
            }

            // 2. Scan DOWNWARD to find closing brace
            for (int i = startIndex; i < lines.Length; i++)
            {
                string line = lines[i];
                foreach (char c in line)
                {
                    if (c == '{') bracketCount++;
                    else if (c == '}')
                    {
                        bracketCount--;
                        if (bracketCount == 0 && i >= startIndex)
                        {
                            endIndex = i;
                            break;
                        }
                    }
                }
                if (endIndex != -1) break;
            }

            // 3. Extract and format the snippet
            var snippetBuilder = new StringBuilder();
            int finalEndIndex = (endIndex != -1) ? endIndex : Math.Min(lines.Length - 1, startIndex + 10);

            for (int i = startIndex; i <= finalEndIndex; i++)
            {
                string marker = (i == errorLineIndex) ? ">>>" : "   ";
                snippetBuilder.AppendLine($"{marker} {i + 1:D4}: {lines[i]}");
            }

            return snippetBuilder.ToString().Trim();
        }
        catch (Exception ex)
        {
            return $"Failed to read file due to I/O error: {ex.Message}";
        }
    }
    
    private static string CleanCodeSnippetForExport(string rawSnippet)
    {
        if (string.IsNullOrEmpty(rawSnippet)) return "Source file path or line number was unavailable.";

        var lines = rawSnippet.Split(new[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
        var cleanBuilder = new StringBuilder();

        foreach (var line in lines)
        {
            if (line.StartsWith("---") || line.StartsWith("Function:")) continue;

            int codeStartIndex = line.IndexOf(':');

            if (codeStartIndex > 0 && line.Length > codeStartIndex + 1)
            {
                cleanBuilder.AppendLine(line.Substring(codeStartIndex + 1).TrimStart());
            }
            else
            {
                cleanBuilder.AppendLine(line);
            }
        }

        return cleanBuilder.ToString()
            .Replace("\r\n", "\n")
            .Replace("\r", "\n")
            .Trim();
    }


    private static void ExportErrorLog(ErrorLogEntry newEntry)
    {
        string logFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, RelativeLogDirectory, LogFileName);

        try
        {
            string existingJson = File.ReadAllText(logFilePath);
            var options = new JsonSerializerOptions { WriteIndented = true };

            List<ErrorLogEntry> errorList = (string.IsNullOrWhiteSpace(existingJson) || existingJson.Trim() == "[]")
                ? new List<ErrorLogEntry>()
                : JsonSerializer.Deserialize<List<ErrorLogEntry>>(existingJson, options) ?? new List<ErrorLogEntry>();

            errorList.Add(newEntry);
            string newJson = JsonSerializer.Serialize(errorList, options);
            File.WriteAllText(logFilePath, newJson);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n[Logger Export Error]: Failed to update JSON log file at '{logFilePath}': {ex.Message}");
        }
    }
}

// =================================================================
// NOTE: Placeholder classes for compilation (assuming this structure)
// =================================================================
// NOTE: You still need to implement your AILogger class with the AnalyzeJsonAsync method
/* public static class AILogger
{
    public static Task<string> AnalyzeJsonAsync(string json) 
    { 
        // Implement AI call here
        throw new NotImplementedException();
    }
}
*/