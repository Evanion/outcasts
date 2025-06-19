import "reflect-metadata";
import { DataSource } from "typeorm";
import { Container } from "typedi";
import { User } from "~/modules/auth/entities/user.entity";
import { Persona } from "~/modules/persona/entities/persona.entity";

export interface TestDatabaseConfig {
  entities: any[];
  dropSchema?: boolean;
  synchronize?: boolean;
  logging?: boolean;
}

export class TestDatabase {
  private dataSource: DataSource | null = null;
  private config: TestDatabaseConfig;

  constructor(config: TestDatabaseConfig) {
    this.config = {
      dropSchema: true,
      synchronize: true,
      logging: false,
      ...config,
    };
  }

  async setup(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    this.dataSource = new DataSource({
      type: "postgres",
      url: process.env.TEST_DATABASE_URL || "postgresql://outcastsUsr:outcastsPw@localhost:5432/outcasts_test",
      synchronize: this.config.synchronize,
      logging: this.config.logging,
      entities: this.config.entities,
      dropSchema: this.config.dropSchema,
    });

    await this.dataSource.initialize();
    
    // Register with TypeDI
    Container.set(DataSource, this.dataSource);
    
    return this.dataSource;
  }

  async teardown(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
      this.dataSource = null;
    }
  }

  getDataSource(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error("Test database not initialized. Call setup() first.");
    }
    return this.dataSource;
  }

  async clearData(): Promise<void> {
    if (!this.dataSource?.isInitialized) {
      return;
    }

    // Clear child tables first, then parent tables
    const orderedEntities = [User, Persona]; // User depends on Persona

    for (const entity of orderedEntities) {
      const repository = this.dataSource.getRepository(entity);
      await repository.createQueryBuilder().delete().execute();
    }
  }
}

// Factory function to create test database instances
export function createTestDatabase(config: TestDatabaseConfig): TestDatabase {
  return new TestDatabase(config);
} 