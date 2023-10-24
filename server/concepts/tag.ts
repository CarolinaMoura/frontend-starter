import { ObjectId } from "mongodb";
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
    const tagId = (await this.getTagByName(tagName))._id;

    const allResults = await this.attachments.readMany({});
    const toReturn = allResults
      .filter((att) => {
        return att.tag.equals(tagId);
      })
      .map((att) => att.attachedTo);
    return toReturn;
  }

  public async getAllTags() {
    return this.tags.readMany({});
  }

  public async getAllTagsFromPost(postId: ObjectId) {
    const attachments = await this.attachments.readMany({ attachedTo: postId });
    return Promise.all(
      attachments.map(async (attachments) => {
        const tagName = await this.tags.readOne({ _id: attachments.tag });
        return {
          _id: attachments.attachedTo,
          attachedTo: attachments.attachedTo,
          dateCreated: attachments.dateCreated,
          dateUpdated: attachments.dateUpdated,
          tag: attachments.tag,
          tagName: tagName?.name,
        };
      }),
    );
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
