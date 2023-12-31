import { DeleteResult, ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Feed, Friend, Post, Tag, Thumbnail, User, Views, WebSession } from "./app";
import { BadValuesError, UnauthenticatedError } from "./concepts/errors";
import { FeedDoc } from "./concepts/feed";
import { PostDoc, PostOptions } from "./concepts/post";
import { AttachmentTagDoc } from "./concepts/tag";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { findRepeatedTags } from "./external_apis/chat";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.get("/users/id/:_id")
  async getUserById(_id: ObjectId) {
    return User.getUserById(_id);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    const allPosts = await Post.getByAuthor(user);
    for (const post of allPosts) {
      const allTags = await Tag.getAllTagsFromPost(post._id);
      for (const tag of allTags) {
        await Tag.deleteAttachment(tag.tagName ?? "", post._id);
      }
    }
    for (const post of allPosts) {
      await Post.delete(post._id);
    }
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.get("/posts/id")
  async getPostsById(id: ObjectId) {
    return Post.getById(id);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    const users = await User.getUsers();
    if (!created.post) {
      throw new Error("Something went wrong with the post's creation");
    }

    await Views.create(created.post._id, 1);
    for (const elt of users) {
      await Feed.addToFeed(elt._id, created.post._id);
    }
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    Post.isAuthor(user, _id)
      .then(() => Post.update(_id, update))
      .catch(() => new UnauthenticatedError("User is not author of the post"));
    return { msg: "Post updated successfully!" };
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id).catch(() => new UnauthenticatedError("User is not author of the post"));
    const users = await User.getUsers();
    for (const elt of users) {
      await Feed.removeFromFeed(elt._id, _id);
    }
    const allTags = await Tag.getAllTagsFromPost(_id);
    for (const tag of allTags) {
      await Tag.deleteAttachment(tag.tagName ?? "", _id);
    }
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  // ---- Tags ----
  @Router.get("/tags/:name")
  async getAllPostsWithTag(name: string): Promise<Array<Responses | null>> {
    try {
      const allPostsWithTag = await Tag.getAllWithTag(name);
      const actualPosts = await Promise.all(allPostsWithTag.map(async (post) => await Responses.post(await Post.getById(post))));
      console.log(actualPosts);
      return actualPosts;
    } catch {
      return [];
    }
  }
  @Router.get("/tags")
  async getAllTags(): Promise<String[]> {
    return (await Tag.getAllTags()).map((tag) => tag.name);
  }
  @Router.get("/tags/repeated/:newTag")
  async findRepeatedTag(newTag: string): Promise<String> {
    return await findRepeatedTags(newTag);
  }
  @Router.post("/tags/:name")
  async createTag(name: string): Promise<ObjectId> {
    return Tag.createTag(name);
  }
  @Router.delete("/tags")
  async deleteTag(name: string): Promise<DeleteResult> {
    return Tag.deleteTag(name);
  }
  @Router.get("/tags/attachments/:post")
  async checkPostAttachments(post: ObjectId): Promise<AttachmentTagDoc[]> {
    return Tag.getAllTagsFromPost(post);
  }
  @Router.post("/tags/attachments/:tag/:post/:is_delete")
  async createAttachment(session: WebSessionDoc, tag: string, post: ObjectId, is_delete: string) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, post).catch((e) => {
      throw new UnauthenticatedError("User doesn't own the post");
    });
    if (is_delete === "true") return Tag.deleteAttachment(tag, post);
    return Tag.createAttachment(tag, post);
  }

  // ---- Feeds ----
  @Router.get("/feeds")
  async getFeed(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const feedId = await Feed.getFeedByUser(user);
    const feedPosts: FeedDoc = await Feed.getFeedById(feedId);
    for (const post of feedPosts.orderedPosts) {
      await Views.update(post, 1);
    }
    return feedPosts;
  }

  // ---- Thumbnails ----
  @Router.post("/thumbnails")
  async createImage(content: string) {
    return Thumbnail.createThumbnail(content);
  }

  @Router.get("/thumbnails/:content")
  async getImage(content: string) {
    return Thumbnail.createThumbnail(content);
  }

  // ---- Highlights ----
  @Router.post("/highlights")
  async createHighlight(post: ObjectId, views: number) {
    return Views.create(post, views);
  }

  @Router.patch("/highlights")
  async updateHighlight(post: ObjectId, additionalViews: number) {
    return Views.update(post, additionalViews);
  }

  @Router.delete("/highlights")
  async deleteHighlight(post: ObjectId) {
    return Views.delete(post);
  }

  @Router.get("/highlights")
  async getHighlights(date: string) {
    if (isNaN(Date.parse(date))) {
      throw new BadValuesError("Input is an invalid date");
    }
    const parsedDate = new Date(date);
    parsedDate.setDate(parsedDate.getDate() + 1);
    parsedDate.setHours(0, 0, 0, 1);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setHours(23, 59, 59, 999);
    const posts = await Post.getPosts({
      dateUpdated: {
        $gte: parsedDate,
        $lt: endOfDay,
      },
    });
    const views = await Views.sort(posts.map((post) => post._id));
    views.reverse();
    const returnArray = [];
    for (const view of views) {
      for (const post of posts) {
        if (post._id.equals(view.target)) {
          returnArray.push(post);
        }
      }
    }

    return returnArray;
  }
}

export default getExpressRouter(new Routes());
