import FeedConcept from "./concepts/feed";
import FriendConcept from "./concepts/friend";
import PostConcept from "./concepts/post";
import SortConcept from "./concepts/sort";
import TagConcept from "./concepts/tag";
import ThumbnailConcept from "./concepts/thumbnail";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Tag = new TagConcept();
export const Feed = new FeedConcept();
export const Thumbnail = new ThumbnailConcept();
export const Views = new SortConcept<number>(
  (a: number, b: number) => (a < b ? -1 : 1),
  (a: number, b: number) => a + b,
);
