import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { ConflictError, NotFoundError } from "./errors";

export interface SortDoc<T> extends BaseDoc {
  target: ObjectId;
  count: T;
}

export default class SortConcept<T> {
  private readonly arr = new DocCollection<SortDoc<T>>("sorts");

  constructor(
    private readonly cmp: (a: T, b: T) => number,
    private readonly upd: (a: T, toUpd: any) => T,
  ) {}

  public async create(target: ObjectId, iniVal: T): Promise<ObjectId> {
    const alreadyExists = await this.arr.readOne({ target });
    if (alreadyExists) {
      throw new ConflictError("Target already exists");
    }
    return this.arr.createOne({ target, count: iniVal });
  }

  public async update(target: ObjectId, toAdd: any): Promise<SortDoc<T> | null> {
    const entry = await this.arr.readOne({ target });
    if (!entry) {
      throw new NotFoundError("Target doesn't exist");
    }
    await this.arr.updateOne({ _id: entry._id }, { count: this.upd(entry.count, toAdd) });
    return this.arr.readOne({ _id: entry._id });
  }

  public async delete(target: ObjectId) {
    return this.arr.deleteOne({ _id: target });
  }

  public async sort(objs: ObjectId[]) {
    return this.arr
      .readMany({
        target: {
          $in: objs,
        },
      })
      .then((arr) => arr.sort((a: SortDoc<T>, b: SortDoc<T>) => this.cmp(a.count, b.count)));
  }
}
