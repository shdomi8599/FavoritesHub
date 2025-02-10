import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739204070265 implements MigrationInterface {
  name = "Migration1739204070265";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`presets\` DROP COLUMN \`order\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`presets\` ADD \`order\` int NOT NULL DEFAULT '0'`,
    );
  }
}
