import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCachedChangelog, setCachedChangelog } from "./cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export const generateChangelog = async (commits: any[]) => {
    if (commits.length === 0) {
        return { features: [], fixes: [], improvements: [] };
    }

    // Check cache first to avoid burning AI credits
    const cached = await getCachedChangelog(commits);
    if (cached) {
        console.log('[AI] Using cached response');
        return cached;
    }

    const commitMessages = commits.map((c: any) => `- ${c.message}`).join('\n');
    const prompt = `
You are a changelog writer. Convert these git commits into user-friendly changelog entries.

Rules:
- Group by type: Features, Fixes, Improvements
- Use present tense ("Add" not "Added")
- Use **bold** for emphasis on important components
- Use \`code\` ticks for file names, variable names, or technical terms
- Remove unnecessary technical jargon (but keep important names)
- Merge similar commits
- Ignore: dependency updates, merge commits, formatting

Commits:
${commitMessages}

Output JSON only in this format:
{
  "features": ["..."],
  "fixes": ["..."],
  "improvements": ["..."]
}
`;

    const attemptGeneration = async (retryCount = 0): Promise<any> => {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log("RAW AI RESPONSE:", text);
            const jsonString = text.replace(/```json\n|\n```/g, '').trim();
            const parsed = JSON.parse(jsonString);

            // Cache successful response for future use
            await setCachedChangelog(commits, parsed);

            return parsed;
        } catch (error: any) {
            const fs = require('fs');
            fs.appendFileSync('ai-error.log', new Date().toISOString() + ': ' + error.message + '\n');

            if (error.message.includes('429') && retryCount < 3) {
                console.log(`Rate limited. Retrying (Attempt ${retryCount + 1})... Waiting 20s.`);
                await new Promise(resolve => setTimeout(resolve, 20000));
                return attemptGeneration(retryCount + 1);
            }

            console.error("AI Generation Error:", error);
            return { features: [], fixes: [], improvements: [] };
        }
    };

    return attemptGeneration();
};

