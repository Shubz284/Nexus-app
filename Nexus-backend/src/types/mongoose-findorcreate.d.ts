declare module "mongoose-findorcreate" {
  import { Schema, Document, Model } from "mongoose";

  interface FindOrCreateResult<T> {
    doc: T;
    created: boolean;
  }

  interface FindOrCreatePlugin {
    <T extends Document>(schema: Schema<T>): void;
  }

  interface ModelWithFindOrCreate<T extends Document> extends Model<T> {
    findOrCreate(
      conditions: any,
      doc?: any,
      options?: any,
      callback?: (err: any, doc: T, created: boolean) => void
    ): Promise<FindOrCreateResult<T>>;
  }

  const findOrCreate: FindOrCreatePlugin;
  export = findOrCreate;
}
