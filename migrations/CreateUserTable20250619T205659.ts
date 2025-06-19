import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable20250619T205659 implements MigrationInterface {
    name = 'CreateUserTable20250619T205659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "persona" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_13aefc75f60510f2be4cd243d71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "battletag" character varying(255) NOT NULL, "sub" character varying(255) NOT NULL, "personaId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1b62505472c8fb535394b7d42f3" UNIQUE ("battletag"), CONSTRAINT "UQ_3641ff83ff7c23b2760b3df56d4" UNIQUE ("sub"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_92f09d8f74b60402513dbbc6d57" FOREIGN KEY ("personaId") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_92f09d8f74b60402513dbbc6d57"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "persona"`);
    }
}