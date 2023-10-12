import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface FeedDoc extends BaseDoc {
  user: ObjectId;
  orderedPosts: ObjectId[];
}

// maybe make this a new concept?
function calculateRelevance(user: ObjectId, post: ObjectId) {
  return 0;
}

export default class FeedConcept {
  // Representation invariant
  //      * orderedPosts is always ordered from most relevant post (0)
  //        and least relevant post (orderedPosts.length-1).
  //      * there's always at most a single entry with a certain user id.
  private readonly feeds = new DocCollection<FeedDoc>("feeds");

  public async addToFeed(user: ObjectId, post: ObjectId) {
    const feedId = await this.getFeedByUser(user);
    const feed = await this.getFeedById(feedId);
    const rank = calculateRelevance(user, post);
    feed.orderedPosts.splice(rank, 0, post);
    await this.feeds.updateOne({ _id: feedId }, { orderedPosts: feed.orderedPosts });
    return feedId;
  }

  public async removeFromFeed(user: ObjectId, post: ObjectId) {
    const feedId = await this.getFeedByUser(user);
    const feed = await this.getFeedById(feedId);
    const newOrder = feed.orderedPosts.filter((elt) => elt !== post);
    await this.feeds.updateOne({ _id: feedId }, { orderedPosts: newOrder });
    return feed;
  }

  public async getFeedById(id: ObjectId) {
    const feed = await this.feeds.readOne({ _id: id });
    if (!feed) {
      throw new NotFoundError("Feed id not found");
    }
    return feed;
  }

  // Returns the id of the feed the user. If the feed doesn't exist,
  // creates one.
  public async getFeedByUser(user: ObjectId): Promise<ObjectId> {
    const feed = await this.feeds.readOne({ user });
    if (feed) return feed._id;
    return this.feeds.createOne({ user, orderedPosts: [] });
  }
}
