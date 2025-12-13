using System.Text;
using System.Text.Json;
using DotNetEnv;
class Program
{
    const int MAX_WORDS = 30;

    private const string prompt =
        "You are a specialized AI assistant that completes structured data analysis.\n\nYou must use the provided JSON, apply the following instruction, and return ONLY the final JSON object. Do not include any other text, explanations, or code fences.";
    private  static string detailedPrompt = $"fill in cause and fix with maximum {MAX_WORDS} words if bug is unresolved then fill in fix with potential fix";
    public async static Task Main(string[] args)
    {
        Console.Write(await AnalyzeJsonAsync("{\n  \"bug_id\": \"BM-2025-00042\",\n  \"type\": \"compile\",\n  \"status\": \"resolved\",\n\n  \"module\": \"UserService\",\n  \"function\": \"CreateUser\",\n\n  \"error\": {\n    \"code\": \"CS8602\",\n    \"message\": \"Dereference of a possibly null reference\",\n    \"line\": 42\n  },\n\n  \"code_snippet\": {\n    \"before\": [\n      \"var name = user.Name;\",\n      \"Console.WriteLine(name.Length);\"\n    ],\n    \"after\": [\n      \"if (user?.Name == null) return;\",\n      \"Console.WriteLine(user.Name.Length);\"\n    ]\n  },\n\n  \"time\": {\n    \"first_seen\": \"2025-12-13T10:20:00Z\",\n    \"last_seen\": \"2025-12-13T10:28:30Z\",\n    \"duration_seconds\": 510\n  },\n}\n\nadd to this json:\n  \"analysis\": {\n    \"cause\": \"\",\n    \"fix\": \"\",\n  }\n\n",detailedPrompt));
    }

 public static async Task<string> AnalyzeJsonAsync(string inputJson, string promptText)
    {
        Env.Load("../../../.env");
        var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new Exception("GEMINI_API_KEY is not set");
        
        var baseUri = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
        
        var uriBuilder = new UriBuilder(baseUri);
        uriBuilder.Query = $"key={apiKey}"; 
        
        var url = uriBuilder.ToString();
        
        var fullPrompt = 
            $"""
             

             JSON Input:
             ```json
             {inputJson}
             ```

             Instruction:
             {promptText}
             """;
        
        var geminiRequest = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new
                        {
                            text = fullPrompt
                        }
                    }
                }
            }
        };
        
        var requestJson = JsonSerializer.Serialize(geminiRequest);

        using var client = new HttpClient();
        var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        var response = await client.PostAsync(url, content);
        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Gemini API Error: {response.StatusCode} - {responseJson}");

        using var document = JsonDocument.Parse(responseJson);
        
        if (document.RootElement.TryGetProperty("candidates", out var candidates) && 
            candidates.GetArrayLength() > 0 && 
            candidates[0].TryGetProperty("content", out var contentElement) &&
            contentElement.TryGetProperty("parts", out var parts) && 
            parts.GetArrayLength() > 0 && 
            parts[0].TryGetProperty("text", out var textElement))
        {
            return textElement.GetString() ?? throw new Exception("Generated text was null.");
        }
        
        throw new Exception("Could not extract generated text from Gemini response structure.");
    }
}