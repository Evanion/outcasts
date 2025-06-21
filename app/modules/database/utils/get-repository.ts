import type {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from "typeorm";

export function GetRepository<
  T extends ObjectLiteral,
  K extends typeof Repository<T>
>(entity: EntityTarget<T>, Cls: K, db: DataSource) {
  return new Cls(entity, db.getRepository(entity).manager) as InstanceType<K>;
}
