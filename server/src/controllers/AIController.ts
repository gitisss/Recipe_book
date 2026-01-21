import { Request, Response } from "express";

export const generateRecipeSuggestion = async (req: Request, res: Response) => {
  try {
    const { ingredients, diet, cuisine, mealType, mood } = req.body;

    const prompt = `
      You are a professional Michelin-star chef generator.
      Return a complete, realistic and culinary-sound recipe in STRICT JSON format only.

      All field VALUES must be written in Hebrew.

      Input preferences:
      Ingredients: ${ingredients || "any"}
      Diet: ${diet || "none"}
      Cuisine: ${cuisine || "any"}
      Meal type: ${mealType || "any"}
      Style: ${mood || "any"}

      JSON schema:
      {
        "title": "string",
        "description": "string",
        "ingredients": [
          { "name": "string", "quantity": "string", "unit": "string" }
        ],
        "instructions": ["string"],
        "prepTime": "string",
        "cookTime": "string",
        "servings": "string",
        "category": "עיקרית | קינוח | ארוחת בוקר | מרק | סלט | מאפה",
        "cuisine": "ישראלי | איטלקי | אסייתי | מזרח תיכוני | אמריקאי",
        "dietaryRestrictions": ["string"]
      }

      Rules:
      - JSON only, no markdown, no prose.
      - Ensure culinary logic: proportions must be realistic.
      - Category and cuisine must match EXACTLY one of the allowed values.
      `.trim();

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b", // Or your preferred model
        prompt,
        stream: true, // Enable streaming from Ollama
        format: "json", // Enforce JSON from Ollama
        options: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Ollama HTTP error ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      // Ollama streaming returns JSON lines like: { "model": "...", "created_at": "...", "response": "fragment", "done": false }
      // We need to parse these lines and extract the "response" field
      const lines = (buffer + chunk).split("\n");
      buffer = lines.pop() || ""; // Keep the incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            res.write(parsed.response); // Write just the content fragment to the client
          }
          if (parsed.done) {
            // Stream finished
          }
        } catch (e) {
          console.error("Error parsing Ollama chunk:", e);
        }
      }
    }

    // Process any remaining characters
    if (buffer) {
      try {
        const parsed = JSON.parse(buffer);
        if (parsed.response) {
          res.write(parsed.response);
        }
      } catch (e) {
        // Ignore if incomplete json at very end (unlikely for "done")
      }
    }

    res.end();

  } catch (error: any) {
    console.error("Recipe generation failed:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "אירעה שגיאה ביצירת הצעת מתכון",
        error: error.message,
      });
    } else {
      res.end(); // Close stream if headers already sent
    }
  }
};
