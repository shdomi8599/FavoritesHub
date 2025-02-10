import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739204168842 implements MigrationInterface {
  name = "Migration1739204168842";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`presets\` ADD \`order\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`presets\` DROP COLUMN \`order\``);
  }
}
