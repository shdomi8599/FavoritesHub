import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739372200885 implements MigrationInterface {
    name = 'Migration1739372200885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`favorites\` ADD \`order\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`favorites\` DROP COLUMN \`order\``);
    }

}
