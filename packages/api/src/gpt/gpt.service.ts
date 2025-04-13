import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "src/constants";

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

@Injectable()
export class GPTService {
  async recommendation() {
    let response = "";
    try {
      const gptResponse = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Only recommend one existing, real, fun, and trendy website that is accessible via https.",
          },
          {
            role: "user",
            content:
              "Recommend a fun and fresh website that actually exists. Only respond with the full URL (e.g., https://example.com). Do not make up sites. Only return sites that are live and working.",
          },
        ],
      });
      response = gptResponse.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      response = "Error fetching GPT response";
    } finally {
      return response;
    }
  }
}
