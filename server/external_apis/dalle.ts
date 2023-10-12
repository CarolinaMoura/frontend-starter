import axios from "axios";

const apiKey = process.env.OPEN_AI_KEY;

export async function getDalleResponse(prompt: string): Promise<string> {
    const response = await axios.post("https://api.openai.com/v1/images/generations", {
        "prompt": prompt,
        "n": 1,
        "size": "256x256",
        "response_format": "b64_json"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });
    return response.data.data[0].b64_json;
}