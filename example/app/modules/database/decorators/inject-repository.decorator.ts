import { type EntityTarget, type ObjectLiteral } from "typeorm";
import { appDataSource } from "../data-source";
import { Inject, Token, Container } from "typedi";

export function InjectRepository(
  entity: EntityTarget<ObjectLiteral>
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const entityName =
      typeof entity === "function" ? entity.name : entity.toString();
    const repositoryToken = new Token(`Repository<${entityName}>`);
    const repository = appDataSource.getRepository(entity);
    Container.set(repositoryToken, repository);

    return Inject(repositoryToken)(target, propertyKey, parameterIndex);
  };
}
