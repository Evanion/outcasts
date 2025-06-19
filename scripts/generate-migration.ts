import "reflect-metadata";
import { AppDataSource } from "../app/modules/db/db.server";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateMigration() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    
    console.log("Data source initialized successfully");
    
    // Generate migration
    const schemaBuilder = AppDataSource.driver.createSchemaBuilder();
    const syncQueries = await schemaBuilder.log();
    
    if (syncQueries.upQueries.length > 0) {
      // Create migration filename with timestamp
      const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
      const migrationName = `CreateUserTable${timestamp}`;
      const migrationPath = path.join(__dirname, "../migrations", `${migrationName}.ts`);
      
      // Create migration content
      const migrationContent = `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${migrationName} implements MigrationInterface {
    name = '${migrationName}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${syncQueries.upQueries.map(query => `        await queryRunner.query(\`${query.query.replace(/`/g, '\\`')}\`);`).join('\n')}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${syncQueries.downQueries.reverse().map(query => `        await queryRunner.query(\`${query.query.replace(/`/g, '\\`')}\`);`).join('\n')}
    }
}`;

      // Ensure migrations directory exists
      const migrationsDir = path.dirname(migrationPath);
      if (!fs.existsSync(migrationsDir)) {
        fs.mkdirSync(migrationsDir, { recursive: true });
      }
      
      // Write migration file
      fs.writeFileSync(migrationPath, migrationContent);
      console.log(`Migration created: ${migrationPath}`);
    } else {
      console.log("No schema changes needed - database is up to date");
    }
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

generateMigration(); 