import "reflect-metadata";
import { AppDataSource } from "../app/modules/db/db.server";

async function runMigrations() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    
    console.log("Data source initialized successfully");
    
    // Run pending migrations
    const migrations = await AppDataSource.runMigrations();
    
    if (migrations.length > 0) {
      console.log(`Applied ${migrations.length} migration(s):`);
      migrations.forEach(migration => {
        console.log(`- ${migration.name}`);
      });
    } else {
      console.log("No pending migrations to run");
    }
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

runMigrations(); 