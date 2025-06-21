import "reflect-metadata";
import { DataSource } from "typeorm";
import { Container } from "typedi";
import { User } from "~/modules/user/entities/user.entity";
import { Persona } from "~/modules/persona/entities/persona.entity";

export interface TestDatabaseConfig {
  entities: any[];
  dropSchema?: boolean;
  synchronize?: boolean;
  logging?: boolean;
}

export interface TestDatabase {
  setup(): Promise<void>;
  teardown(): Promise<void>;
  clearData(): Promise<void>;
  getDataSource(): DataSource;
}

export function createTestDatabase(config: TestDatabaseConfig): TestDatabase {
  const dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: config.entities,
    dropSchema: config.dropSchema ?? true,
    synchronize: config.synchronize ?? true,
    logging: config.logging ?? false,
  });

  return {
    async setup() {
      await dataSource.initialize();
    },

    async teardown() {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    },

    async clearData() {
      if (!dataSource.isInitialized) return;

      // Clear tables in dependency order to avoid foreign key constraint errors
      const userRepo = dataSource.getRepository(User);
      const personaRepo = dataSource.getRepository(Persona);

      // Clear users first (they reference personas)
      await userRepo.createQueryBuilder().delete().execute();
      
      // Then clear personas
      await personaRepo.createQueryBuilder().delete().execute();
    },

    getDataSource() {
      return dataSource;
    },
  };
} 