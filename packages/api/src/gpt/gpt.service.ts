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
      console.log(1);
      const gptResponse = await client.responses.create({
        model: "gpt-4o",
        input:
          "Just recommend a fresh and fun site address. Don't say anything else. Recommend an address. Site address in https format.",
      });
      response = gptResponse.output_text;
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      response = "Error fetching GPT response";
    } finally {
      return response;
    }
  }
}
