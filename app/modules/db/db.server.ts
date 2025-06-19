import "reflect-metadata";
import { DataSource } from "typeorm";
import { Container } from "typedi";

// TypeORM Data Source Configuration
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false, // We'll use migrations
  logging: process.env.NODE_ENV === "development",
  entities: [
    "app/modules/**/*.entity.{ts,js}"
  ],
  migrations: ["migrations/*.ts"],
  subscribers: [],
});

// Initialize the database connection
export async function initializeDatabase(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("Database connection established");
  }
  return AppDataSource;
}

// Get the database connection (for dependency injection)
export function getDataSource(): DataSource {
  return AppDataSource;
}

// Register the DataSource with TypeDI
Container.set(DataSource, AppDataSource);

// Cleanup function for graceful shutdown
export async function closeDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("Database connection closed");
  }
} 