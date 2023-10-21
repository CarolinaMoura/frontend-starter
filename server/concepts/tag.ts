import { DeleteResult, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface AttachmentTagDoc extends BaseDoc {
  tag: ObjectId;
  attachedTo: ObjectId;
}

export interface TagDoc extends BaseDoc {
  name: string;
}

export default class TagConcept {
  // Representation invariant:
  //    there's always a single appearance of an attachment
  //    in the database.

  private readonly attachments = new DocCollection<AttachmentTagDoc>("attachments_tags");
  private readonly tags = new DocCollection<TagDoc>("tags");

  public async getAllWithTag(tagName: string) {
    const tagId = await this.getTagByName(tagName);
    return this.attachments
      .readMany(
        { tag: tagId },
        {
          projection: {
            attachedTo: 1,
          },
        },
      )
      .then((att) => att.map((elt) => elt.attachedTo));
  }

  public async getAllTags() {
    return this.tags.readMany({});
  }

  // If the post already has that tag, simply return that attachment
  // Otherwise, create a new attachment
  public async createAttachment(tagName: string, object: ObjectId): Promise<ObjectId> {
    const tagId = (await this.getTagByName(tagName))._id;
    const alreadyExists = await this.attachments.readOne({ tag: tagId, attachedTo: object });
    if (alreadyExists) return alreadyExists._id;
    return await this.attachments.createOne({ tag: tagId, attachedTo: object });
  }

  public async deleteAttachment(tagName: string, object: ObjectId): Promise<DeleteResult> {
    const tagId = (await this.getTagByName(tagName))._id;
    return this.attachments.deleteMany({ tag: tagId, attachedTo: object });
  }

  // If tag already exists, return the id of the entry
  public async createTag(tagName: string): Promise<ObjectId> {
    try {
      return (await this.getTagByName(tagName))._id;
    } catch (err) {
      return this.tags.createOne({ name: tagName });
    }
  }

  public async deleteTag(name: string): Promise<DeleteResult> {
    const tag = (await this.getTagByName(name))._id;
    await this.attachments.deleteMany({ tag });
    return this.tags.deleteOne({ name });
  }

  private async getTagByName(tagName: string) {
    const tag = await this.tags.readOne({ name: tagName });
    if (!tag) {
      throw new Error("Tag doesn't exist");
    }
    return tag;
  }
}
