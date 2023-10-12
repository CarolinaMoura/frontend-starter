import { getChatResponse } from "../external_apis/chat";
import { getDalleResponse } from "../external_apis/dalle";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface ThumbnailDoc extends BaseDoc {
  content: string;
  prompt: string;
  image: string;
}

export default class ThumbnailConcept {
  private readonly thumbnails = new DocCollection<ThumbnailDoc>("thumbnails");

  async createThumbnail(content: string): Promise<string> {
    const alreadyExists = await this.thumbnails.readOne({ content });
    if (alreadyExists) {
      return alreadyExists.image;
    }
    // generate prompt by calling GPT-3.5
    const prompt = await getChatResponse(content).then((val) => val.prompt);

    // generate image
    const image = await getDalleResponse(prompt);

    // insert to the database
    await this.thumbnails.createOne({
      content,
      prompt,
      image,
    });

    return this.createThumbnail(content);
  }
}
