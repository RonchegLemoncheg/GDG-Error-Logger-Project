using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using DotNetEnv; // Keep this using, but remove the .Load() call for clean NuGet deployment.

class AILogger
{
    const int MAX_WORDS = 30;

    private const string prompt =
        "You are a specialized AI assistant that completes structured data analysis.\n\nYou must use the provided JSON, apply the following instruction, and return ONLY the final JSON object. Do not include any other text, explanations, or code fences.";

    private static string promptText =
        $"add to the json analyse: that will contain cause: and fix: , fill in with {MAX_WORDS} words.";

    public static async Task<string> AnalyzeJsonAsync(string inputJson)
    {
        // For a true NuGet package, we rely on the consumer (the application)
        // to set the environment variable beforehand.
        var apiKey = "AIzaSyCvsSvoF5r0GGfTdH91fOw7CyilfyCXCQs";
        
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new Exception("GEMINI_API_KEY environment variable is not set. Ensure the consuming application loads the .env file or sets the key.");
        }
        
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
        Console.WriteLine(responseJson);

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
            var rawGeneratedText = textElement.GetString() ?? throw new Exception("Generated text was null.");

            // FIX: Strip surrounding Markdown code fences (e.g., ```json\n...\n```)
            var cleanedJson = Regex.Replace(
                rawGeneratedText, 
                @"^(\s*```(json)?\s*)|(\s*```\s*)$", 
                string.Empty, 
                RegexOptions.Multiline | RegexOptions.IgnoreCase)
                .Trim();

            if (string.IsNullOrWhiteSpace(cleanedJson))
            {
                throw new Exception("AI returned empty or only code fence text.");
            }

            return cleanedJson;
        }
        
        throw new Exception("Could not extract generated text from Gemini response structure.");
    }
}