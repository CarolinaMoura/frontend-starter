import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

const defaultUserProfile =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTEiIGhlaWdodD0iOTEiIHZpZXdCb3g9IjAgMCA5MSA5MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjkxIiBoZWlnaHQ9IjkxIiBmaWxsPSIjQ0JFODk2Ii8+CjxwYXRoIGQ9Ik04MC4wODIxIDkwLjM1N0M3OC4zNDY4IDkwLjc2NDcgNjQuNjgzMiA5MC42NTIxIDQ1LjkzOTEgOTAuNzY0N0MyNy4xOTUxIDkwLjg3NzMgMTIuMjAzOSA5MC43NjQ3IDEyLjIwMzkgOTAuNzY0N0MxMi4wOTEzIDcyLjAyMDYgMjcuMTk1MSA1Ni43MzQzIDQ1LjkzOTEgNTYuNjIxN0M2NC42ODMyIDU2LjUwOTEgNzkuOTY5NSA3MS42MTI5IDgwLjA4MjEgOTAuMzU3WiIgZmlsbD0iIzE1N0YwMyIvPgo8Y2lyY2xlIGN4PSI0NS44NDY4IiBjeT0iMzgiIHI9IjIwIiBmaWxsPSIjMTU3RjAzIi8+Cjwvc3ZnPgo=";

export interface UserDoc extends BaseDoc {
  username: string;
  password: string;
  picture: string;
}

export default class UserConcept {
  public readonly users = new DocCollection<UserDoc>("users");

  async create(username: string, password: string, picture = defaultUserProfile) {
    await this.canCreate(username, password);
    const _id = await this.users.createOne({ username, password, picture });
    return { msg: "User created successfully!", user: await this.users.readOne({ _id }) };
  }

  private sanitizeUser(user: UserDoc) {
    // eslint-disable-next-line
    const { password, ...rest } = user; // remove password
    return rest;
  }

  async getUserById(_id: ObjectId) {
    const user = await this.users.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.sanitizeUser(user);
  }

  async getUserByUsername(username: string) {
    const user = await this.users.readOne({ username });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.sanitizeUser(user);
  }

  async idsToUsernames(ids: ObjectId[]) {
    const users = await this.users.readMany({ _id: { $in: ids } });

    // Store strings in Map because ObjectId comparison by reference is wrong
    const idToUser = new Map(users.map((user) => [user._id.toString(), user]));
    return ids.map((id) => idToUser.get(id.toString())?.username ?? "DELETED_USER");
  }

  async getUsers(username?: string) {
    // If username is undefined, return all users by applying empty filter
    const filter = username ? { username } : {};
    const users = (await this.users.readMany(filter)).map(this.sanitizeUser);
    return users;
  }

  async authenticate(username: string, password: string) {
    const user = await this.users.readOne({ username, password });
    if (!user) {
      throw new NotAllowedError("Username or password is incorrect.");
    }
    return { msg: "Successfully authenticated.", _id: user._id };
  }

  async update(_id: ObjectId, update: Partial<UserDoc>) {
    if (update.username !== undefined) {
      await this.isUsernameUnique(update.username);
    }
    await this.users.updateOne({ _id }, update);
    return { msg: "User updated successfully!" };
  }

  async delete(_id: ObjectId) {
    await this.users.deleteOne({ _id });
    return { msg: "User deleted!" };
  }

  async userExists(_id: ObjectId) {
    const maybeUser = await this.users.readOne({ _id });
    if (maybeUser === null) {
      throw new NotFoundError(`User not found!`);
    }
  }

  private async canCreate(username: string, password: string) {
    if (!username || !password) {
      throw new BadValuesError("Username and password must be non-empty!");
    }
    await this.isUsernameUnique(username);
  }

  private async isUsernameUnique(username: string) {
    if (await this.users.readOne({ username })) {
      throw new NotAllowedError(`User with username ${username} already exists!`);
    }
  }
}
