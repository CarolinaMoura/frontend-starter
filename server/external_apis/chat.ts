import axios from 'axios';
import { ChatCompletion } from 'openai/resources/chat';

const apiKey = process.env.OPEN_AI_KEY;

export interface IPrompt {
  "original": string;
  "prompt": string;
}

export async function getChatResponse(prompt: string): Promise<IPrompt> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "system",
            "content": "I'm going to give you people's posts. My goal is to create a visual representation of the post (either some kind of image that represents the mood or the tone, or an image that can represent some story described in the post). I'll give you the post and you should create a very specific prompt that I can send to Dall-E. Please be very specific and always require digital art or drawing. I don't want any text or numbers on the images. Never ask for images of people, and write it as a direct order (no need to preface with things like 'this is the prompt')."
          },
          {
            "role": "user",
            "content": prompt
          }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );
    const msg = response.data.choices[0] as ChatCompletion.Choice;
    
    // I believe ChatGPT will always reply a message content, otherwise
    // create a visual representation that something went wrong
    return {
      "original": prompt,
      "prompt": msg.message.content ?? "warning triangle"
    }
  } catch (error) {
    throw error;
  }
}

