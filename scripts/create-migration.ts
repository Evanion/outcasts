import "reflect-metadata";
import { AppDataSource } from "../app/modules/db/db.server";

async function createMigration() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    
    console.log("Data source initialized successfully");
    console.log("Entities:", AppDataSource.entityMetadatas.map(e => e.name));
    
    // Check if schema sync is needed
    const schemaBuilder = AppDataSource.driver.createSchemaBuilder();
    const syncQueries = await schemaBuilder.log();
    
    if (syncQueries.upQueries.length > 0) {
      console.log("Schema changes needed:");
      console.log("UP queries:", syncQueries.upQueries);
      console.log("DOWN queries:", syncQueries.downQueries);
    } else {
      console.log("No schema changes needed - database is up to date");
    }
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createMigration(); 